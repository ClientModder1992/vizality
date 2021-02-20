/* eslint-disable no-unused-vars */
import parseHTML, { attributesToProps, domToReact } from 'html-react-parser';
import { readdirSync, readFileSync } from 'fs';
import React, { memo } from 'react';
import { join, parse } from 'path';

import { excludeProperties } from '@vizality/util/object';
import { log, warn, error } from '@vizality/util/logger';
import { joinClassNames } from '@vizality/util/dom';
import { getModule } from '@vizality/webpack';

import { Clickable, Tooltip as TooltipContainer } from '.';

const _module = 'Component';
const _submodule = 'Icon';

/** @private */
const _log = (...message) => log({ module: _module, submodule: _submodule, message });
const _warn = (...message) => warn({ module: _module, submodule: _submodule, message });
const _error = (...message) => error({ module: _module, submodule: _submodule, message });

export const Icons = {};

(async () => {
  /*
   * We're going to process our assets folder SVGs now and turn them into React components.
   */
  const dirs = [ 'svg', 'logo' ];
  for (const dirName of dirs) {
    const icons = readdirSync(join(__dirname, '..', '..', 'assets', dirName)).map(item => parse(item).name);
    for (const name of icons) {
      const icon = readFileSync(join(__dirname, '..', '..', 'assets', dirName, `${name}.svg`), { encoding: 'utf8' });
      Icons[name] = memo(props => parseHTML(icon, {
        replace: domNode => {
          if (domNode.attribs && domNode.name === 'svg') {
            const attrs = attributesToProps(domNode.attribs);
            return (
              <svg {...attrs} {...props}>
                {domToReact(domNode.children)}
              </svg>
            );
          }
        }
      }));
    }
  }

  /*
   * @note The following is a sort of automated warning system to let us know when Discord
   * has added an icon to their batch, basically, so we can be made aware of and add it.
   */

  /*
   * These are Discord's icons that will crash the appl if attempted to render as a normal icon.
   */
  const blacklist = [
    './addDefaultIconProps',
    './ApplicationPlaceholder',
    './DiscordNitro',
    './DiscordWordmark',
    './InboxEmptyStateStars',
    './Gradient',
    './Nitro',
    './NitroClassic',
    './NitroStacked',
    './NitroClassicHorizontal',
    './PremiumGuildSubscriptionLogoCentered',
    './PremiumGuildSubscriptionLogoLeftAligned',
    './ActivityFilled',
    './Arrow',
    './IconType',
    './PremiumGuildTier',
    './PremiumGuildTier1Simple',
    './PremiumGuildTier2Simple',
    './PremiumGuildTier3Simple',
    './PremiumGuildTierSimple'
  ];

  /*
   * These are Discord's inherent icons I have purposely altered or removed for whatever reason.
   */
  const knownAlterations = [
    './ChannelTextNSFW',
    './CopyID',
    './EarlyAccess',
    './EmojiActivityCategory',
    './ExpandIcon',
    './Grid',
    './GridSmall',
    './InvertedGIFLabel',
    './LeftCaret',
    './MegaphoneNSFW',
    './MultipleChoice',
    './NitroWheel2',
    './PlatformSpotify',
    './PlatformSteam',
    './PlatformTwitch',
    './PlatformXbox',
    './PlatformBlizzard',
    './Play2',
    './RightCaret',
    './Synced',
    './TemplateIcon',
    './TitleBarClose',
    './TitleBarCloseMac',
    './TitleBarMaximize',
    './TitleBarMaximizeMac',
    './TitleBarMinimize',
    './TitleBarMinimizeMac',
    './TrendingArrow',
    './Unsynced',
    './UpdateAvailable',
    './Upload2'
  ];

  const registry = await getModule(m => m.id && typeof m.keys === 'function' && m.keys().includes('./Activity'), true);
  const Names = Object.keys(Icons);
  const DiscordIcons = registry.keys()
    .filter(k => !k.endsWith('.tsx') && !k.endsWith('.css') && !blacklist.includes(k) && !knownAlterations.includes(k))
    .map(m => m.substring(2));
  const missing = DiscordIcons.filter(icon => !Names.includes(icon));

  if (missing.length) _warn(`${missing.length} icons found to be missing:`, missing);
})();

export default memo(props => {
  let {
    name,
    icon,
    width = '24',
    height = '24',
    size,
    className,
    iconClassName,
    color = 'currentColor',
    tooltip,
    tooltipColor = 'black',
    tooltipPosition = 'top',
    onClick,
    onContextMenu,
    rawSVG = false
  } = props;

  try {
    if (size) {
      width = size;
      height = size;
    }

    const exposeProps = excludeProperties(props, 'name', 'icon', 'size', 'width', 'height', 'className', 'iconClassName', 'color', 'tooltip', 'tooltipColor', 'tooltipPosition', 'onClick', 'onContextMenu', 'rawSVG');

    if (!name) {
      throw new Error('You must specify a valid name property!');
    }

    const isClickable = Boolean(onClick || onContextMenu);

    const SVG = icon ? icon : Icons[name] ? Icons[name] : null;

    if (!SVG && !icon) {
      throw new Error(`"${name}" is not a valid name property.`);
    }

    const render = () => {
      // !rawSVG
      if (!rawSVG) {
        // !rawSVG and tooltip
        if (tooltip) {
          // !rawSVG and tooltip and clickable
          if (isClickable) {
            return (
              <TooltipContainer
                text={tooltip}
                color={tooltipColor}
                position={tooltipPosition}
              >
                <Clickable
                  className={joinClassNames(className, 'vz-icon-wrapper')}
                  onClick={onClick}
                  onContextMenu={onContextMenu}
                >
                  <SVG
                    vz-icon={name}
                    className={joinClassNames(iconClassName, 'vz-icon')}
                    fill={color}
                    width={width}
                    height={height}
                    {...exposeProps}
                  />
                </Clickable>
              </TooltipContainer>
            );
          }
          // !rawSVG and tooltip and !clickable
          return (
            <TooltipContainer
              className={joinClassNames(className, 'vz-icon-wrapper')}
              text={tooltip}
              color={tooltipColor}
              position={tooltipPosition}
            >
              <SVG
                vz-icon={name}
                className={joinClassNames(iconClassName, 'vz-icon')}
                fill={color}
                width={width}
                height={height}
                {...exposeProps}
              />
            </TooltipContainer>
          );
        }
        // !rawSVG and !tooltip and clickable
        if (isClickable) {
          return (
            <Clickable
              className={joinClassNames(className, 'vz-icon-wrapper')}
              onClick={onClick}
              onContextMenu={onContextMenu}
            >
              <SVG
                vz-icon={name}
                className={joinClassNames(iconClassName, 'vz-icon')}
                fill={color}
                width={width}
                height={height}
                {...exposeProps}
              />
            </Clickable>
          );
        }
        // !rawSVG and !tooltip and !clickable
        return (
          <div className={joinClassNames(className, 'vz-icon-wrapper')}>
            <SVG
              vz-icon={name}
              className={joinClassNames(iconClassName, 'vz-icon')}
              fill={color}
              width={width}
              height={height}
              {...exposeProps}
            />
          </div>
        );
      }
      // rawSVG
      return <SVG
        vz-icon={name}
        className={joinClassNames(className, 'vz-icon')}
        fill={color}
        width={width}
        height={height}
        {...exposeProps}
      />;
    };

    return render();
  } catch (err) {
    return _error(err);
  }
});

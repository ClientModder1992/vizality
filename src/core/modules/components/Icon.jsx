import parseHTML, { attributesToProps, domToReact } from 'html-react-parser';
import { readdirSync, readFileSync } from 'fs';
import React, { memo } from 'react';
import { join, parse } from 'path';

import { excludeProperties } from '@vizality/util/object';
import { toPascalCase } from '@vizality/util/string';
import { joinClassNames } from '@vizality/util/dom';
import { error } from '@vizality/util/logger';
import { getModule } from '@vizality/webpack';

import { Clickable, Tooltip as TooltipContainer } from '.';

const _module = 'Component';
const _submodule = 'Icon';

export const Blacklist = [
  './addDefaultIconProps', './ApplicationPlaceholder', './DiscordNitro',
  './DiscordWordmark', './InboxEmptyStateStars', './Gradient', './Nitro', './NitroClassic',
  './NitroStacked', './NitroClassicHorizontal', './PremiumGuildSubscriptionLogoCentered',
  './PremiumGuildSubscriptionLogoLeftAligned', './ActivityFilled', './Arrow', './IconType',
  './PremiumGuildTier', './PremiumGuildTier1Simple', './PremiumGuildTier2Simple',
  './PremiumGuildTier3Simple', './PremiumGuildTierSimple'
];

export const Icons = {

};

(async () => {
  const before = performance.now();
  const icons = readdirSync(join(__dirname, '..', '..', 'assets', 'svg'))
    .map(item => parse(item).name);
  console.log(icons);

  for (const name of icons) {
    const icon = readFileSync(join(__dirname, '..', '..', 'assets', 'svg', `${name}.svg`), { encoding: 'utf8' });
    Icons[toPascalCase(name)] = memo(props => parseHTML(icon, {
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
  const after = performance.now();
  const time = parseFloat((after - before).toFixed()).toString().replace(/^0+/, '') || 0;
  console.log(time);
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

  function _error (...data) {
    return error({ module: _module, submodule: _submodule }, ...data);
  }

  try {
    if (size) {
      width = size;
      height = size;
    }

    const exposeProps = excludeProperties(props, 'name', 'icon', 'size', 'width', 'height', 'className', 'iconClassName', 'color', 'tooltip', 'tooltipColor', 'tooltipPosition', 'onClick', 'onContextMenu', 'rawSVG');

    if (!name) {
      return _error('You must specify a "name" property for an Icon component.');
    }

    const registry = getModule(m => m.id && typeof m.keys === 'function' && m.keys().includes('./Activity'));

    const isClickable = Boolean(onClick || onContextMenu);

    const SVG = icon ? icon : Icons[name] ? Icons[name] : registry(`./${name}`).default;

    if (!SVG && !icon) {
      return _error(`Invalid "${name}" name property specified. A full list of acceptable icon names:`, this.Names);
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

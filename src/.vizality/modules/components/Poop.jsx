const { joinClassNames, string: { toKebabCase }, logger: { log, error, warn } } = require('@util');
const { getModule } = require('@webpack');
const { React } = require('@react');

const _module = 'Component';
const _submodule = 'Icon';

const Poo = getModule('Icon').Icon;

// These are icons that aren't really icons, or that will cause Discord to crash
const iconBlacklist = [ './addDefaultIconProps', './ApplicationPlaceholder', './DiscordNitro', './DiscordWordmark', './InboxEmptyStateStars', './Gradient', './Nitro', './NitroClassic', './NitroStacked', './NitroClassicHorizontal', './PremiumGuildSubscriptionLogoCentered', './PremiumGuildSubscriptionLogoLeftAligned', './ActivityFilled', './Arrow', './IconType', './PremiumGuildTier', './PremiumGuildTier1Simple', './PremiumGuildTier2Simple', './PremiumGuildTier3Simple', './PremiumGuildTierSimple' ];

const Poop = module.exports = React.memo(({ name, color, width, height, className, ...props }) => {
  const before = performance.now();
  const registry = getModule(m => m.id && typeof m.keys === 'function' && m.keys().includes('./Activity'));

  Poop.Names = registry.keys()
    .filter(k => !k.endsWith('.tsx') && !k.endsWith('.css') && !iconBlacklist.includes(k))
    .map(m => m.substring(2));

  if (!name) {
    return error(_module, _submodule, null, `You must specify a "name" property for an Icon component.`);
  }

  let icon;
  try {
    icon = registry(`./${name}`).default;
  } catch (err) {
    icon = registry('./Poop').default;
    error(_module, _submodule, null, `"${name}" is not an available icon. A full list of available icon names:`, Poop.Names);
  }

  // Set defaults
  width = width || 24;
  height = height || 24;

  // Fix an issue where the viewBox isn't correctly set on the Filter icon
  if (props.name === 'Filter') props.viewBox = '0 0 16 16';
  // Make the platform icons about the same size relatively
  if (props.name === 'PlatformBlizzard') props.viewBox = '4 4 16 16';
  if (props.name === 'PlatformSteam') props.viewBox = '4 4 16 16';
  if (props.name === 'PlatformTwitch') props.viewBox = '4 4 16 16';

  const after = performance.now();
  log('icon', 'icon', null, `Took ${parseFloat((after - before).toFixed(4)).toString().replace(/^0+/, '')} ms.`);

  return React.createElement(icon, {
    name,
    ...props
  });
});

const { joinClassNames, string: { toCamelCase }, logger: { error } } = require('@util');
const { getModule } = require('@webpack');
const { React } = require('@react');

const AsyncComponent = require('./AsyncComponent');
const CustomIcons = require('./CustomIcons');

const _module = 'Module';
const _submodule = 'Component:Icon';

/*
 * @todo Look into overwriting Discord native values with custom ones (i.e. Verified to overwrite Verified)
 * @todo Look into changing names or adding aliases... i.e. 'EmojiFoodCategory' to 'Popsicle'
 */

// These are icons that aren't really icons, or that will cause Discord to crash
const blacklist = [ './addDefaultIconProps', './ApplicationPlaceholder', './DiscordNitro', './DiscordWordmark', './InboxEmptyStateStars', './Gradient', './Nitro', './NitroClassic', './NitroClassicHorizontal', './PremiumGuildSubscriptionLogoCentered', './PremiumGuildSubscriptionLogoLeftAligned', './ActivityFilled', './Arrow', './IconType', './PremiumGuildTier', './PremiumGuildTier1Simple', './PremiumGuildTier2Simple', './PremiumGuildTier3Simple', './PremiumGuildTierSimple' ];

let Icons = [ ...Object.keys(CustomIcons) ];

const Icon = module.exports = AsyncComponent.from((async () => {
  const registry = await getModule(m => m.id && typeof m.keys === 'function' && m.keys().includes('./Activity'));
  Icon.Names = registry.keys()
    .filter(k => !k.endsWith('.tsx') && !k.endsWith('.css') && !blacklist.includes(k))
    .map(m => m.substring(2));

  const IconOverlaps = Icons.filter(icon => Icon.Names.includes(icon));

  if (IconOverlaps.length > 0) {
    console.warn(`${IconOverlaps.length} icon names found to be overlapping: "${IconOverlaps.join('", "')}"`);
  }

  Icons = Icons.filter(icon => !Icon.Names.includes(icon));

  Icon.Names = Icon.Names.concat(Icons).sort();

  return (props) => {
    if (!props.name) {
      error(_module, _submodule, null, `You must specific a 'name' property for an Icon component.`);
    }

    let icon;
    if (Icons.filter(icon => icon.includes(props.name)).length > 0) {
      icon = CustomIcons[props.name];
    } else {
      icon = registry(`./${props.name}`).default;
    }

    const newProps = global._.cloneDeep(props);
    delete newProps.name;
    delete newProps.className;

    // Set defaults
    newProps.width = props.width || 24;
    newProps.height = props.height || 24;

    // Fix an issue where the viewBox isn't correctly set on the Filter icon
    if (props.name === 'Filter') newProps.viewBox = '0 0 16 16';
    // Make the platform icons about the same size relatively
    if (props.name === 'PlatformBlizzard') newProps.viewBox = '4 4 16 16';
    if (props.name === 'PlatformSteam') newProps.viewBox = '4 4 16 16';
    if (props.name === 'PlatformTwitch') newProps.viewBox = '4 4 16 16';

    return React.createElement(icon, {
      className: joinClassNames('vizality-icon', toCamelCase(props.name), props.className),
      ...newProps
    });
  };
})());

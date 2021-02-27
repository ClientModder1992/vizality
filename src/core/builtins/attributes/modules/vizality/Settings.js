import { Events } from '@vizality/constants';

export default () => {
  const root = document.documentElement;

  const setAttribute = (setting, value) => {
    const { get } = vizality.settings;

    // These are the settings we want to track and add as attributes.
    const attributes = {
      transparentWindow: get('transparentWindow', false),
      experimentalWebPlatform: get('experimentalWebPlatform', false),
      smoothScrolling: get('smoothScrolling', true),
      reactDeveloperTools: get('reactDeveloperTools', false),
      hotReload: get('hotReload', false),
      replaceClyde: get('replaceClyde', true)
    };

    /**
     * Check if the setting is defined by default.
     * If it is, overwrite it with the new value.
     */
    if (attributes.hasOwnProperty(setting)) {
      attributes[setting] = value;
    }

    const activeSettings = Object.keys(attributes).filter(a => attributes[a]);

    // Check if there are any active settings, if not remove the attribute.
    if (!activeSettings.length) {
      root.removeAttribute('vz-settings');
    // Otherwise set them as vz-settings attribute values.
    } else {
      root.setAttribute('vz-settings', activeSettings.join(', '));
    }
  };

  // Set the settings initially
  setAttribute();

  const handleToggle = setting => {
    /**
     * @note We have to send the opposite of what the value reads here
     * because of async issues, it seems. It retrieves the previous value instead
     * of the current, so taking the inverse gives us the current value.
     */
    const value = !vizality.settings.get(setting);
    setAttribute(setting, value);
  };

  const handleUpdate = (setting, value) => {
    setAttribute(setting, value);
  };

  vizality.api.settings
    .on(Events.VIZALITY_SETTING_TOGGLE, handleToggle)
    .on(Events.VIZALITY_SETTING_UPDATE, handleUpdate);

  return () => {
    vizality.api.settings
      .removeListener(Events.VIZALITY_SETTING_TOGGLE, handleToggle)
      .removeListener(Events.VIZALITY_SETTING_UPDATE, handleUpdate);
    root.removeAttribute('vz-settings');
  };
};

import { getModule } from '@vizality/webpack';
import { Events } from '@vizality/constants';

export const labels = [ 'Misc' ];

export default main => {
  try {
    const root = document.documentElement;
    const setAttribute = (setting, value) => {
      root.setAttribute(`vz-${setting}`, value);
    };

    /*
     * Set up the Discord settings attributes we want initially.
     */
    (() => {
      const DiscordSettingsModule = getModule('locale', 'theme');
      if (!DiscordSettingsModule) return;
      setAttribute('theme', DiscordSettingsModule.theme);
      setAttribute('mode', DiscordSettingsModule.messageDisplayCompact ? 'compact' : 'cozy');
    })();

    const handleSettingsChange = settings => {
      if (settings.theme) setAttribute('theme', settings.theme);
      if (settings.messageDisplayCompact === true) {
        setAttribute('mode', 'compact');
      } else if (settings.messageDisplayCompact === false) {
        setAttribute('mode', 'cozy');
      }
    };

    vizality.on(Events.USER_SETTINGS_UPDATE, handleSettingsChange);
    return () => vizality.removeListener(Events.USER_SETTINGS_UPDATE, handleSettingsChange);
  } catch (err) {
    main.error(main._labels.concat(labels.concat('Settings')), err);
  }
};

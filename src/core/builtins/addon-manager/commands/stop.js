import { toPlural } from '@vizality/util/string';

export default {
  command: 'stop',
  description: 'Temporarily disables all addons. Reload Discord to restore.',
  icon: 'vz-asset://svg/NotAllowed.svg',
  async executor (_, type) {
    try {
      await vizality.manager[toPlural(type)].stop();
    } catch (err) {
      return {
        send: false,
        result: `There was a problem terminating all ${toPlural(type)}:`, err
      };
    }
  }
};

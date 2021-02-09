import { toPlural } from '@vizality/util/string';

export default {
  command: 'terminate',
  description: 'Temporarily disables all addons. Reload Discord to restore.',
  async executor (_, type) {
    try {
      await vizality.manager[toPlural(type)].terminate();
    } catch (err) {
      return {
        send: false,
        result: `There was a problem terminating all ${toPlural(type)}:`, err
      };
    }
  }
};

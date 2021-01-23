import { toPlural } from '@vizality/util/string';

export default {
  command: 'terminate',
  description: 'Temporarily disables all addons. Reload Discord to restore.',
  async executor (_, type) {
    await vizality.manager[toPlural(type)].terminate();
  }
};

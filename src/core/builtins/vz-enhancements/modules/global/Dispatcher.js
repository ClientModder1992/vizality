/**
 * This Dispatcher fix was created by Strencher. Thanks~
 */

import { FluxDispatcher } from '@vizality/webpack';

export default () => {
  FluxDispatcher.dispatch = function (args) {
    if (!args?.type || args.type !== 'USER_NOTE_LOAD_START') {
      return this._dispatch(args);
    }

    this.wait(() => this._dispatch(args));
  };
};

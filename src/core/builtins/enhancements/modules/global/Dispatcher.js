import { FluxDispatcher } from '@vizality/webpack';

/**
 * This Dispatcher fix was created by Strencher. Thanks~
 */
export default () => {
  FluxDispatcher.dispatch = function (args) {
    if (!args?.type) {
      return this._dispatch(args);
    }

    this.wait(() => this._dispatch(args));
  };
};

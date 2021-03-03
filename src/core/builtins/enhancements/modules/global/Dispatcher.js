import { FluxDispatcher } from '@vizality/webpack';

export const labels = [ 'Global' ];

export default main => {
  const ogDispatch = FluxDispatcher.dispatch;
  try {
    FluxDispatcher.dispatch = function (args) {
      this.wait(() => this._dispatch(args));
    };
  } catch (err) {
    main.error(main._labels.concat(labels.concat('Dispatcher')), err);
  }
  return () => FluxDispatcher.dispatch = ogDispatch;
};

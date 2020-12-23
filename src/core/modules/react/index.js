import { getModule } from '../webpack';

export const React = {
  ...getModule('createRef', 'createElement', 'Component', 'PureComponent')
};

export const ReactDOM = {
  ...getModule('render', 'createPortal')
};

export const Router = {
  ...getModule('BrowserRouter', 'Router')
};

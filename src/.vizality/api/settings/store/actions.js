const Webpack = require('@webpack');

const ActionTypes = require('./constants');

module.exports = {
  toggleSetting (category, setting, defaultValue) {
    Webpack.FluxDispatcher.dispatch({
      type: ActionTypes.TOGGLE_SETTING,
      category,
      setting,
      defaultValue
    });
  },
  updateSettings (category, settings) {
    Webpack.FluxDispatcher.dispatch({
      type: ActionTypes.UPDATE_SETTINGS,
      category,
      settings
    });
  },

  updateSetting (category, setting, value) {
    Webpack.FluxDispatcher.dispatch({
      type: ActionTypes.UPDATE_SETTING,
      category,
      setting,
      value
    });
  },

  deleteSetting (category, setting) {
    Webpack.FluxDispatcher.dispatch({
      type: ActionTypes.DELETE_SETTING,
      category,
      setting
    });
  }
};

import { existsSync, readdirSync, readFileSync, mkdirSync, writeFileSync } from 'fs';
import { debounce } from 'lodash';
import { join } from 'path';

import { Flux, FluxDispatcher } from '@vizality/webpack';
import { Directories } from '@vizality/constants';

import ActionTypes from './Constants';

if (!existsSync(Directories.SETTINGS)) {
  mkdirSync(Directories.SETTINGS);
}

function loadSettings (file) {
  const categoryId = file.split('.')[0];
  try {
    return [
      file.split('.')[0],
      JSON.parse(
        readFileSync(join(Directories.SETTINGS, file), 'utf8')
      )
    ];
  } catch (err) {
    // Possibly corrupted settings; let's consider them empty
    return [ categoryId, {} ];
  }
}

const settings = Object.fromEntries(
  readdirSync(Directories.SETTINGS)
    .filter(f => !f.startsWith('.') && f.endsWith('.json'))
    .map(loadSettings)
);

function updateSettings (category, newSettings) {
  if (!settings[category]) {
    settings[category] = {};
  }
  Object.assign(settings[category], newSettings);
}

function updateSetting (category, setting, value) {
  if (!settings[category]) {
    settings[category] = {};
  }
  if (value === void 0) {
    delete settings[category][setting];
  } else {
    settings[category][setting] = value;
  }
}

function toggleSetting (category, setting, defaultValue) {
  if (!settings[category]) {
    settings[category] = {};
  }
  const previous = settings[category][setting];
  if (previous === void 0) {
    settings[category][setting] = !defaultValue;
  } else {
    settings[category][setting] = !previous;
  }
}

function deleteSetting (category, setting) {
  if (!settings[category]) {
    settings[category] = {};
  }
  delete settings[category][setting];
}

class SettingsStore extends Flux.Store {
  constructor (Dispatcher, handlers) {
    super(Dispatcher, handlers);

    this._persist = debounce(this._persist.bind(this), 1000);
    this.addChangeListener(this._persist);
  }

  getAllSettings () {
    return settings;
  }

  getSettings (category) {
    return settings[category] || {};
  }

  getSetting (category, nodePath, defaultValue) {
    const nodePaths = nodePath.split('.');
    let currentNode = this.getSettings(category);

    for (const fragment of nodePaths) {
      currentNode = currentNode[fragment];
    }

    return (currentNode === void 0 || currentNode === null)
      ? defaultValue
      : currentNode;
  }

  getSettingsKeys (category) {
    return Object.keys(this.getSettings(category));
  }

  _persist () {
    for (const category in settings) {
      const file = join(Directories.SETTINGS, `${category}.json`);
      const data = JSON.stringify(settings[category], null, 2);
      writeFileSync(file, data);
    }
  }
}

export default new SettingsStore(FluxDispatcher, {
  [ActionTypes.UPDATE_SETTINGS]: ({ category, settings }) => updateSettings(category, settings),
  [ActionTypes.TOGGLE_SETTING]: ({ category, setting, defaultValue }) => toggleSetting(category, setting, defaultValue),
  [ActionTypes.UPDATE_SETTING]: ({ category, setting, value }) => updateSetting(category, setting, value),
  [ActionTypes.DELETE_SETTING]: ({ category, setting }) => deleteSetting(category, setting)
});

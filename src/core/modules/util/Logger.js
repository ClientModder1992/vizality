/* eslint-disable no-unused-vars */
import { getRandomColor, getContrastColor, blendColors, shadeColor } from './Color';
import { isArray, isEmptyArray, assertArray } from './Array';
import { isString, assertString } from './String';
import { assertObject } from './Object';

/**
 * Contains methods that output stylized messages to developer tools console.
 * @module util.logger
 * @namespace util.logger
 * @memberof util
 */

/** @private */
const _labels = [ 'Util', 'Logger' ];
const _log = (labels, ...message) => this.log({ labels: labels || _labels, message });
const _warn = (labels, ...message) => this.warn({ labels: labels || _labels, message });
const _error = (labels, ...message) => this.error({ labels: labels || _labels, message });

/**
 * Processes which type of console method to use.
 * @param {*} type Type of console method
 * @returns {('log'|'warn'|'error')} Type of console method to use
 * @private
 */
const _parseType = type => {
  return [ 'log', 'warn', 'error' ].find(t => t === type) || 'log';
};

/**
 * Sets the maximum amount of badges that can be used in a single console message.
 */
export const MAX_LABELS_COUNT = 10;

/**
 * Contains a list of modules and their color badge associations.
 * @private
 */
const modules = {
  api:            [ '#dc2167', '#242a85' ],
  util:           [ '#4b2d73', '#c65d00' ],
  core:           [ '#591870', '#ce03e5' ],
  http:           [ '#e63200', '#2e89c9' ],
  manager:        [ '#9ee945', '#782049' ],
  builtin:        [ '#267366', '#ffffff' ],
  plugin:         [ '#42ffa7', '#594bda' ],
  theme:          [ '#b68aff', '#f3523d' ],
  nativediscord:  [ '#7289da', '#18191c' ],
  module:         [ '#ed7c6f', '#34426e' ],
  patch:          [ '#a70338', '#0195b5' ],
  watcher:        [ '#fcff8d', '#963b8a' ],
  component:      [ '#162a2e', '#e58ede' ]
};

/**
 * Outputs messages to console of varying types. Outputted messages contain a badge, label(s), and a message.
 * @param {object} options Options for the console message
 * @param {string} [options.type='log'] Type of console method to use
 * @param {string} [options.badge='vz-asset://image/logo.png'] Badge image URL
 * @param {Array<string|object>} [options.labels=[]] Label texts, or objects with text and color properties for each label. Limit of 10.
 * @param {string} [options.labels.text] Text for the main module label
 * @param {string} [options.labels.color] Text for the main module label
 * @param {*|Array<*>} [options.message] Contents of the console message
 * @private
 */
const _logHandler = options => {
  try {
    assertObject(options);
    let { type, badge, labels, message } = options;

    labels = labels || [];
    type = _parseType(type);
    badge = badge || 'vz-asset://image/logo.png';

    // Throw an error if any of the arg types aren't as expected
    assertArray(labels);
    assertString(type);
    assertString(badge);

    // If message isn't an array, turn it into one so we can process them all the same
    if (!isArray(message)) message = [ message ];

    const baseBadgeStyles = `
      display: inline-block;
      text-align: center;
      border-radius: 2px;
      font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif;
      text-transform: uppercase;
      font-size: 10px;
      font-weight: 600;
      line-height: 14px;
      margin-right: 3px;
      padding: 1px 4px;`;

    const badgeStyles = `
      display: inline-block;
      background-image: url('${badge}');
      background-repeat: no-repeat;
      background-position: center;
      background-size: contain;
      border-radius: 2px;
      text-align: center;
      padding: 2px 14px 5px 0;
      margin: 0 4px 1px 0;`;

    // If there aren't any labels, just send the badge and message
    if (!labels || isEmptyArray(labels)) {
      return console[type](
        `%c `,
        badgeStyles,
        ...message
      );
    }

    const processedLabels = [];
    for (const [ index, label ] of labels.entries()) {
      if (isString(label)) {
        let color;
        if ((index === 0 || index === 1) && modules[labels[0].toLowerCase()]) {
          color = modules[labels[0].toLowerCase()][index];
        } else if (index === 2 && modules[labels[0].toLowerCase()]) {
          color = blendColors(modules[labels[0].toLowerCase()][0], processedLabels[index - 1]?.color, 0.5);
        } else if (index > 2 && modules[labels[0].toLowerCase()]) {
          color = shadeColor(processedLabels[index - 1]?.color, 0.2);
        } else {
          color = getRandomColor();
        }
        processedLabels.push({
          text: label,
          color
        });
      } else {
        processedLabels.push({
          text: label.text,
          color: label.color || getRandomColor()
        });
      }
    }

    const texts = [];
    const styles = [];
    for (const label of processedLabels.slice(0, this.MAX_LABELS_COUNT)) {
      if (!label?.text || !label?.color) {
        throw new Error('Each label must contain a valid text and color property.');
      }
      texts.push(`%c${label.text}`);
      styles.push(
        `${baseBadgeStyles};
        color: ${getContrastColor(label.color)};
        background: ${label.color};`
      );
    }

    return console[type](
      `%c ${texts.join('')}`,
      badgeStyles,
      ...styles,
      ...message
    );
  } catch (err) {
    _error(_labels.concat('_logHandler'), err);
  }
};

/**
 * Logs an informational message to dev tools console.
 * @param {object} options Options for the console message
 * @param {string} [options.badge] Badge image URL
 * @param {Array<string|object>} [options.labels] Label texts, or objects with text and color properties for each label
 * @param {string} [options.labels.text] Text for the main module label
 * @param {string} [options.labels.color] Text for the main module label
 * @param {*|Array<*>} [options.message] Contents of the console message
 */
export const log = options => {
  try {
    assertObject(options);
    options.type = 'log';
    return _logHandler(options);
  } catch (err) {
    return _error(_labels.concat('log'), err);
  }
};

/**
 * Logs a warning message to dev tools console.
 * @param {object} options Options for the console message
 * @param {string} [options.badge] Badge image URL
 * @param {Array<string|object>} [options.labels] Label texts, or objects with text and color properties for each label
 * @param {string} [options.labels.text] Text for the main module label
 * @param {string} [options.labels.color] Text for the main module label
 * @param {*|Array<*>} [options.message] Contents of the console message
 */
export const warn = options => {
  try {
    assertObject(options);
    options.type = 'warn';
    return _logHandler(options);
  } catch (err) {
    return _error(_labels.concat('warn'), err);
  }
};

/**
 * Logs an error message to dev tools console.
 * @param {object} options Options for the console message
 * @param {string} [options.badge] Badge image URL
 * @param {Array<string|object>} [options.labels] Label texts, or objects with text and color properties for each label
 * @param {string} [options.labels.text] Text for the main module label
 * @param {string} [options.labels.color] Text for the main module label
 * @param {*|Array<*>} [options.message] Contents of the console message
 */
export const error = options => {
  try {
    assertObject(options);
    options.type = 'error';
    return _logHandler(options);
  } catch (err) {
    return _error(_labels.concat('error'), err);
  }
};

/**
 * Logs a deprecation (warning) message to dev tools console.
 * @param {object} options Options for the console message
 * @param {string} [options.badge] Badge image URL
 * @param {Array<string|object>} [options.labels] Label texts, or objects with text and color properties for each label
 * @param {string} [options.labels.text] Text for the main module label
 * @param {string} [options.labels.color] Text for the main module label
 * @param {*|Array<*>} [options.message] Contents of the console message
 */
export const deprecate = options => {
  try {
    assertObject(options);
    const { message } = options;
    options.type = 'warn';
    options.message = `Deprecation Notice: ${message}`;
    return _logHandler(options);
  } catch (err) {
    return _error(_labels.concat('deprecate'), err);
  }
};

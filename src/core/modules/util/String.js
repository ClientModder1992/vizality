import * as _chunk from 'chunk-text';
import pluralize from 'pluralize';

/**
 * @module util.string
 * @namespace util.string
 * @memberof util
 * @version 0.0.1
 */

export const isSingular = string => {
  return pluralize.isSingular(string);
};

export const isPlural = string => {
  return pluralize.isPlural(string);
};

export const toSingular = string => {
  return pluralize.singular(string);
};

export const toPlural = string => {
  return pluralize(string);
};

export const chunk = (string, numberOfCharacters) => {
  return _chunk(string, numberOfCharacters);
};

export const toHash = string => {
  let h1 = 0xdeadbeef ^ 0;
  let h2 = 0x41c6ce57 ^ 0;
  for (let i = 0, ch; i < string.length; i++) {
    ch = string.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};

/**
 * Removes diacritics from letters in a string.
 * @param {string} string String to check
 * @returns {string} Whether or not the string is a valid URL format
 * @example
 * // returns `false`
 * isUrl('imaurl.com')
 * @example
 * // returns `true`
 * isUrl('https://google.com')
 */
export const stripDiacritics = string => {
  const pattern = /[\u0300-\u036f]/g;
  return string.normalize('NFD').replace(pattern, '').normalize('NFC');
};

/**
 * Checks if a string is a valid URL format.
 * @param {string} string String to check
 * @returns {string} Whether or not the string is a valid URL format
 * @example
 * // returns `false`
 * isUrl('imaurl.com')
 * @example
 * // returns `true`
 * isUrl('https://google.com')
 */
export const isUrl = string => {
  const pattern = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/gm;
  return !!pattern.test(string);
};

/**
 * Converts a string to camel case.
 * @param {*} string Value to convert
 * @returns {string} String in camel case
 * @example
 * // returns `iAmACamelCaseString`
 * toCamelCase('I am a CAMEL CASE string.')
 */
export const toCamelCase = string => {
  return window._.camelCase(string);
};

/**
 * Converts a string to lowercase dot case.
 * @param {*} string String to convert
 * @returns {string} String in dot case
 * @example
 * // returns `i.am.a.dot.case.string`
 * toDotCase('I am a DOT CASE string.')
 */
export const toDotCase = string => {
  return window._.lowerCase(string).replace(/ /g, '.');
};

/**
 * Converts a string to title case.
 * @param {*} string String to convert
 * @returns {string} String in title case
 * @example
 * // returns `I Am A Title Case String`
 * toTitleCase('I am a TITLE CASE string.')
 */
export const toTitleCase = string => {
  return window._.startCase(window._.camelCase(string));
};

/**
 * Converts a string to sentence case.
 * @param {*} string String to convert
 * @returns {string} String in sentence case
 * @example
 * // returns `I am a sentence case string`
 * toSentenceCase('i am a SENTENCE CASE string.')
 */
export const toSentenceCase = string => {
  return window._.upperFirst(window._.lowerCase(string));
};

/**
 * Converts a string to pascal case.
 * @param {*} string String to convert
 * @returns {string} String in pascal case
 * @example
 * // returns `IAmAPascalCaseString`
 * toPascalCase('I am a PASCAL CASE string.')
 */
export const toPascalCase = string => {
  return window._.startCase(window._.camelCase(string)).replace(/ /g, '');
};

/**
 * Converts a string to lowercase path case.
 * @param {*} string String to convert
 * @returns {string} String in path case
 * @example
 * // returns `i/am/a/path/case/string`
 * toPathCase('I am a PATH CASE string.')
 */
export const toPathCase = string => {
  return window._.lowerCase(string).replace(/ /g, '/');
};

/**
 * Converts a string to lowercase snake case.
 * @param {*} string String to convert
 * @returns {string} String in snake case
 * @example
 * // returns `i_am_a_snake_case_string`
 * toSnakeCase('I am a SNAKE CASE string.')
 */
export const toSnakeCase = string => {
  return window._.snakeCase(string);
};

/**
 * Converts a string to kebab case.
 * @param {*} string String to convert
 * @returns {string} String in kebab case
 * @example
 * // returns `i-am-a-kebab-case-string`
 * toKebabCase('i am a keBab CASE string.')
 */
export const toKebabCase = string => {
  return window._.kebabCase(string);
};

/**
 * Checks if the input is a string.
 * @param {*} input Argument input
 * @returns {boolean} Whether or not the input is a string
 */
export const isString = input => {
  return window._.isString(input);
};

/**
 * Asserts that the input is a string. If it isn't, throw an error, otherwise do nothing.
 * @param {*} input Argument input
 * @returns {void}
 * @throws {TypeError} Throw an error if the input is not a string
 */
export const assertString = input => {
  if (!this.isString(input)) {
    return new TypeError(`Input must be a string, but received type of ${typeof input}.`);
  }
};

export const getRandomString = length => {
  const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
  }
  return result;
};

/**
 * OwO'ify string input.
 * Sourced from @see {@link https://gist.github.com/aqua-lzma/ced43969ef48056791179138589ebcac}
 * @param {*} string String to convert
 */
export const owoify = string => {
  const stutterChance = 0.1;
  const prefixChance = 0.05;
  const suffixChance = 0.15;

  const words = {
    love: 'wuv',
    mr: 'mistuh',
    dog: 'doggo',
    cat: 'kitteh',
    hello: 'henwo',
    hell: 'heck',
    fuck: 'fwick',
    fuk: 'fwick',
    shit: 'shoot',
    friend: 'fwend',
    stop: 'stawp',
    god: 'gosh',
    dick: 'peepee',
    penis: 'peepee'
  };

  const suffixes = [
    '(ﾉ´ з `)ノ',
    '( ´ ▽ ` ).｡ｏ♡',
    '(´,,•ω•,,)♡',
    '(*≧▽≦)',
    'ɾ⚈▿⚈ɹ',
    '( ﾟ∀ ﾟ)',
    '( ・ ̫・)',
    '( •́ .̫ •̀ )',
    '(▰˘v˘▰)',
    '(・ω・)',
    '✾(〜 ☌ω☌)〜✾',
    '(ᗒᗨᗕ)',
    '(・`ω´・)',
    ':3',
    '>:3',
    'hehe',
    'xox',
    '>3<',
    'murr~',
    'UwU',
    '*gwomps*'
  ];

  const prefixes = [
    'OwO',
    'OwO whats this?',
    '*unbuttons shirt*',
    '*nuzzles*',
    '*waises paw*',
    '*notices bulge*',
    '*blushes*',
    '*giggles*',
    'hehe'
  ];

  function replaceAll (string, map) {
    const source = Object.keys(map).map(i => `\\b${i}`);
    const re = new RegExp(`(?:${source.join(')|(?:')})`, 'gi');
    return string.replace(re, match => {
      let out = map[match.toLowerCase()];
      // Not very tidy way to work out if the word is capitalised
      if ((match.match(/[A-Z]/g) || []).length > match.length / 2) {
        out = out.toUpperCase();
      }
      return out;
    });
  }

  string = replaceAll(string, words);

  // OwO
  string = string.replace(/[rl]/gi, match =>
    match.charCodeAt(0) < 97 ? 'W' : 'w'
  );

  // Nya >;3
  string = string.replace(/n[aeiou]/gi, match =>
    `${match[0]}${match.charCodeAt(1) < 97 ? 'Y' : 'y'}${match[1]}`
  );

  // Words that end in y like cummy wummy
  string = string.replace(/\b[A-V,X-Z,a-v,x-z]\w{3,}y\b/gi, match =>
    `${match} ${match.charCodeAt(0) < 97 ? 'W' : 'w'}${match.slice(1)}`
  );

  // S-stutter
  string = string.split(' ').map(word => {
    if (word.length === 0 || word[0].match(/[a-zA-Z]/) === null) {
      return word;
    }

    while (Math.random() < stutterChance) {
      word = `${word[0]}-${word}`;
    }

    return word;
  }).join(' ');
  // Prefixes
  if (Math.random() < prefixChance) {
    string = `${string} ${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
  }

  // Suffixes
  if (Math.random() < suffixChance) {
    string = `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${string}`;
  }

  return string;
};

/**
 * Forked from DevYukine's http module and Snekfetch
 */

import querystring from 'querystring';
import https from 'https';
import http from 'http';
import url from 'url';

import { Repositories } from '@vizality/constants';
import { log, warn, error } from '@vizality/util/logger';

/**
 * @typedef HTTPResponse
 * @property {string} raw
 * @property {object|string} body
 * @property {boolean} ok
 * @property {number} statusCode
 * @property {string} statusText
 * @property {object} headers
 */

class HTTPError extends Error {
  constructor (message, res) {
    super(message);
    Object.assign(this, res);
    this.name = this.constructor.name;
  }
}

export default class GenericRequest {
  constructor (method, uri, headers) {
    this._labels = [ 'HTTP', this.constructor.name ];

    this.opts = {
      method,
      uri,
      query: {},
      headers: headers || {
        'User-Agent': `Vizality (https://github.com/${Repositories.VIZALITY})`
      }
    };
  }

  _objectify (key, value) {
    return key instanceof Object
      ? key
      : { [key]: value };
  }

  /**
   * Appends a querystring parameter
   * @param {string} key Parameter key
   * @param {string} value Parameter value
   * @returns {GenericRequest} Self, for fluent calls
   */
  query (key, value) {
    Object.assign(this.opts.query, this._objectify(key, value));
    return this;
  }

  /**
   * Sets a header for the request
   * @param {string} key Header name
   * @param {string} value Header value
   * @returns {GenericRequest} Self, for fluent calls
   */
  set (key, value) {
    Object.assign(this.opts.headers, this._objectify(key, value));
    return this;
  }

  /**
   * Specifies the data to send (for non-GET requests), which will get serialized based on the Content-Type header
   * <b>Make sure to specify the Content-Type header before calling this</b>
   * @param {object|string} data Data that'll be sent
   * @returns {GenericRequest} Self, for fluent calls
   */
  send (data) {
    if (data instanceof Object) {
      const serialize = this.opts.headers['Content-Type'] === 'application/x-www-form-urlencoded'
        ? querystring.encode
        : JSON.stringify;

      this.opts.data = serialize(data);
    } else {
      this.opts.data = data;
    }

    return this;
  }

  /**
   * Executes the request
   * @returns {Promise<HTTPResponse>}
   */
  execute () {
    return new Promise((resolve, reject) => {
      /**
       * Sketchy temporary change by me to get rid of some errors
       * from React Dev Tools
       */
      /* */ const opts = Object.assign(this.opts, resolve);
      /* */ if (!opts.uri) return;

      this._log('Performing request to', opts.uri);
      const { request } = opts.uri.startsWith('https')
        ? https
        : http;

      if (Object.keys(opts.query)[0]) {
        opts.uri += `?${querystring.encode(opts.query)}`;
      }

      const options = Object.assign({}, opts, url.parse(opts.uri));

      const req = request(options, (res) => {
        const data = [];

        res.on('data', (chunk) => {
          data.push(chunk);
        });

        res.once('error', reject);

        res.once('end', () => {
          const raw = Buffer.concat(data);

          const result = {
            raw,
            body: (() => {
              if ((/application\/json/).test(res.headers['content-type'])) {
                try {
                  return JSON.parse(raw);
                } catch (_) {
                  // fall through to raw
                }
              }

              return raw;
            })(),
            ok: res.statusCode >= 200 && res.statusCode < 400,
            statusCode: res.statusCode,
            statusText: res.statusMessage,
            headers: res.headers
          };

          if (result.ok) {
            resolve(result);
          } else {
            reject(new HTTPError(`${res.statusCode} ${res.statusMessage}`, result));
          }
        });
      });

      req.once('error', reject);

      if (this.opts.data) {
        req.write(this.opts.data);
      }

      req.end();
    });
  }

  /**
   * Executes the request and attaches success and/or error handler
   * @param {function({HTTPResponse})} resolver Success handler
   * @param {function({HTTPError})|null} rejector Error handler
   * @returns {Promise<HTTPResponse>}
   */
  then (resolver, rejector) {
    if (this._res) {
      return this._res.then(resolver, rejector);
    }

    return (
      this._res = this.execute().then(resolver, rejector)
    );
  }

  /**
   * Executes the requests and attaches an error handler
   * @param {function({HTTPError})|null} rejector Error handler
   * @returns {Promise<HTTPResponse>}
   */
  catch (rejector) {
    return this.then(null, rejector);
  }

  /** @private */
  _log (...message) { log({ labels: this._labels, message }); }
  _warn (...message) { warn({ labels: this._labels, message }); }
  _error (...message) { error({ labels: this._labels, message }); }
}

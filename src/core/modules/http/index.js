import GenericRequest from './GenericRequest';

/** @module http */

/**
 * Creates a GET request
 * @param {string} url URL to call
 * @returns {GenericRequest} Created request
 */
export function get (url, headers) {
  return new GenericRequest('GET', url, headers);
}

/**
 * Creates a POST request
 * @param {string} url URL to call
 * @returns {GenericRequest} Created request
 */
export function post (url, headers) {
  return new GenericRequest('POST', url, headers);
}

/**
 * Creates a PUT request
 * @param {string} url URL to call
 * @returns {GenericRequest} Created request
 */
export function put (url, headers) {
  return new GenericRequest('PUT', url, headers);
}

/**
 * Creates a DELETE request
 * @param {string} url URL to call
 * @returns {GenericRequest} Created request
 */
export function del (url, headers) {
  return new GenericRequest('DELETE', url, headers);
}

/**
 * Creates a HEAD request
 * @param {string} url URL to call
 * @returns {GenericRequest} Created request
 */
export function head (url) {
  return new GenericRequest('HEAD', url);
}

import { useLayoutEffect, useEffect, useState, useRef } from 'react';

import { get, post, put, del } from '../http';
import { getObjectURL } from '../util/File';

/**
 * Hook that uses util.file.getObjectURL to get an async collection of blob object URLs.
 * @param {string} requestType Request type. One of get, post, put, or del.
 * @param {url} url URL to call
 * @param {string|object} [headers] Headers
 */
export function useFetch (requestType, url, headers) {
  const [ response, setResponse ] = useState(null);
  const [ loading, setLoading ] = useState(true);
  const [ hasError, setHasError ] = useState(false);

  useEffect(() => {
    switch (requestType.toLowerCase()) {
      case 'get':
        return get(url, headers)
          .then(res => {
            setResponse(res.data);
            setLoading(false);
          })
          .catch(() => {
            setHasError(true);
            setLoading(false);
          });
      case 'post':
        return post(url, headers)
          .then(res => {
            setResponse(res.data);
            setLoading(false);
          })
          .catch(() => {
            setHasError(true);
            setLoading(false);
          });
      case 'put':
        return put(url, headers)
          .then(res => {
            setResponse(res.data);
            setLoading(false);
          })
          .catch(() => {
            setHasError(true);
            setLoading(false);
          });
      case 'del':
        return del(url, headers)
          .then(res => {
            setResponse(res.data);
            setLoading(false);
          })
          .catch(() => {
            setHasError(true);
            setLoading(false);
          });
      default:
        return get(url, headers)
          .then(res => {
            setResponse(res.data);
            setLoading(false);
          })
          .catch(() => {
            setHasError(true);
            setLoading(false);
          });
    }
  }, [ url ]);

  return [ response, loading, hasError ];
}

/**
 * Hook that uses `util.file.getObjectURL` to get an async collection of blob object URLs.
 * @param {string} path Path to the file or directory to be included
 * @param {string|Array} [allowedExtensions] List of desired file-type extensions to be included
 * @example
 * ```
 * const [ images, loading, error ] = useFetchImageObjectURL(dir);
 * return (
 *   {error && 'Uhoh, something went wrong.'}
 *   {loading && <Spinner />}
 *   {images && images.length &&
 *     <SomeReallyCoolComponent>
 *       <SomeChidren />
 *     </SomeReallyCoolComponent>
 *   }
 * )
 * ```
 * @note You will still need to revoke the URLs from this. A good idea is usually to revoke on unmount
 * which can be done as such:
 * @example
 * ```
 * useEffect(() => {
 *   return () => images && images.forEach(image => URL.revokeObjectURL(image.url));
 * }, [ images ]);
 * ```
 */
export function useFetchImageObjectURL (path, allowedExtensions) {
  const [ response, setResponse ] = useState(null);
  const [ loading, setLoading ] = useState(true);
  const [ hasError, setHasError ] = useState(false);

  useEffect(() => {
    getObjectURL(path, allowedExtensions)
      .then(res => {
        setResponse(res);
        setLoading(false);
      })
      .catch(() => {
        setHasError(true);
        setLoading(false);
      });
  }, [ path, allowedExtensions ]);

  return [ response, loading, hasError ];
}

/**
 * Simple hook to force a component to rerender.
 * @copyright Copyright (c) 2019 Hovhannes Babayan
 * @license MIT
 * @see {@link https://github.com/bhovhannes/use-force-update-hook}
 * @example
 * ```
 * const forceUpdate = useForceUpdate();
 * ...
 * forceUpdate();
 * ```
 */
export function useForceUpdate () {
  const setValue = useState(0)[1];
  return useRef(() => setValue(v => ~v)).current;
}

/**
 * In rare cases you may need to do something right after component forceUpdate finishes.
 * In that case useForceUpdateWithCallback can be useful.
 * @copyright Copyright (c) 2019 Hovhannes Babayan
 * @license MIT
 * @see {@link https://github.com/bhovhannes/use-force-update-hook}
 * @param {*} callback Callback
 * @example
 * ```
 * function handleUpdate () {
 *   console.log('Just updated.')
 * }
 *
 * const forceUpdate = useForceUpdateWithCallback(handleUpdate)
 *
 * return (
 *   <div>
 *     <button onClick={forceUpdate}>
 *       Click to rerender MyAwesomeComponent
 *     </button>
 *   </div>
 * );
 * ```
 */
export function useForceUpdateWithCallback (callback) {
  const [ value, setValue ] = useState(0);
  const isUpdating = useRef(0);
  useLayoutEffect(() => {
    if (isUpdating.current) {
      isUpdating.current = 0;
      return callback();
    }
  }, [ callback, value ]);
  return useRef(() => {
    isUpdating.current = 1;
    setValue(v => ~v);
  }).current;
}

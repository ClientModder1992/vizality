import { useLayoutEffect, useEffect, useState, useRef } from 'react';

import { getObjectURL } from '../util/File';
import { get } from '../http';

/**
 * Hook that uses util.file.getObjectURL to get an async collection of blob object URLs.
 */
export function useFetch (url, opts) {
  const [ response, setResponse ] = useState(null);
  const [ loading, setLoading ] = useState(true);
  const [ hasError, setHasError ] = useState(false);

  useEffect(() => {
    get(url, opts)
      .then(res => {
        setResponse(res.data);
        setLoading(false);
      })
      .catch(() => {
        setHasError(true);
        setLoading(false);
      });
  }, [ url ]);

  return [ response, loading, hasError ];
}

/**
 * Hook that uses util.file.getObjectURL to get an async collection of blob object URLs.
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
  }, [ path ]);

  return [ response, loading, hasError ];
}

/**
 * Simple hook to force a component to rerender.
 * @copyright MIT, Hovhannes Babayan 2019
 * @see {@link https://github.com/bhovhannes/use-force-update-hook}
 */
export function useForceUpdate () {
  const setValue = useState(0)[1];
  return useRef(() => setValue(v => ~v)).current;
}

/**
 * In rare cases you may need to do something right after component forceUpdate finishes.
 * In that case useForceUpdateWithCallback can be useful.
 * @copyright MIT, Hovhannes Babayan 2019
 * @see {@link https://github.com/bhovhannes/use-force-update-hook}
 * @param {*} callback Callback
 */
export function useForceUpdateWithCallback (callback) {
  const [value, setValue] = useState(0);
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

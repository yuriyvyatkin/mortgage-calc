// Заимствовано от сюда: https://courses.webdevsimplified.com/view/courses/react-hooks-simplified/1327246-custom-hooks
// (по ссылке видео-описание)
import { useCallback, useEffect, useRef } from 'react';

type Callback = () => void;

const useTimeout = (callback: Callback, delay: number) => {
  const callbackRef = useRef<Callback>(callback);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const set = useCallback(() => {
    timeoutRef.current = setTimeout(() => callbackRef.current(), delay);
  }, [delay]);

  const clear = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  useEffect(() => {
    set();
    return clear;
  }, [delay, set, clear]);

  const reset = useCallback(() => {
    clear();
    set();
  }, [clear, set]);

  return { reset, clear };
}

export default useTimeout;

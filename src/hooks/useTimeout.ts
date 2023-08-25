import { useCallback, useEffect, useRef } from 'react';

type Callback = () => void;

// Хук useTimeout предоставляет удобный способ управления JavaScript-таймаутом.
// Это может быть полезно для задач, таких как отсрочка выполнения функции.
const useTimeout = (callback: Callback, delay: number) => {
  // callbackRef используется для хранения ссылки на функцию обратного вызова, чтобы он не изменялся при каждом рендере
  const callbackRef = useRef<Callback>(callback);

  // timeoutRef используется для хранения ссылки на текущий таймер, чтобы его можно было отменить
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

// Хук useMediaQuery принимает строку запроса для медиа-выражения (например, '(max-width: 873px)') и возвращает true, если текущий размер окна соответствует запросу, или false в противном случае.
import { useState, useEffect } from 'react';

const useMediaQuery = (query: string): boolean => {
  const [isMatching, setIsMatching] = useState(false);

  useEffect(() => {
    // Создание объекта MediaQueryList, который представляет переданный запрос
    const mediaQuery = window.matchMedia(query);

    // Установка начального значения на основе того, соответствует ли запрос текущему размеру окна
    setIsMatching(mediaQuery.matches);

    // Обработчик изменения размера окна
    const handleMediaQueryChange = (event: MediaQueryListEvent) => {
      setIsMatching(event.matches);
    };

    mediaQuery.addEventListener('change', handleMediaQueryChange);

    return () => {
      mediaQuery.removeEventListener('change', handleMediaQueryChange);
    };
  }, []);

  return isMatching;
};

export default useMediaQuery;

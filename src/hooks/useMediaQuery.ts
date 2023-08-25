import { useState, useEffect } from 'react';

const useMediaQuery = (query: string): boolean => {
  const [isMatching, setIsMatching] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);

    setIsMatching(mediaQuery.matches);

    const handleMediaQueryChange = (event: MediaQueryListEvent) => {
      setIsMatching(event.matches);
    };

    mediaQuery.addEventListener('change', handleMediaQueryChange);

    return () => {
      mediaQuery.removeEventListener('change', handleMediaQueryChange);
    };
  }, [query]);

  return isMatching;
};

export default useMediaQuery;

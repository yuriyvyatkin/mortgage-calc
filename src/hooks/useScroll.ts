import { useEffect, useRef } from 'react';

const useScroll = (citiesDropdown: boolean) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = dropdownRef.current;

    const handleScroll = () => {
      const element = dropdownRef.current;
      if (element) {
        const scrollPercentage =
          element.scrollTop / (element.scrollHeight - element.clientHeight);
        let scrollbarPosition = scrollPercentage * (element.clientHeight - 64);

        scrollbarPosition = Math.max(scrollbarPosition, 8);

        if (scrollbarPosition >= element.clientHeight - 64) {
          const isChrome =
            /Chrome/.test(navigator.userAgent) &&
            !/OPR/.test(navigator.userAgent);

          scrollbarPosition = element.clientHeight - 32 - (isChrome ? 0 : 8);
        }

        element.style.setProperty(
          '--scrollbar-position',
          `${scrollbarPosition}px`,
        );
      }
    };

    const checkScrollability = () => {
      if (element) {
        if (element.scrollHeight <= element.clientHeight) {
          element.classList.add('dropdown_without-scrolling');
        } else {
          element.classList.remove('dropdown_without-scrolling');
        }
      }
    };

    if (element && citiesDropdown) {
      element.addEventListener('scroll', handleScroll);
      checkScrollability();
    }

    return () => {
      if (element) {
        element.removeEventListener('scroll', handleScroll);
      }
    };
  }, [citiesDropdown]);

  return dropdownRef;
};

export default useScroll;

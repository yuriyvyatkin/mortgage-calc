// Хук, имитирующий скроллинг, путём установки соответствующих стилей и перемещения псевдо-элемента внутри выпадающего списка
import { useEffect, useRef } from 'react';

const useScroll = (dropdownIsOpen: boolean, sliderHeight: number) => {
  // Ссылка на элемент выпадающего списка
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = dropdownRef.current;

    const handleScroll = () => {
      const element = dropdownRef.current;
      if (element) {
        // Вычисление процента прокрутки
        const scrollPercentage =
          element.scrollTop / (element.scrollHeight - element.clientHeight);
        // Вычисление позиции ползунка
        let scrollbarPosition = scrollPercentage * (element.clientHeight - sliderHeight);

        scrollbarPosition = Math.max(scrollbarPosition, 8);

        // Если ползунок больше не прокручивается, то опускаем его в положение примерно 6px от нижней границы выпадающего списка
        // Для браузера Chrome положение ползунка отличается примерно на 8px
        if (scrollbarPosition >= element.clientHeight - sliderHeight) {
          const isChrome =
            /Chrome/.test(navigator.userAgent) &&
            !/OPR/.test(navigator.userAgent);

          scrollbarPosition = element.clientHeight - sliderHeight / 2 - (isChrome ? 0 : 8);
        }

        element.style.setProperty(
          '--scrollbar-position',
          `${scrollbarPosition}px`,
        );
      }
    };

    // Функция для проверки возможности прокрутки
    const checkScrollability = () => {
      if (element) {
        if (element.scrollHeight <= element.clientHeight) {
          element.classList.add('dropdown_without-scrolling');
        } else {
          element.classList.remove('dropdown_without-scrolling');
        }
      }
    };

    if (element && dropdownIsOpen) {
      element.addEventListener('scroll', handleScroll);

      checkScrollability();
    }

    return () => {
      if (element) {
        element.removeEventListener('scroll', handleScroll);
      }
    };
  }, [dropdownIsOpen]);

  return dropdownRef;
};

export default useScroll;

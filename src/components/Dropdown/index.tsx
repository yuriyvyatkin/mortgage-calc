import SelectIcon from '@/assets/svg/caret-down.svg';
import CheckIcon from '@/assets/svg/check.svg';
import MagnifierIcon from '@/assets/svg/magnifier.svg';
import { Error } from '@/components/Error';
import useScroll from '@/hooks/useScroll';
import React, { useEffect, useRef, useState } from 'react';
import './dropdown.css';

interface DropdownProps {
  label: string;
  values: string[];
  selectedValue: string;
  withSearchInput?: boolean;
  errorText?: string;
  onSelect: (value: string) => void;
}

const Dropdown = ({
  label, // Подпись выпадающего списка
  values, // Массив возможных значений
  selectedValue,
  withSearchInput = false,
  errorText = '',
  onSelect: setValue,
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  // Хук для управления скроллингом, принимающий булево значение для его активации и высоту ползунка
  const dropdownRef = useScroll(isOpen, 64);
  // Состояние поискового запроса
  const [query, setQuery] = useState('');
  // Реф для закрытия выпадающего списка при клике за его границами
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();

    if (value) {
      setQuery(value);
    } else {
      setQuery('');
    }
  };

  // Обработчик клика вне компонента
  const handleClickOutside = (event: MouseEvent) => {
    if (
      containerRef.current &&
      event.target instanceof Node &&
      !containerRef.current.contains(event.target)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="frame__item" ref={containerRef}>
      <label className="label">{label}</label>

      {/* Контейнер, содержащий текущее значение выпадающего списка */}
      <div
        className={`select-container control-container ${
          errorText ? 'control-container_error' : ''
        }`}
        onClick={() => {
          setQuery('');
          setIsOpen(!isOpen);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            setQuery('');
            setIsOpen(!isOpen);
          }
        }}
        tabIndex={0}
      >
        <div
          className={`control ${
            values.includes(selectedValue) ? '' : 'control_default'
          }`}
        >
          {selectedValue}
        </div>
        <SelectIcon
          className={`icon select-icon ${isOpen ? 'select-icon_active' : ''}`}
        />
      </div>

      {/* Выпадающий список */}
      {isOpen && (
        <div className="dropdown" ref={dropdownRef}>
          {withSearchInput && (
            <div className="search-bar-wrapper" key="search">
              <MagnifierIcon className="search-bar-icon" />
              <input
                className="search-bar"
                type="text"
                value={query}
                onChange={handleSearchChange}
                placeholder="Поиск..."
              />
            </div>
          )}
          {values.map((value) => {
            if (
              withSearchInput &&
              !value.toLowerCase().startsWith(query.toLowerCase())
            ) {
              return null;
            }

            return (
              <div
                className="dropdown__item-wrapper"
                key={value}
                onClick={() => {
                  setValue(value);
                  setIsOpen(false);
                }}
              >
                <span
                  className="dropdown__item__text"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setValue(value);
                      setIsOpen(false);
                    }
                  }}
                  tabIndex={0}
                >
                  {value}
                </span>
                {value === selectedValue && <CheckIcon />}
              </div>
            );
          })}
        </div>
      )}

      {errorText && <Error text={errorText} />}
    </div>
  );
};

export default Dropdown;

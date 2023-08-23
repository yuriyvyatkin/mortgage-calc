import SelectIcon from '@/assets/svg/caret-down.svg';
import CheckIcon from '@/assets/svg/check.svg';
import MagnifierIcon from '@/assets/svg/magnifier.svg';
import { Error } from "@/components/Error";
import useScroll from '@/hooks/useScroll';
import React, { useState } from 'react';
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
  label,
  values,
  selectedValue,
  withSearchInput = false,
  errorText = '',
  onSelect: setValue,
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useScroll(isOpen);
  const [query, setQuery] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();

    if (value) {
      setQuery(value);
    } else {
      setQuery('');
    }
  };

  return (
    <div className="frame__item">
      <label>{label}</label>

      <div
        className={`select-container control-container ${
          errorText ? 'control-container_error' : ''
        }`}
        onClick={() => {
          setQuery('');
          setIsOpen(!isOpen);
        }}
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
                <span>{value}</span>
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

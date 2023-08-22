import React, { useState, useRef, useEffect } from 'react';
import CurrencyIcon from '@/assets/svg/currency.svg';
import SelectIcon from '@/assets/svg/caret-down.svg';
import CheckIcon from '@/assets/svg/check.svg';
import MagnifierIcon from '@/assets/svg/magnifier.svg';
import { Error } from '@/components/Error';
import './main.css';
const formatter = new Intl.NumberFormat('en-US');

const Main = () => {
  const cities = ['Тель-авив', 'Акко', 'Ариэль', 'Париж'];
  const periods = [
    'В ближайший месяц',
    'В ближайшие 2 месяца',
    'В ближайшие 3 месяца',
    'В ближайшие 6 месяцев',
  ];
  const [values, setValues] = useState({
    estateCost: 1000000,
    city: 'Выберите город',
    period: 'Выберите период',
  });
  const [errors, setErrors] = useState({
    estateCost: false,
    cities: false,
    periods: false,
  });
  const [dropdowns, setDropdowns] = useState({ cities: false, periods: false });
  const [query, setQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // обработка кастомной полосы прокрутки для списка городов
  useEffect(() => {
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
          console.log(isChrome);

          scrollbarPosition = element.clientHeight - 32 - (isChrome ? 0 : 8);
        }

        element.style.setProperty(
          '--scrollbar-position',
          `${scrollbarPosition}px`,
        );
      }
    };

    const element = dropdownRef.current;

    if (element && dropdowns.cities) {
      element.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (element) {
        element.removeEventListener('scroll', handleScroll);
      }
    };
  }, [dropdowns.cities]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, '');

    if (/\D/.test(value)) {
      return;
    }

    const estateCost = Number(value);

    if (!isNaN(estateCost) && estateCost >= 0 && estateCost <= 10000000) {
      setErrors({ ...errors, estateCost: false });
      setValues({ ...values, estateCost });
    } else {
      setErrors({ ...errors, estateCost: true });
      setValues({ ...values, estateCost });
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();

    if (value) {
      setQuery(value);
    } else {
      setQuery('');
    }
  };

  const handleItemChange = (
    valueKey: string,
    dropdownKey: string,
    value: string,
  ) => {
    setValues({ ...values, [valueKey]: value });
    setErrors({ ...errors, [dropdownKey]: false });
    setDropdowns({ ...dropdowns, [dropdownKey]: false });
  };

  return (
    <main className="main">
      <h1 className="title">Рассчитайте ипотеку быстро и просто</h1>

      <div className="frame">
        <div className="frame__item">
          <label className="label" htmlFor="estate-cost">
            Стоимость недвижимости
          </label>
          <div
            className={`control-container ${
              errors.estateCost ? 'control-container_error' : ''
            }`}
          >
            <input
              className="control"
              type="text"
              id="estate-cost"
              value={formatter.format(values.estateCost)}
              onChange={handleInputChange}
              required
            />
            <CurrencyIcon className="icon input-icon" />
          </div>
          {errors.estateCost && (
            <Error text="Стоимость недвижимости не может превышать 10,000,000" />
          )}
        </div>

        <div className="frame__item">
          <label htmlFor="city">Город покупки недвижимости</label>
          <div
            className={`select-container control-container ${
              errors.cities ? 'control-container_error' : ''
            }`}
            onClick={() => {
              setDropdowns({ ...dropdowns, cities: !dropdowns.cities });
              setQuery('');
            }}
          >
            <div
              className={`control ${
                cities.includes(values.city) ? '' : 'control_default'
              }`}
            >
              {values.city}
            </div>
            <SelectIcon
              className={`icon select-icon ${
                dropdowns.cities ? 'select-icon_active' : ''
              }`}
            />
          </div>
          {dropdowns.cities && (
            <div className="dropdown" ref={dropdownRef}>
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
              {cities.map((city) => {
                if (
                  !city
                    .toLocaleLowerCase()
                    .startsWith(query.toLocaleLowerCase())
                ) {
                  return;
                }

                return (
                  <div
                    className="dropdown__item-wrapper"
                    key={city}
                    onClick={() => handleItemChange('city', 'cities', city)}
                  >
                    <span>{city}</span>
                    {city === values.city && <CheckIcon />}
                  </div>
                );
              })}
            </div>
          )}
          {errors.cities && <Error text="Выберите город" />}
        </div>

        <div className="frame__item">
          <label htmlFor="city">Когда вы планируете оформить ипотеку?</label>
          <div
            className={`select-container control-container ${
              errors.periods ? 'control-container_error' : ''
            }`}
            onClick={() => {
              setDropdowns({ ...dropdowns, periods: !dropdowns.periods });
            }}
          >
            <div
              className={`control ${
                periods.includes(values.period) ? '' : 'control_default'
              }`}
            >
              {values.period}
            </div>
            <SelectIcon
              className={`icon select-icon ${
                dropdowns.periods ? 'select-icon_active' : ''
              }`}
            />
          </div>
          {dropdowns.periods && (
            <div className="dropdown">
              {periods.map((period) => (
                <div
                  className="dropdown__item-wrapper"
                  key={period}
                  onClick={() => handleItemChange('period', 'periods', period)}
                >
                  <span>{period}</span>
                  {period === values.period && <CheckIcon />}
                </div>
              ))}
            </div>
          )}
          {errors.periods && <Error text="Выберите город" />}
        </div>
      </div>
    </main>
  );
};

export default Main;

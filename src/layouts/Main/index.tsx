import CurrencyIcon from '@/assets/svg/currency.svg';
import Dropdown from '@/components/Dropdown';
import { Error } from '@/components/Error';
import React, { useState } from 'react';
import './main.css';
const formatter = new Intl.NumberFormat('en-US');

interface MainProps {
  cities: string[];
  periods: string[];
}

const Main = ({ cities, periods }: MainProps) => {
  const [values, setValues] = useState({
    estateCost: 1000000,
    city: 'Выберите город',
    period: 'Выберите период',
  });
  const [errors, setErrors] = useState({
    estateCost: '',
    cities: '',
    periods: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, '');

    if (/\D/.test(value)) {
      return;
    }

    const estateCost = Number(value);

    if (!isNaN(estateCost) && estateCost >= 0 && estateCost <= 10000000) {
      setErrors({ ...errors, estateCost: '' });
      setValues({ ...values, estateCost });
    } else {
      setErrors({
        ...errors,
        estateCost: 'Стоимость недвижимости не может превышать 10,000,000',
      });
      setValues({ ...values, estateCost });
    }
  };

  const handleItemChange = (valueKey: string, value: string) => {
    setValues({ ...values, [valueKey]: value });
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
          {errors.estateCost && <Error text={errors.estateCost} />}
        </div>

        <Dropdown
          label="Город покупки недвижимости"
          values={cities}
          selectedValue={values.city}
          withSearchInput={true}
          errorText={errors.cities}
          onSelect={handleItemChange}
          valueKey="city"
        />

        <Dropdown
          label="Когда вы планируете оформить ипотеку?"
          values={periods}
          selectedValue={values.period}
          errorText={errors.periods}
          onSelect={handleItemChange}
          valueKey="period"
        />
      </div>
    </main>
  );
};

export default Main;

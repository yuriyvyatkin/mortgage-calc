import Dropdown from '@/components/Dropdown';
import Input from '@/components/Input';
import useDebounce from '@/hooks/useDebounce';
import calculateMonthlyPayments from '@/utils/calculateMonthlyPayments';
import calculateTimeframe from '@/utils/calculateTimeframe';
import React, { useEffect, useState } from 'react';
import './main.css';

interface MainProps {
  cities: string[];
  periods: string[];
  propertyTypes: string[];
  ownership: string[];
}

const Main = ({ cities, periods, propertyTypes, ownership }: MainProps) => {
  const initialEstateCost = 1000000;
  const initialPay = initialEstateCost * 0.5;
  const [values, setValues] = useState({
    estateCost: initialEstateCost,
    city: 'Выберите город',
    period: 'Выберите период',
    initialPay: initialPay,
    propertyType: 'Выберите тип недвижимости',
    ownership: 'Выберите ответ',
    timeframe: {
      current: 30,
      min: 4,
      max: 30,
    },
    monthlyPayment: {
      current: 0,
      min: 0,
      max: 0,
    },
  });
  const [errors, setErrors] = useState({
    estateCost: '',
    cities: '',
    periods: '',
    initialPay: '',
    propertyTypes: '',
    ownership: '',
    timeframe: '',
    monthlyPayment: '',
  });
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 791px)');

    setIsMobileDevice(mediaQuery.matches);

    const handleMediaQueryChange = (event: MediaQueryListEvent) => {
      setIsMobileDevice(event.matches);
    };

    mediaQuery.addEventListener('change', handleMediaQueryChange);

    return () => {
      mediaQuery.removeEventListener('change', handleMediaQueryChange);
    };
  }, []);

  useDebounce(
    () => {
      const { estateCost, initialPay, monthlyPayment } = values;

      setValues({
        ...values,
        timeframe: {
          ...values.timeframe,
          current: calculateTimeframe(
            estateCost,
            initialPay,
            monthlyPayment.current,
          ),
        },
      });
    },
    500,
    [values.monthlyPayment.current],
  );

  useEffect(() => {
    const { estateCost, initialPay, timeframe } = values;

    setValues({
      ...values,
      monthlyPayment: calculateMonthlyPayments(
        estateCost,
        initialPay,
        timeframe,
      ),
    });
  }, [values.estateCost, values.timeframe, values.initialPay]);

  const handleValueChange = (field: string, value: number) => {
    if (field === 'timeframe') {
      setValues({
        ...values,
        timeframe: { ...values.timeframe, current: value },
      });
    } else if (field === 'monthlyPayment') {
      setValues({
        ...values,
        monthlyPayment: { ...values.monthlyPayment, current: value },
      });
    } else {
      setValues({ ...values, [field]: value });
    }
  };

  const handleError = (field: string, error: string) => {
    setErrors({ ...errors, [field]: error });
  };

  const handleItemChange = (valueKey: string, value: string) => {
    setValues({ ...values, [valueKey]: value });

    const errorKeys: { [key: string]: keyof typeof errors } = {
      city: 'cities',
      period: 'periods',
      propertyType: 'propertyTypes',
      ownership: 'ownership',
    };

    const errorKey = errorKeys[valueKey];
    if (errorKey) {
      setErrors({ ...errors, [errorKey]: '' });
    }
  };

  const handleContinue = () => {
    let isValid = true;

    const errorKeys: { [key: string]: keyof typeof errors } = {
      estateCost: 'estateCost',
      city: 'cities',
      period: 'periods',
      initialPay: 'initialPay',
      propertyType: 'propertyTypes',
      ownership: 'ownership',
      timeframe: 'timeframe',
      monthlyPayment: 'monthlyPayment',
    };

    const newErrors = { ...errors };

    type ValueType = typeof values;

    Object.keys(values).forEach((key: string) => {
      if (isMobileDevice && key === 'city') {
        return;
      }

      const valueKey = key as keyof ValueType;
      const value = values[valueKey];
      const errorKey = errorKeys[valueKey];

      if (typeof value === 'string' && value.includes('Выберите')) {
        newErrors[errorKey] = 'Выберите ответ';
        isValid = false;
      }

      if (typeof value === 'number' && value === 0) {
        newErrors[errorKey] = 'Выберите ответ';
        isValid = false;
      }
    });

    setErrors(newErrors);

    if (isValid) {
      if (isMobileDevice) {
        const { city, ...valuesWithoutCity } = values;
        localStorage.setItem('values', JSON.stringify(valuesWithoutCity));
      } else {
        localStorage.setItem('values', JSON.stringify(values));
      }
    }
  };

  const isDisabled = Object.values(errors).some(Boolean);

  return (
    <main className="main">
      <h1 className="title">Рассчитайте ипотеку быстро и просто</h1>

      <div className="frame">
        <Input
          label="Стоимость недвижимости"
          value={values.estateCost}
          min={0}
          max={10000000}
          onChange={(value: number) => handleValueChange('estateCost', value)}
          onError={(error: string) => handleError('estateCost', error)}
          rangeErrorText="Стоимость недвижимости не может превышать 10,000,000"
          errorText={errors.estateCost}
        />

        {!isMobileDevice && (
          <Dropdown
            label="Город покупки недвижимости"
            values={cities}
            selectedValue={values.city}
            withSearchInput={true}
            errorText={errors.cities}
            onSelect={(value) => handleItemChange('city', value)}
          />
        )}

        {!isMobileDevice && (
          <Dropdown
            label="Когда вы планируете оформить ипотеку?"
            values={periods}
            selectedValue={values.period}
            errorText={errors.periods}
            onSelect={(value) => handleItemChange('period', value)}
          />
        )}
      </div>

      <div className="frame">
        <Input
          label="Первоначальный взнос"
          value={values.initialPay}
          withSlider={true}
          min={values.estateCost * 0.25}
          max={values.estateCost}
          onChange={(value: number) => handleValueChange('initialPay', value)}
          onError={(error: string) => handleError('initialPay', error)}
          rangeErrorText="Сумма первоначального взноса не может быть меньше 25% и больше 100% от стоимости недвижимости"
          errorText={errors.initialPay}
          infoText="Сумма финансирования: 100,000 ₪\nПроцент финансирования: 25%"
          tooltipText="Основная квартира: у заемщика нет квартиры ставка финансирования\nМаксимум до 75%\n\nАльтернативная квартира: Для заемщика квартира, которую он обязуется продать в течение двух лет ставка финансирования\nМаксимум до 70%\n\nВторая квартира или выше: у заемщика уже есть ставка финансирования квартиры\nМаксимум до 50%"
        />

        <Dropdown
          label="Тип недвижимости"
          values={propertyTypes}
          selectedValue={values.propertyType}
          errorText={errors.propertyTypes}
          onSelect={(value) => handleItemChange('propertyType', value)}
        />

        {isMobileDevice && (
          <Dropdown
            label="Когда вы планируете оформить ипотеку?"
            values={periods}
            selectedValue={values.period}
            errorText={errors.periods}
            onSelect={(value) => handleItemChange('period', value)}
          />
        )}

        <Dropdown
          label="Вы уже владеете недвижимостью?"
          values={ownership}
          selectedValue={values.ownership}
          errorText={errors.ownership}
          onSelect={(value) => handleItemChange('ownership', value)}
        />
      </div>

      <hr className="custom-line" />

      <div className="frame">
        <Input
          label={isMobileDevice ? 'Срок ипотеки' : 'Срок'}
          value={values.timeframe.current}
          withSlider={true}
          min={values.timeframe.min}
          minDescription={`${values.timeframe.min} ₪`}
          maxDescription={`${values.timeframe.max} ₪`}
          max={values.timeframe.max}
          onChange={(value: number) => handleValueChange('timeframe', value)}
          onError={(error: string) => handleError('timeframe', error)}
          rangeErrorText={`Срок ипотеки не может быть меньше ${values.timeframe.min} лет и превышать ${values.timeframe.max} лет`}
          errorText={errors.timeframe}
        />

        <Input
          label="Ежемесячный платёж"
          value={values.monthlyPayment.current}
          withSlider={true}
          min={values.monthlyPayment.min}
          minDescription={`${values.monthlyPayment.min} ₪`}
          maxDescription={`${values.monthlyPayment.max} ₪`}
          max={values.monthlyPayment.max}
          onChange={(value: number) =>
            handleValueChange('monthlyPayment', value)
          }
          onError={(error: string) => handleError('monthlyPayment', error)}
          rangeErrorText={`Размер ежемесячного платежа не может быть меньше ${values.monthlyPayment.min} иначе срок будет больше ${values.timeframe.max} лет`}
          errorText={errors.monthlyPayment}
        />
      </div>

      <hr className="wide-custom-line" />

      <button
        onClick={handleContinue}
        disabled={isDisabled}
        className="continue-button"
      >
        Продолжить
      </button>
    </main>
  );
};

export default Main;

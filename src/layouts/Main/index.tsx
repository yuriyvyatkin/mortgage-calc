import Dropdown from '@/components/Dropdown';
import Input from '@/components/Input';
import useDebounce from '@/hooks/useDebounce';
import useMediaQuery from '@/hooks/useMediaQuery';
import calculateMonthlyPayments from '@/utils/calculateMonthlyPayments';
import calculateCurrentMonthlyPayment from '@/utils/calculateCurrentMonthlyPayment';
import calculateCurrentTimeFrame from '@/utils/calculateCurrentTimeFrame';
import CurrencyIcon from '@/assets/svg/currency.svg';
import React, { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import './main.css';

interface MainProps {
  footerRef: React.RefObject<HTMLDivElement>,
  location: string[];
  delay: string[];
  property: string[];
  ownership: string[];
}

const Main = ({ footerRef, location, delay, property, ownership }: MainProps) => {
  const [values, setValues] = useState({
    estateCost: 1000000,
    location: 'Выберите город',
    delay: 'Выберите период',
    initialPay: 0,
    property: 'Выберите тип недвижимости',
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
    location: '',
    delay: '',
    initialPay: '',
    property: '',
    ownership: '',
    timeframe: '',
    monthlyPayment: '',
  });
  const [isInitialPayChanged, setIsInitialPayChanged] = useState(false);
  const initialPayRef = useRef<number>(values.estateCost * 0.5);
  const contBtnRef = useRef<HTMLButtonElement | null>(null);
  const contBtnIsDurtyRef = useRef(false);
  const isMobileDevice = useMediaQuery('(max-width: 873px)');

  useEffect(() => {
    if (errors.estateCost || errors.initialPay || errors.timeframe) {
      return;
    }

    const { estateCost, initialPay, timeframe } = values;

    let newInitialPay = initialPay;
    if (isInitialPayChanged) {
      setIsInitialPayChanged(false);
    } else if (initialPayRef.current !== initialPay) {
      newInitialPay = estateCost * 0.5;
    }

    const { current, min, max } = calculateMonthlyPayments(
      estateCost,
      initialPay,
      timeframe,
    );

    setValues({
      ...values,
      monthlyPayment: { current, min, max },
      initialPay: newInitialPay,
    });
  }, [values.estateCost, values.initialPay, values.timeframe]);

  useDebounce(
    () => {
      if (errors.monthlyPayment || errors.estateCost || errors.initialPay) {
        return;
      }

      const { monthlyPayment, estateCost, initialPay } = values;

      const newCurrentTimeFrame = calculateCurrentTimeFrame(
        estateCost,
        initialPay,
        monthlyPayment.current,
      );

      setValues({
        ...values,
        timeframe: { ...values.timeframe, current: newCurrentTimeFrame },
      });
    },
    500,
    [values.monthlyPayment.current],
  );

  const handleValueChange = (field: string, value: number) => {
    if (field === 'estateCost') {
      const newInitialPay = value * 0.5;

      setValues({
        ...values,
        estateCost: value,
        initialPay: newInitialPay,
        monthlyPayment: {
          ...values.monthlyPayment,
          current: calculateCurrentMonthlyPayment(
            value,
            newInitialPay,
            values.timeframe.current,
          ),
        },
      });
    } else if (field === 'timeframe') {
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
      if (field === 'initialPay') {
        setIsInitialPayChanged(true);
        initialPayRef.current = value;
      }

      setValues({ ...values, [field]: value });
    }
  };

  const handleItemChange = (valueKey: string, value: string) => {
    setValues({ ...values, [valueKey]: value });

    if (errors.hasOwnProperty(valueKey)) {
      setErrors({ ...errors, [valueKey]: '' });
    }
  };

  const handleError = (field: string, error: string) => {
    setErrors({ ...errors, [field]: error });
  };

  const handleContinue = () => {
    if (
      contBtnIsDurtyRef.current &&
      contBtnRef.current &&
      contBtnRef.current.classList.contains('continue-button_disabled')
    ) {
      return;
    }

    const newErrors = { ...errors };
    let isValid = true;

    contBtnIsDurtyRef.current = true;

    Object.keys(values).forEach((key) => {
      const valueKey = key as keyof typeof values;

      if (isMobileDevice && valueKey === 'location') {
        return;
      }

      const value = values[valueKey];

      if (
        (typeof value === 'string' && value.includes('Выберите')) ||
        (typeof value === 'number' && value === 0)
      ) {
        newErrors[valueKey] = 'Выберите ответ';
        isValid = false;
      }
    });

    setErrors(newErrors);

    if (isValid) {
      if (isMobileDevice) {
        const { location, ...otherValues } = values;
        localStorage.setItem('values', JSON.stringify(otherValues));
      } else {
        localStorage.setItem('values', JSON.stringify(values));
      }
    }
  };

  const toggleButtonDisabledClass = () => {
    if (contBtnRef.current) {
      let hasErrors: boolean =
        Object.values(errors).some(Boolean) ||
        Object.values(values).some(
          (item) => typeof item === 'string' && item.includes('Выберите'),
        );

      if (hasErrors) {
        contBtnRef.current.classList.add('continue-button_disabled');
      } else {
        contBtnRef.current.classList.remove('continue-button_disabled');
      }
    }
  };

  useEffect(() => {
    toggleButtonDisabledClass();
  }, [errors, values]);

  const DelayComponent = (
    <Dropdown
      label="Когда вы планируете оформить ипотеку?"
      values={delay}
      selectedValue={values.delay}
      errorText={errors.delay}
      onSelect={(value) => handleItemChange('delay', value)}
    />
  );

  const continueButton = (
    <button
        ref={contBtnRef}
        onClick={handleContinue}
        className="continue-button"
      >
        Продолжить
      </button>
  );

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
          icon={CurrencyIcon}
        />

        {!isMobileDevice && (
          <Dropdown
            label="Город покупки недвижимости"
            values={location}
            selectedValue={values.location}
            withSearchInput={true}
            errorText={errors.location}
            onSelect={(value) => handleItemChange('location', value)}
          />
        )}

        {!isMobileDevice && DelayComponent}
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
          tooltipText={
            !isMobileDevice
              ? 'Основная квартира: у заемщика нет квартиры ставка финансирования\nМаксимум до 75%\n\nАльтернативная квартира: Для заемщика квартира, которую он обязуется продать в течение двух лет ставка финансирования\nМаксимум до 70%\n\nВторая квартира или выше: у заемщика уже есть ставка финансирования квартиры\nМаксимум до 50%'
              : ''
          }
          icon={CurrencyIcon}
        />

        <Dropdown
          label="Тип недвижимости"
          values={property}
          selectedValue={values.property}
          errorText={errors.property}
          onSelect={(value) => handleItemChange('property', value)}
        />

        {isMobileDevice && DelayComponent}

        <Dropdown
          label="Вы уже владеете недвижимостью?"
          values={ownership}
          selectedValue={values.ownership}
          errorText={errors.ownership}
          onSelect={(value) => handleItemChange('ownership', value)}
        />
      </div>

      <hr className="line" />

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
          icon={CurrencyIcon}
        />
      </div>

      {footerRef.current && ReactDOM.createPortal(continueButton, footerRef.current)}
    </main>
  );
};

export default Main;

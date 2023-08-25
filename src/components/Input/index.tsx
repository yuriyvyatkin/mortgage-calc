import React from 'react';
import TooltipIcon from '@/assets/svg/info.svg';
import { Error } from '@/components/Error';
import { Info } from '@/components/Info';
import './input.css';
const formatter = new Intl.NumberFormat('en-EN');
import ContentWithBreaks from '@/utils/ContentWithBreaks';

interface InputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  onError: (error: string) => void;
  errorText?: string;
  infoText?: string;
  tooltipText?: string;
  rangeErrorText?: string;
  withSlider?: boolean;
  min: number;
  minDescription?: string;
  max: number;
  maxDescription?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

const Input = ({
  label,
  value,
  onChange: setValue,
  onError: setError,
  errorText,
  infoText,
  tooltipText,
  rangeErrorText,
  withSlider = false,
  min,
  minDescription,
  max,
  maxDescription,
  icon: Icon,
}: InputProps) => {
  const validateAndSetInputValue = (numberValue: number) => {
    if (numberValue >= min && numberValue <= max) {
      setError('');
      setValue(numberValue);
    } else {
      setError(
        rangeErrorText ||
          `Значение не может превышать ${max} и быть меньше ${min}`,
      );
      setValue(numberValue);
    }
  };

  const handleInputChangeField = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, '');
    const numberValue = Number(rawValue);
    validateAndSetInputValue(numberValue);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    validateAndSetInputValue(value);
  };

  return (
    <div className="frame__item">
      <label className="label" htmlFor="initial-pay">
        {label}
        {tooltipText && (
          <div className="tooltip-container">
            <TooltipIcon className="tooltip-icon" />
            <span className="tooltip-text">
              <ContentWithBreaks content={tooltipText} separator="\n" />
            </span>
          </div>
        )}
      </label>
      <div
        className={`control-container ${
          errorText ? 'control-container_error' : ''
        }`}
      >
        <input
          className="control"
          type="text"
          id="initial-pay"
          value={formatter.format(value)}
          onChange={handleInputChangeField}
          required
        />
        {Icon && <Icon className="icon input-icon" />}
      </div>
      {withSlider && (
        <input
          className="input-slider"
          type="range"
          min={label === 'Первоначальный взнос' ? 0 : min}
          max={max}
          value={value}
          onChange={handleSliderChange}
        />
      )}
      {(minDescription || maxDescription) && (
        <div className="min-max-description">
          <span>{minDescription}</span>
          <span>{maxDescription}</span>
        </div>
      )}
      {infoText && <Info text={infoText} />}
      {errorText && <Error text={errorText} />}
    </div>
  );
};

export default Input;

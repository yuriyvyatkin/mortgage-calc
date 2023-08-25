// Функция для расчета ежемесячных платежей на основе разных временных рамок
const calculateMonthlyPayments = (
  estateCost: number, // Общая стоимость недвижимости
  initialPay: number, // Первоначальный взнос
  timeframe: { current: number; min: number; max: number }, // Текущий, минимальный и максимальный сроки кредита в годах
) => {
  const monthsPerYear = 12;

  // Основная сумма кредита
  const credit = estateCost - initialPay;
  // Расчет текущего ежемесячного платежа
  const currentNumberOfMonths = timeframe.current * monthsPerYear;
  const currentMonthlyPayment = currentNumberOfMonths
    ? credit / currentNumberOfMonths
    : credit;
  // Расчет минимального ежемесячного платежа
  const minNumberOfPayments = timeframe.max * monthsPerYear;
  const minMonthlyPayment = credit / minNumberOfPayments;
  // Расчет максимального ежемесячного платежа
  const maxNumberOfPayments = timeframe.min * monthsPerYear;
  const maxMonthlyPayment = credit / maxNumberOfPayments;

  return {
    current: Math.ceil(currentMonthlyPayment),
    min: Math.ceil(minMonthlyPayment),
    max: Math.ceil(maxMonthlyPayment),
  };
};

export default calculateMonthlyPayments;

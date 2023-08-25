// Функция для расчета срока кредита в годах
const calculateCurrentTimeFrame = (
  estateCost: number, // Общая стоимость недвижимости
  initialPay: number, // Первоначальный взнос
  monthlyPayment: number, // Ежемесячный платеж
) => {
  // Основная сумма кредита
  const credit = estateCost - initialPay;

  // Проверка на недопустимые значения
  if (monthlyPayment <= 0 || credit <= 0) {
    return 0;
  }

  const numberOfPayments = credit / monthlyPayment;

  return Math.ceil(numberOfPayments / 12);
};

export default calculateCurrentTimeFrame;

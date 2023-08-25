// Функция для расчета ежемесячного платежа по кредиту
const calculateCurrentMonthlyPayment = (
  estateCost: number, // Общая стоимость недвижимости
  initialPay: number, // Первоначальный взнос
  numberOfYears: number, // Количество лет, на которые взят кредит
) => {
  // Основная сумма кредита
  const credit = estateCost - initialPay;

  const numberOfMonths = numberOfYears * 12;

  // Расчет ежемесячного платежа, путём деления суммы кредита на количество месяцев
  // и тернарный оператор для защиты от деления на 0
  const monthlyPayment = numberOfMonths
    ? credit / numberOfMonths
    : credit;

  return Math.ceil(monthlyPayment);
};

export default calculateCurrentMonthlyPayment;

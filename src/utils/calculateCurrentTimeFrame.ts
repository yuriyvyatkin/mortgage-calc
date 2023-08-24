const calculateCurrentTimeFrame = (
  estateCost: number,
  initialPay: number,
  monthlyPayment: number,
) => {
  const principal = estateCost - initialPay; // Основная сумма кредита

  if (monthlyPayment <= 0 || principal <= 0) {
    return 0;
  }

  const numberOfPayments = principal / monthlyPayment;

  return Math.ceil(numberOfPayments / 12);
};

export default calculateCurrentTimeFrame;

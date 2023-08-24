const calculateMonthlyPayments = (
  estateCost: number,
  initialPay: number,
  timeframe: { min: number; max: number },
) => {
  const monthsPerYear = 12;
  const loanAmount = estateCost - initialPay;
  const minNumberOfPayments = timeframe.max * monthsPerYear;
  const minMonthlyPayment = loanAmount / minNumberOfPayments;
  const maxNumberOfPayments = timeframe.min * monthsPerYear;
  const maxMonthlyPayment = loanAmount / maxNumberOfPayments;

  return {
    min: Math.ceil(minMonthlyPayment),
    max: Math.ceil(maxMonthlyPayment),
  };
};

export default calculateMonthlyPayments;

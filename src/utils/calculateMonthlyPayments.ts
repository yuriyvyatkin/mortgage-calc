const calculateMonthlyPayments = (
  estateCost: number,
  initialPay: number,
  timeframe: { current: number; min: number; max: number },
) => {
  const monthsPerYear = 12;
  const loanAmount = estateCost - initialPay;
  const currentNumberOfMonths = timeframe.current * monthsPerYear;
  const currentMonthlyPayment = currentNumberOfMonths
    ? loanAmount / currentNumberOfMonths
    : loanAmount;
  const minNumberOfPayments = timeframe.max * monthsPerYear;
  const minMonthlyPayment = loanAmount / minNumberOfPayments;
  const maxNumberOfPayments = timeframe.min * monthsPerYear;
  const maxMonthlyPayment = loanAmount / maxNumberOfPayments;

  return {
    current: Math.ceil(currentMonthlyPayment),
    min: Math.ceil(minMonthlyPayment),
    max: Math.ceil(maxMonthlyPayment),
  };
};

export default calculateMonthlyPayments;

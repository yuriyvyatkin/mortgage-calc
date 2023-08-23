const calculateMonthlyPayments = (
  estateCost: number,
  initialPay: number,
  timeframe: { current: number; min: number; max: number },
) => {
  const monthsPerYear = 12;
  const loanAmount = estateCost - initialPay;
  const currentNumberOfPayments = timeframe.current * monthsPerYear;
  const currentMonthlyPayment = loanAmount / currentNumberOfPayments;
  const minNumberOfPayments = timeframe.max * monthsPerYear;
  const minMonthlyPayment = loanAmount / minNumberOfPayments;
  const maxNumberOfPayments = timeframe.min * monthsPerYear;
  const maxMonthlyPayment = loanAmount / maxNumberOfPayments;

  return {
    current: Number(currentMonthlyPayment.toFixed(0)),
    min: Number(minMonthlyPayment.toFixed(0)),
    max: Number(maxMonthlyPayment.toFixed(0)),
  };
};

export default calculateMonthlyPayments;

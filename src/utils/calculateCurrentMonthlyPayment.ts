const calculateCurrentMonthlyPayment = (
  estateCost: number,
  initialPay: number,
  numberOfYears: number,
) => {
  const loanAmount = estateCost - initialPay;
  const numberOfMonths = numberOfYears * 12;
  const monthlyPayment = numberOfMonths
    ? loanAmount / numberOfMonths
    : loanAmount;

  return Math.ceil(monthlyPayment);
};

export default calculateCurrentMonthlyPayment;

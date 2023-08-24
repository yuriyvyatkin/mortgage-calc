const calculateCurrentMonthlyPayment = (
  estateCost: number,
  initialPay: number,
  numberOfYears: number,
) => {
  const loanAmount = estateCost - initialPay;
  const numberOfMonths = numberOfYears * 12;
  const monthlyPayment = loanAmount / numberOfMonths;

  return Math.ceil(monthlyPayment);
};

export default calculateCurrentMonthlyPayment;

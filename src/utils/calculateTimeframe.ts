const calculateTimeframe = (
  estateCost: number,
  initialPay: number,
  monthlyPayment: number,
) => {
  const loanAmount = estateCost - initialPay;
  const numberOfMonths = loanAmount / monthlyPayment;
  const numberOfYears = Math.ceil(numberOfMonths / 12);
  return numberOfYears;
};

export default calculateTimeframe;

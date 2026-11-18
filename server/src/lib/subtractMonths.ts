const subtractMonths = (date: Date, months: number): Date => {
  const result = new Date(date);
  const day = result.getDate();

  // Set day to 1 first to prevent month overflow.
  result.setDate(1);
  result.setMonth(result.getMonth() - months);

  // Get the last valid day of the target month.
  const lastDay = new Date(
    result.getFullYear(),
    result.getMonth() + 1,
    0
  ).getDate();

  // Preserve the original day when possible.
  result.setDate(Math.min(day, lastDay));

  return result;
};

export default subtractMonths;

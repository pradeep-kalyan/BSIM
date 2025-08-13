export default function formatCurrency(value: number): string {
  const sign = value < 0 ? "-" : "";
  const absValue = Math.abs(value);

  if (absValue >= 1_00_00_00_000) {
    return `${sign}₹${(absValue / 1_00_00_000).toFixed(2)} Cr`;
  }
  if (absValue >= 1_00_00_000) {
    return `${sign}₹${(absValue / 1_00_000).toFixed(2)} L`;
  }
  if (absValue >= 1_00_000) {
    return `${sign}₹${(absValue / 1_00_000).toFixed(2)} L`;
  }
  if (absValue >= 1_000) {
    return `${sign}₹${(absValue / 1_000).toFixed(2)} K`;
  }
  return `${sign}₹${absValue.toLocaleString("en-IN")}`;
}

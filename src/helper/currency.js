export const formatCurrency = (amount) => {
  let num = 0;

  if (typeof amount === "string") {
    // Remove currency symbol and spaces, keep digits, dot, comma and minus
    const cleaned = amount.replaceAll(/[^\d.,-]/g, "").trim();
    if (cleaned === "") {
      num = 0;
    } else {
      const hasComma = cleaned.includes(",");
      const hasDot = cleaned.includes(".");

      let normalized = cleaned;
      if (hasComma && hasDot) {
        // Indonesian format: dot = thousands, comma = decimal
        normalized = cleaned.replaceAll(/\./g, "").replace(",", ".");
      } else if (hasComma) {
        // only comma present -> treat comma as decimal separator
        normalized = cleaned.replace(",", ".");
      } else if (hasDot) {
        // only dot present -> assume dot is thousands separator (local format)
        normalized = cleaned.replaceAll(/\./g, "");
      }

      num = Number.parseFloat(normalized) || 0;
    }
  } else {
    num = Number(amount) || 0;
  }

  // Truncate any fractional part (do not round)
  const truncated = Math.trunc(num);

  const formatter = new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 0,
  });

  // Use explicit "Rp." prefix (with dot) and keep localized number formatting.
  if (truncated < 0) {
    return `-Rp. ${formatter.format(Math.abs(truncated))}`;
  }

  return `Rp. ${formatter.format(truncated)}`;
};

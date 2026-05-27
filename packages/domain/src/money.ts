export const formatPrice = (
  cents: number,
  currency: string = "USD",
  locale: string = "en-US",
): string =>
  new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);

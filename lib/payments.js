export const ORDER_PAYMENT_STATUS = {
  PENDING: "ממתין לתשלום",
  PAID: "שולם",
  FAILED: "נכשל",
  CANCELED: "בוטל",
};

export const ORDER_STATUS = {
  NEW: "חדש",
  IN_PROGRESS: "בטיפול",
  IN_PRODUCTION: "בייצור",
  SHIPPED: "נשלח",
  DONE: "הושלם",
};

export function calculateShippingIls(productPriceIls) {
  return Number(productPriceIls) < 500 ? 30 : 0;
}

export function toAgorot(ilsAmount) {
  return Math.round(Number(ilsAmount) * 100);
}

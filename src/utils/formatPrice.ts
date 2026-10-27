export const formatPrice = (price: number) =>
  new Intl.NumberFormat("vi-VN").format(price);

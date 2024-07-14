// formatPrice.js
export const formatPrice = (price) => {
  return price.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
};

export function formatDate(dateString) {
  const options = {  month: 'long', day: 'numeric', weekday: 'long' };
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('vi-VN', options).format(date);
}

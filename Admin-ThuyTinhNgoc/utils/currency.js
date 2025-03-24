export const formatCurrency = (value) => {
  if (typeof value === 'string') {
    value = parseFloat(value);
  }
  let formattedValue = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  formattedValue = formattedValue.replace('.', ',');
  return formattedValue;
};
import axios from "axios";

// Action to retrieve conversion from nextJS API
export default async function convertCurrencies(unused: null, formData: FormData) {
  const currencyFrom = formData.get('currency-from');
  const currencyTo = formData.get('currency-to');
  const currencyAmount = formData.get('currency-amount');

  try {
    const currencyConversion = await axios.get(`/api/convert`, {
      params: {
        currencyFrom,
        currencyTo,
        currencyAmount,
      }
    });

    return currencyConversion;
  } catch (e) {
    return e;
  }
};

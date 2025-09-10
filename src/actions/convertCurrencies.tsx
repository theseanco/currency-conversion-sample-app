import axios from "axios";

// Action to retrieve conversion from nextJS API
export default async function convertCurrencies(one, formData) {
  const currencyFrom = formData.get('currency-from');
  const currencyTo = formData.get('currency-to');
  const currencyAmount = formData.get('currency-amount');

  try {
    const currencyConversion = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/convert`, {
      params: {
        currencyFrom,
        currencyTo,
        currencyAmount,
      }
    });

    return currencyConversion;
  } catch (e) {
    return e
  }
};
  

import { ConversionResponse, CurrencyInfo } from "@/types/currencybeacon-api.types"

// Process the currency to display it at desired resolution
const processCurrency = (amount: number, currencyInfo: CurrencyInfo) => {
  const processString = (inputNumber: string, separator: string) => {
    return inputNumber.replace(/\B(?=(\d{3})+(?!\d))/g, separator)
  }

  // If there is a decimal the string will need to be reassembled differently
  if (Math.round(amount) !== amount) {
    const decimalAmount = amount.toFixed(currencyInfo.precision);
    const [main, decimal] = decimalAmount.toString().split('.');
    console.log({main, decimal});
    const processedMain = processString(main, currencyInfo.thousands_separator);
    // If precision is 0 e.g. in BYN we can skip, a precision of 0 is falsy
    if (decimal) {
      return `${processedMain}${currencyInfo.decimal_mark}${decimal}`
    }
    return `${processedMain}`
  }

  return processString(amount.toString(), currencyInfo.thousands_separator);
}

export default function DisplayConversion(
  { 
    conversionState,
    currencyList,
    conversionPending,
  }: {
    conversionState: {
      data: ConversionResponse;
      status: number;
    };
    currencyList: CurrencyInfo[];
    conversionPending: boolean;
  }
) {
  console.log({currencyList});
  if (!conversionState) return null
  if (conversionPending) return <section className="flex justify-center items-center w-full"><p>Converting currencies...</p></section>

  if (conversionState.status === 500) {
    return <section className="flex justify-center items-center w-full">
      <p className="text-red-500">Error loading currency conversion. Please try again!</p>
    </section>
  }

  const { data: { amount, from, timestamp, to, value }, status } = conversionState;

  if (status === 200) {
    const fromCurrency = currencyList.find(item => item.short_code === from)
    const toCurrency = currencyList.find(item => item.short_code === to)

    return (
      <section className="flex justify-center items-center w-full flex-col">
        <p>{`${processCurrency(amount, fromCurrency)} ${fromCurrency?.name} is equal to ${processCurrency(value, toCurrency)} ${toCurrency.name}`}</p>
        <p>{`Conversion correct as of ${new Date(timestamp * 1000).toLocaleTimeString()} on ${new Date(timestamp * 1000).toDateString()}`}</p>
      </section>
    )
  }
  

}

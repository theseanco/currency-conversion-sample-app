import { ConversionResponse } from "@/types/currencybeacon-api.types"

export default function DisplayConversion(
  { 
    conversionState,
    conversionPending,
  }: {
    conversionState: {
      data: ConversionResponse;
      status: number;
    }
    conversionPending: boolean;
  }
) {
  if (!conversionState) return null
  if (conversionPending) return <section className="flex justify-center items-center w-full"><p>Converting currencies...</p></section>

  if (conversionState.status === 500) {
    return <section className="flex justify-center items-center w-full">
      <p className="text-red-500">Error loading currency conversion. Please try again!</p>
    </section>
  }

  const { data: { amount, date, from, timestamp, to, value }, status } = conversionState;

  if (status === 200) {
    return (
      <section className="flex justify-center items-center w-full flex-col">
        <p>{`${amount} ${from} is equal to ${value} ${to}`}</p>
        <p>{`Conversion correct as of ${new Date(timestamp * 1000).toLocaleTimeString()} on ${new Date(timestamp * 1000).toDateString()}`}</p>
      </section>
    )
  }
  

}

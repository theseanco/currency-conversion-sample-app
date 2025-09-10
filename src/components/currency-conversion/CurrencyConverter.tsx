"use client";
import { useActionState } from "react";
import useSWR from "swr";
import fetcher from "@/utils/fetcher";
import Form from "next/form";
import convertCurrencies from "@/actions/convertCurrencies";

import DisplayConversion from "../display-conversion/DisplayConversion";
import {ConversionResponse, CurrencyInfo} from "@/types/currencybeacon-api.types";

interface ConversionState {
  data: ConversionResponse;
  status: number;
}

export default function CurrencyConverter() {
  // Run SWR at start of render as we will always need currency data
  // This could be run server-side at the root of the page like so:
  //  const { data: { response: currencyList } } = await axios.get(`/api/currencies/`);
  // This would eliminate the need for a Loading dialog
  const { 
    data: currencyList, 
    error: currenciesError, 
    isLoading: currenciesLoading, 
  } = useSWR<{ response: CurrencyInfo[] }>('/api/currencies/', fetcher);

  // useActionState to help with form submission
  // @ts-expect-error comee back later if I have time
  const [conversionState, conversionFormAction, conversionPending] = useActionState(convertCurrencies, null) 

  if (currenciesLoading) return <p>Loading...</p>;
  if (currenciesError || !currencyList) return <p>Error loading conversion tool, please try again later</p>;

  return (
    <>
      <Form action={conversionFormAction} className="w-full">
        <div className="flex justify-between m-5">
          <div>
            <label htmlFor="currency-from">Convert: </label>
            {/* Hidden label for accessibility */}
            <label htmlFor="currency-amount" style={{display: 'none'}}>Currency amount:</label>
            <input 
              className="bg-gray-50 border border-gray-300 rounded-sm"
              placeholder="Enter amount" 
              name="currency-amount" 
              required 
              pattern="^[0-9]*$"></input>
          </div>
          <select 
            name="currency-from"
            className="bg-gray-50 border border-gray-300 rounded-sm"
          >
            {currencyList?.response.map(({id, name, short_code}) => {
              return (
                <option value={short_code} key={id}>
                  {`${name} (${short_code})`}
                </option>
              )
            })}
          </select>
        </div>
        <div className="flex justify-between m-5">
          <label htmlFor="currency-to">To: </label> 
          <select 
            name="currency-to"
            className="bg-gray-50 border border-gray-300 rounded-sm"
          >
            {currencyList?.response.map(({id, name, short_code}) => {
              return (
                <option value={short_code} key={id}>
                  {`${name} (${short_code})`}
                </option>
              )
            })}
          </select>
        </div>
        <div className="flex justify-around m-5">
          <button 
            type="submit" 
            disabled={conversionPending}
            className="bg-cyan-100 border border-gray-100 rounded-sm p-2"
          >
            Convert
          </button>
        </div>
      </Form>
      <DisplayConversion 
        // @ts-expect-error come back if I have time
        conversionState={conversionState}
        currencyList={currencyList.response}
        conversionPending={conversionPending}
      />
    </>
  )
}


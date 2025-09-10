# TDS Currency Conversion task - Steps taken

## Before work 

### Look at Google currency converter for example of UI best-practices
Considerations:
- Two currencies represented vertically (with timed graph of exchange rates)
- Exchange rate initially queried represented at the top of the component
- Two vertically represented input elements which the user can quick-compare currencies
- When the user selects a new currency in associated select element, exchange rates refreshed at the top of the component

### Based on TDS doc what do we need to build this?

- Fetcher for currencies to populate select dropdowns
    - react use hook for fetchCurrency
- Fetcher for conversion rates
    - react use hook for getConversion
- UI: two selects, only one input is actually specified, but it doesn't make sense to not also have two inputs here

### Potential gotchas and considerations
- Populating fields and then editing them where both are modified by external API requests could be an issue
- Decimal point representation
- Type of responses and coercion
- Basic stuff like string/num coercion causing NaN in text boxes, env vars for API keys, etc.

## API investigation

Two endpoints, Currencies and Convert. How will they need to be used?

### Currencies
- Needs a Type input.

### Convert
- Needs from, to and amount inputs. This is a single currency conversion.

### Other considerations

- There doesn't seem to be any example responses in this API documentation, which leaves a lot to be desired.
- You send the API key as part of the API. This should be dispatched from the server to not leak the API key to the user. Can hide this behind a nextJS route, but there is also a bearer option.

- Loading state, for use hook/suspend or SWR
- Unhappy paths

## Building

- Use create-next-app to quickly bootstrap an app
- Put API key in env vars
- Make API routes before any tests because i don't know what the API returns and i don't want to waste limited time in postman

### Data fetching

- Using SWR for data fetching rather than `use` as SWR is more idiomatic for vercel solution, and use documentation still seems somewhat limited
- Simple fetcher util written based on swr docs
- Had an issue with using SWR initially as the component was a server component and you're not allowed to use hooks in server components. I could do the entire fetch in a server component, which gives the component access to the currencies in select dropdowns, then can handle the request for conversion in the client.
- I'm going to use axios for fetching although it's not strictly necessary as it has a better API and I have found it easier to test in the past
- Create an env var for api fetching route as it's more useful for deployment

#### Currencies endpoint

Sample response, retrieved straight from app endpoint as i can't see one in the docs:
```
    {
      id: 98,
      name: 'Kwacha',
      short_code: 'MWK',
      code: '454',
      precision: 2,
      subunit: 100,
      symbol: 'MK',
      symbol_first: false,
      decimal_mark: '.',
      thousands_separator: ','
    },

```

#### Conversion endoint

I'm going to boot up insomnia quickly to make sure i'm sending the right info here before i make the endpoint or i'm going to end up wasting a lot of time

Params:
`to: GBP, from: HKD, amount: 10`

response:

```
{
	"meta": {
		"code": 200,
		"disclaimer": "Usage subject to terms: https://currencybeacon.com/terms"
	},
	"response": {
		"timestamp": 1757501565,
		"date": "2025-09-10",
		"from": "HKD",
		"to": "GBP",
		"amount": 10,
		"value": 0.9484206000000001
	},
	"timestamp": 1757501565,
	"date": "2025-09-10",
	"from": "HKD",
	"to": "GBP",
	"amount": 10,
	"value": 0.9484206000000001
}
```

Notes: No precision on output so we will need to truncate it

### UI

- Server-rendered root component has access to list of currencies
- Create the two selects and one input
- I modified the server-rendered root component as it doesn't make sense to split this component out
- Using SWR to fetch initial data is a bit troublesome as there is a flash of Loading... at the start - I could fetch this server-side at the root of the page and pass this data down to eliminate this so that a user only sees componentry once it is ready, but in the interests of time I will press on
- I will use next.js form actions for retrieving the information about the currency conversion
- useActionState will help in constructing the UI based on this, giving access to information about the query
- Flow:
    - SWR retrieves information about currencies (maybe suboptimal, could be done clientside)
    - User inputs information into form, presses convert
    - Convert kicks off form action which notifies clientside component of state
    - Server action retrieves conversion
    - Component displays conversion data



## Other considerations
- This app will allow a user to convert a currency to the same currency. This could be mitigated inside of the form action but I don't have time to implement it
- Would be nice to do some currency formatting on the currencies that are returned. I did find a library for this called Currency.js but i ran out of time and i've never used it before.
- Would be nice to display the full name of these currencies for users. I would do that by cross-referencing the shortcodes sent back from the convert API and the list of currencies available from the currency API and returning it in the response
- Using typescript was unnecessary for a project like this one, hence the rushed typing
- Used native HTML form validation for input box when something more elegant would be preferable
- The Next.js server action clears the form inputs when submitted, which isn't an ideal user flow.
- Didn't have time to implement tests
- I tried to deploy this to Netlify, but next.js api routes are only supported on pro & enterprise plans. It is deployed on Netlify at `https://currency-conversion-tool-interview-task-5f5dj1hw9.vercel.app`, but you need to have a vercel account to see it.

## Hiccups
- Next.js server actions and API routes are still somewhat poorly documented and this was a headache

## After-work TODOs

- Add documentation to repo for how to run, including:
    - Where to put API key

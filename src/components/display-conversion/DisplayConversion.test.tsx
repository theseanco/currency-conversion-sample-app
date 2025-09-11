import DisplayConversion from "./DisplayConversion";
import { render, screen } from '@testing-library/react';

// sample data taken from API JSON payload

// This would be more logically split into something like a Fixtures folder in a larger project
const conversionState = {
  data: {
		"timestamp": 1757501565,
		"date": "2025-09-10",
		"from": "HKD",
		"to": "GBP",
		"amount": 10,
		"value": 0.9484206000000001
  },
  status: 200,
};

const currencyList = [
  {
    "id": 57,
    "name": "Hong Kong Dollar",
    "short_code": "HKD",
    "code": "344",
    "precision": 2,
    "subunit": 100,
    "symbol": "$",
    "symbol_first": true,
    "decimal_mark": ".",
    "thousands_separator": ","
  },
  {
		"id": 49,
		"name": "Pound Sterling",
		"short_code": "GBP",
		"code": "826",
		"precision": 2,
		"subunit": 100,
		"symbol": "£",
		"symbol_first": true,
		"decimal_mark": ".",
		"thousands_separator": ","
	},
];

const conversionPending = false;

describe('DisplayConversion Component', () => {
  it('renders with correct currency information', async () => {
    render(
      <DisplayConversion 
        conversionState={conversionState}
        currencyList={currencyList}
        conversionPending={conversionPending}
      />
    )

    expect(await screen.findByText('10 Hong Kong Dollar is equal to 0.95 Pound Sterling')).toBeVisible()
  })

  // Date is hardcoded into component props
  it('renders with correct date information', async () => {
    render(
      <DisplayConversion 
        conversionState={conversionState}
        currencyList={currencyList}
        conversionPending={conversionPending}
      />
    )

    expect(await screen.findByText('Conversion correct as of 11:52:45 AM on Wed Sep 10 2025')).toBeVisible()
  })

  it('correctly renders arbitrary thousands separator and decimal units', async () => {
    render(
      <DisplayConversion 
        conversionState={{
          ...conversionState,
          data: {
            ...conversionState.data,
            value: 9999999.99
          }
        }}
        currencyList={[
          currencyList[0],
          {
            ...currencyList[1],
            decimal_mark: ',',
            thousands_separator: ' ',
          }
        ]}
        conversionPending={conversionPending}
      />
    )

    // Conversion is nonsense, but this is to test the thousands separator
    // Could do this testing by substring but better to get it in context
    expect(await screen.findByText('10 Hong Kong Dollar is equal to 9 999 999,99 Pound Sterling')).toBeVisible()
  })

  it('renders to correct precision points if more than zero but less than total precision is specified', async () => {
    render(
      // Here precision on GBP is 2 and we can take it as a given
      <DisplayConversion 
        conversionState={{
          ...conversionState,
          data: {
            ...conversionState.data,
            value: 99.9
          }
        }}
        currencyList={currencyList}
        conversionPending={conversionPending}
      />
    )

    // Conversion is nonsense, but this is to test the thousands separator
    // Could do this testing by substring but better to get it in context
    expect(await screen.findByText('10 Hong Kong Dollar is equal to 99.90 Pound Sterling')).toBeVisible()
  })

  it('renders to correct precision points if too much precision is specified', async () => {
    render(
      // Here precision on GBP is 2 and we can take it as a given
      <DisplayConversion 
        conversionState={{
          ...conversionState,
          data: {
            ...conversionState.data,
            value: 99.98912367841678315631951
          }
        }}
        currencyList={currencyList}
        conversionPending={conversionPending}
      />
    )

    // Conversion is nonsense, but this is to test the thousands separator
    // Could do this testing by substring but better to get it in context
    expect(await screen.findByText('10 Hong Kong Dollar is equal to 99.99 Pound Sterling')).toBeVisible()
  })

  // errors in the API are sent back as 500s in current configuration by next route, so a status of 200 indicates an error
  it('renders an error when supplied with 500 from parent', async () => {
    render(
      <DisplayConversion 
        conversionState={{
          ...conversionState,
          status: 500,
        }}
        currencyList={currencyList}
        conversionPending={conversionPending}
      />
    )

    expect(await screen.findByText('Error loading currency conversion. Please try again!')).toBeVisible()
  })

  it('renders a loading message when conversion is pending', async () => {
    render(
      <DisplayConversion 
        conversionState={{
          ...conversionState,
          status: 500,
        }}
        currencyList={currencyList}
        conversionPending={true}
      />
    )

    expect(await screen.findByText('Converting currencies...')).toBeVisible()
  })

  it('renders nothing when there is no conversion data', async () => {
    const { container } = render(
      <DisplayConversion 
        conversionState={undefined}
        currencyList={currencyList}
        conversionPending={true}
      />
    )

    expect(container).toBeEmptyDOMElement()
  })
})

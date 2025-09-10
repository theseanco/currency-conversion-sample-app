import type { NextApiResponse } from 'next'
import axios from 'axios'
 
export default async function handler(
  req: Request,
  res: NextApiResponse
) {
  try {
      // There has to be a better way way of accessing query parameters than this but i couldn't find one
      const [path, queryParams] = req.url.split('?');
      const searchParams = new URLSearchParams(queryParams);
      const currencyFrom = searchParams.get('currencyFrom');
      const currencyTo = searchParams.get('currencyTo');
      const currencyAmount = searchParams.get('currencyAmount');

    const { data } = await axios.get('https://api.currencybeacon.com/v1/convert', 
      {
        params: {
          api_key: process.env.CURRENCYBEACON_API_KEY,
          from: currencyFrom,
          to: currencyTo,
          amount: currencyAmount,
        }
      }
    );

    return res.status(200).json(data.response)
  } catch (err) {
    res.status(500).json({ error: 'Failed to get currency data' });
  }
}

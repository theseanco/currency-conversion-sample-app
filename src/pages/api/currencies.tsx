import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
 
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { data } = await axios.get('https://api.currencybeacon.com/v1/currencies', 
      {
        params: {
          api_key: process.env.CURRENCYBEACON_API_KEY 
        }
      }
    );

    return res.status(200).json(data)
  } catch {
    res.status(500).json({ error: 'Failed to get currency data' });
  }
}

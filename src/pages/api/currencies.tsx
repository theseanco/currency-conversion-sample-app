import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
 
type ResponseData = {
  message: string
}
 
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
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
  } catch (err) {
    res.status(500).json({ error: 'Failed to get currency data' });
  }
}

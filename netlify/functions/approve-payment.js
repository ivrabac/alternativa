const axios = require('axios');

exports.handler = async (event, context) => {
  const { paymentId } = JSON.parse(event.body);

  if (!paymentId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Payment ID is required' })
    };
  }

  // Access the PAYMENT_API_KEY from environment variables
  const PAYMENT_API_KEY = process.env.PAYMENT_API_KEY;

  if (!PAYMENT_API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'PAYMENT_API_KEY is missing from environment variables' })
    };
  }

  try {
    const postingURL = `https://api.minepi.com/v2/payments/${paymentId}/approve`;
    const response = await axios.post(postingURL, null, {
      headers: { Authorization: `key ${PAYMENT_API_KEY}` }
    });

    return {
      statusCode: 200,
      body: JSON.stringify(response.data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};

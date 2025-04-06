const axios = require('axios');

exports.handler = async (event, context) => {
  const { paymentId } = JSON.parse(event.body);

  if (!paymentId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Payment ID is required' })
    };
  }

  const APIKEY = process.env.PAYMENT_API_KEY; // Store the API key securely in environment variables

  try {
    const postingURL = `https://api.minepi.com/v2/payments/${paymentId}/approve`;
    const response = await axios.post(postingURL, null, {
      headers: { Authorization: `key ${APIKEY}` }
    });

    return {
      statusCode: 200,
      body: JSON.stringify(response.data)
    };
  } catch (error) {
    console.error('Error approving payment:', error); // Add logging for better error handling
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};

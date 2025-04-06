const axios = require('axios');

exports.handler = async (event, context) => {
  const { paymentId, txid } = JSON.parse(event.body);

  if (!paymentId || !txid) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Payment ID and TXID are required' })
    };
  }

  const APIKEY = 'b252b09aac2d7144be1e446120d8d0235cba327063a183324a06b0f22a68fd3c08d50b2b2ac24baa6a083323156cd87463e52e1e19c75834d36adf2a7c579de2';

  try {
    const postingURL = `https://api.minepi.com/v2/payments/${paymentId}/complete`;
    const response = await axios.post(postingURL, { txid }, {
      headers: { Authorization: `key ${APIKEY}` }
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

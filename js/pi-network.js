/*Pi Network Payment and ADs Integrator*/

const Pi = window.Pi;

// Empty array for testing purposes (can be updated with necessary scopes)
const scopes = ['username','payments'];

// Empty function that will log an incomplete payment if found
function onIncompletePaymentFound(payment) {
  console.log("Incomplete payment found:", payment);
}

// Initialize Pi and automatically authenticate
Pi.init({ version: "2.0" });

window.isAuthenticated = false;

// Authenticate automatically when the page loads
Pi.authenticate(scopes, onIncompletePaymentFound).then(function(auth) {
  console.log("Authenticated:", auth.user);
  window.isAuthenticated = true;
   document.querySelectorAll('.pi-feature').forEach(el => {
      el.style.display = 'block';
    });
}).catch(function(error) {
  console.error("Authentication error:", error);
  alert("Please log in via the Pi Browser and authenticate yourself.");
});

// Function to start the payment process
function startPayment() {
  if (!window.isAuthenticated) {
    alert("Please log in through the Pi Browser and authenticate your account. If you’ve already done so, kindly wait a moment and try again.");
    return;
  }

  console.log("Starting payment process...");
  Pi.createPayment({
    amount: 0.1,
    memo: "Support donation 🙌",
    metadata: { source: window.location.pathname }
  }, {
    // Callback for when payment is ready for server approval
    onReadyForServerApproval: function(paymentId) {
      console.log("Payment ready for server approval:", paymentId);
      fetch("/.netlify/functions/approve-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId })
      })
      .then(response => response.json())
      .then(data => console.log("Payment approved:", data))
      .catch(error => console.error("Error during approval:", error));
    },

    // Callback for when payment is ready for completion
    onReadyForServerCompletion: function(paymentId, txid) {
      console.log("Payment ready for server completion:", paymentId, txid);
      fetch("/.netlify/functions/complete-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId, txid })
      })
      .then(response => response.json())
      .then(data => console.log("Payment completed:", data))
      .catch(error => console.error("Error during completion:", error));
    },

    // Callback for when payment is canceled
    onCancel: function(paymentId) {
      console.log("User canceled payment:", paymentId);
    },

    // Callback for handling any errors during the payment process
    onError: function(error, payment) {
      console.error("Payment error:", error, payment);
    }
  });
}


		// you usually would check the ads support ahead of time and store the information PI NETWORK ADS INITIALIZATION - LETS GOOO
(async () => {
  await Pi.init({ version: "2.0" });
  const nativeFeaturesList = await Pi.nativeFeaturesList();
  const adNetworkSupported = nativeFeaturesList.includes("ad_network");
  // store adNetworkSupported for later use
})();

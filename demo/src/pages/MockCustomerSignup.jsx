import { useState } from "react";
import Button from "../components/common/Button";

const MockCustomerSignUp = () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const offeringKey = urlParams.get('offering_key');
  const billingInterval = urlParams.get('billing_interval');

  const [loading, setLoading] = useState(false);

  const getACustomer = async () => {
    try {
      setLoading(true);
      const client = window.metrifoxClient;
      const response = await client.customers.list({
        page: 1,
        per_page: 1,
      });

      if (response.statusCode === 200) {
        const customer = response.data[0]
        const customerKey = customer.customer_key
        if (offeringKey) {
          const checkoutUrl = await client.checkout.url({
            customerKey,
            offeringKey,
            billingInterval
          })
          window.open(checkoutUrl, "_blank", "noopener,noreferrer")
        }
      }
    } catch (error) {
      console.error('Failed to fetch customer:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="embedded-checkout-page">
      <div className="upload-section">
        <h2 className="content-title">Mock Customer Signup/Login</h2>
        <p className="content-description">This mocks the process of creating a customer and returns a customer key for the checkout flow.
          On mock success, the user should be redirected to the checkout page
        </p>
        <Button onClick={getACustomer} loading={loading}>
          Mock Create customer
        </Button>
      </div>
    </div>
  );
};

export default MockCustomerSignUp;
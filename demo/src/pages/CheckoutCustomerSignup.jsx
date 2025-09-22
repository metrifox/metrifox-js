import { useState } from "react";
import Button from "../components/common/Button";
import { FormRow, FormSelect, FormInput } from "../components/common/FormElements";

const CheckoutCustomerSignUp = () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const offeringKey = urlParams.get('offering_key');
  const billingInterval = urlParams.get('billing_interval');

  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [customer, setCustomer] = useState({
    customer_type: 'INDIVIDUAL',
    primary_email: '',
    customer_key: `cust-${Date.now()}` // unique identifier for customer.
  })

  const handleCustomerChange = (key, value) => {
    setCustomer({
      ...customer,
      [key]: value
    })
  }

  const showMessage = (msg, type = 'info') => {
    setMessage({ text: msg, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const createCustomer = async () => {
    if (!customer.primary_email) {
      showMessage('Email is required!', 'error')
      return
    }

    try {
      setLoading(true);
      /**
       * Create the customer on your platform then sync with Metrifox using `customers.create` below
       */
      const client = window.metrifoxClient;
      const response = await client.customers.create(customer);

      if (response.statusCode === 201) {
        const customerKey = response.data.customer_key
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
      showMessage(error.message, 'error')
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="embedded-checkout-page">
      {message && (
        <div className={`toast ${message.type}`}>
          {message.text}
        </div>
      )}
      <div className="upload-section">
        <h2 className="content-title">Checkout Customer Signup</h2>
        <p className="content-description">This mocks the process of creating a customer and returns a customer key for the checkout flow.
          On mock success, the user should be redirected to the checkout page
        </p>
        <div className="form-section">
          <FormRow>
            <FormSelect
              label="Customer Type"
              id="customer_type"
              value={customer.customer_type}
              onChange={(e) => handleCustomerChange('customer_type', e.target.value)}
              options={[
                { value: 'INDIVIDUAL', label: 'Individual' },
                { value: 'BUSINESS', label: 'Business' }
              ]}
            />
          </FormRow>
          <FormRow>
            <FormInput
              label="Email"
              id="primary_email"
              type="email"
              value={customer.primary_email}
              onChange={(e) => handleCustomerChange('primary_email', e.target.value)}
              placeholder="customer@example.com"
              error
              required
            />
          </FormRow>
        </div>
        <p className="content-description"></p>
        <Button onClick={createCustomer} loading={loading}>
          Create customer
        </Button>
      </div>
    </div>
  );
};

export default CheckoutCustomerSignUp;
import { CustomerPortal, metrifoxInit } from "@metrifox/react-sdk";
import "@metrifox/react-sdk/dist/styles.css";

const EmbeddedCustomerPortal = () => {
  metrifoxInit({ apiKey: "your-api-key" }); // Add your apikey

  return (
    <div>
      {/* Add your customer key */}
      <p>
        <b>Note:</b> To get your customer portal working, make sure you add your
        API key and customer key.
      </p>
      <CustomerPortal customerKey="your-customer-key" />
    </div>
  );
};

export default EmbeddedCustomerPortal;

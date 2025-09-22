# Metrifox JavaScript SDK

The official JavaScript library for the Metrifox platform. Build and scale usage-based SaaS applications with comprehensive tools for customer management, usage tracking, access control, and embedded billing experiences.

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
  - [Option 1: Client-Based Approach (Recommended)](#option-1-client-based-approach-recommended)
  - [Option 2: Direct SDK Class (Alternative)](#option-2-direct-sdk-class-alternative)
- [Usage Tracking & Access Control](#usage-tracking--access-control)
  - [Checking Feature Access](#checking-feature-access)
  - [Recording Usage Events](#recording-usage-events)
  - [Complete Usage Example](#complete-usage-example)
- [Customer Management](#customer-management)
  - [Creating Customers](#creating-customers)
  - [Updating Customers](#updating-customers)
  - [Getting Customer Data](#getting-customer-data)
  - [Deleting Customers](#deleting-customers)
  - [Bulk Customer Import (CSV)](#bulk-customer-import-csv)
- [Checkout & Billing](#checkout--billing)
  - [Embed Checkout Pages](#embed-checkout-pages)
  - [Generate Checkout url](#generate-checkout-url)
- [Framework Integration](#framework-integration)
  - [React/Vite](#reactvite)
  - [Next.js](#nextjs)
  - [Node.js/Express](#nodejsexpress)
- [API Reference](#api-reference)
- [Configuration](#configuration)
- [Error Handling](#error-handling)
- [Interactive Demo](#-interactive-demo)
- [Support](#support)

## Installation

```bash
npm install metrifox-js
```

## Quick Start

The Metrifox SDK supports a modern client-based architecture for better organization and type safety. Here are two ways to use it:

### Option 1: Client-Based Approach (Recommended)

Initialize once and use the client instance throughout your application.

#### 1. Set Environment Variable

```bash
# Node.js
METRIFOX_API_KEY=your_api_key_here

# Vite
VITE_METRIFOX_API_KEY=your_api_key_here

# Create React App
REACT_APP_METRIFOX_API_KEY=your_api_key_here
```

#### 2. Initialize Once and Store Client

**Vite/React (main.jsx):**

```javascript
import { init } from "metrifox-js";

// Initialize and store client globally
const metrifoxClient = init({
  apiKey: import.meta.env.VITE_METRIFOX_API_KEY,
});
window.metrifoxClient = metrifoxClient;
```

**Node.js:**

```javascript
import { init } from "metrifox-js";

// Store client instance
const metrifoxClient = init({
  apiKey: process.env.METRIFOX_API_KEY,
});
```

**Manual:**

```javascript
import { init } from "metrifox-js";

const metrifoxClient = init({
  apiKey: "your_api_key_here",
});
```

**Testing Environment:**

```javascript
import { init } from "metrifox-js";

const metrifoxClient = init({
  apiKey: "your_test_api_key",
});
```

#### 3. Use Client Modules

```javascript
// Access client instance (browser)
const client = window.metrifoxClient;

// Check access using usages module
const access = await client.usages.checkAccess({
  featureKey: "feature_forms",
  customerKey: "cust-7ec1e51",
});

if (access.can_access) {
  // Perform the action you want and then record usage (amount defaults to 1)
  await client.usages.recordUsage({
    customerKey: "cust-7ec1e51",
    eventName: "form.created",
  });
}
```

### Option 2: Direct SDK Class (Alternative)

For users who prefer a more traditional class-based approach:

```javascript
import { MetrifoxSDK } from "metrifox-js";

// Initialize SDK instance
const sdk = new MetrifoxSDK({
  apiKey: "your_api_key_here",
});

// Use directly
const access = await sdk.usages.checkAccess({
  featureKey: "feature_forms",
  customerKey: "cust-7ec1e51",
});

if (access.can_access) {
  await sdk.usages.recordUsage({
    customerKey: "cust-7ec1e51",
    eventName: "form.created",
  });
}
```

> **Note:** Both approaches work identically. The client-based approach (Option 1) is recommended for better organization and TypeScript support.

## Usage Tracking & Access Control

Control feature access and track usage events with the usages module.

### Checking Feature Access

Check if a customer has access to a specific feature before allowing them to use it:

```javascript
const client = window.metrifoxClient; // or your stored client instance

const result = await client.usages.checkAccess({
  featureKey: "premium_feature",
  customerKey: "customer_123",
});

if (result.can_access) {
  // User has access - allow feature use
  console.log(`Remaining balance: ${result.balance}`);
} else {
  // Show upgrade prompt or limit reached message
  console.log(`Quota exceeded. Used: ${result.used_quantity}/${result.quota}`);
}
```

### Recording Usage Events

Record when customers use features to track consumption against their quotas:

```javascript
const client = window.metrifoxClient; // or your stored client instance

// Simple usage (amount = 1)
await client.usages.recordUsage({
  customerKey: "customer_123",
  eventName: "api_call",
});

// Custom amount for bulk operations
await client.usages.recordUsage({
  customerKey: "customer_123",
  eventName: "bulk_upload",
  amount: 50, // Record 50 units at once
});
```

### Complete Usage Example

Here's a complete example showing the typical access control + usage recording pattern:

```javascript
async function useFeature(metrifoxClient, customerKey, featureKey, eventName) {
  try {
    // 1. Check if customer has access
    const access = await metrifoxClient.usages.checkAccess({
      featureKey,
      customerKey,
    });

    if (access.can_access) {
      // 2. Perform the actual feature logic here
      const result = performFeatureLogic();

      // 3. Record usage after successful completion
      await metrifoxClient.usages.recordUsage({
        customerKey,
        eventName,
        amount: result.unitsUsed || 1,
      });

      return { success: true, data: result };
    } else {
      return {
        success: false,
        error: "Quota exceeded",
        balance: access.balance,
        quota: access.quota,
      };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

## Customer Management

Manage your customers directly through the SDK with full CRUD operations.

### Creating Customers

Add new customers to your Metrifox account:

```javascript
const client = window.metrifoxClient; // or your stored client instance

// Individual customer
const individualCustomer = {
  customer_key: "user_12345",
  customer_type: "INDIVIDUAL",
  primary_email: "john.doe@example.com",
  first_name: "John",
  last_name: "Doe",
  primary_phone: "+1234567890",
  // Optional fields
  billing_email: "billing@example.com",
  timezone: "America/New_York",
  language: "en",
  currency: "USD",
};

const response = await client.customers.create(individualCustomer);
console.log("Customer created:", response.data);
```

```javascript
// Business customer
const businessCustomer = {
  customer_key: "company_abc123",
  customer_type: "BUSINESS",
  primary_email: "contact@acmecorp.com",
  legal_name: "ACME Corporation LLC",
  display_name: "ACME Corp",
  website_url: "https://acmecorp.com",
  // Optional fields
  account_manager: "Sarah Johnson",
  tax_identification_number: "12-3456789",
};

const response = await client.customers.create(businessCustomer);
```

### Updating Customers

Modify existing customer information:

```javascript
const client = window.metrifoxClient;

const updates = {
  customer_key: "updated_customer_key", // Can change the key if needed
  primary_email: "newemail@example.com",
  first_name: "Jane", // Update individual fields
  currency: "EUR", // Change preferences
};

const response = await client.customers.update(
  "existing_customer_key",
  updates
);
```

### Getting Customer Data

Retrieve customer information:

```javascript
const client = window.metrifoxClient;

// Get a list of all customers with pagination and filtering
const customerList = await client.customers.list({
  page: 1,
  per_page: 50,
  search_term: "john@example.com", // Optional: search by email or name
  customer_type: "INDIVIDUAL", // Optional: filter by type ('INDIVIDUAL' | 'BUSINESS')
  date_created: "2025-09-01", // Optional: filter by creation date
});

console.log("Customers:", customerList.data); // Array of customers
console.log("Pagination:", customerList.meta); // Pagination info

// Get basic customer data
const customer = await client.customers.get("customer_key_123");

// Get detailed customer information (includes usage stats, billing info, etc.)
const customerDetails = await client.customers.getDetails("customer_key_123");
console.log("Usage stats:", customerDetails.usage_summary);
```

### Deleting Customers

Remove customers from your account:

```javascript
const client = window.metrifoxClient;

// Delete customer (this will also remove all their usage history)
const response = await client.customers.delete("customer_key_to_delete");
```

### Bulk Customer Import (CSV)

Upload multiple customers at once using a CSV file:

```javascript
const client = window.metrifoxClient;

// File input from your form
const csvFile = document.getElementById("csv-input").files[0];

const response = await client.customers.uploadCsv(csvFile);
console.log(`Processed ${response.data.total_customers} customers`);
console.log(`Successful: ${response.data.successful_upload_count}`);
console.log(`Failed: ${response.data.failed_upload_count}`);

// Handle failed imports
if (response.data.failed_upload_count > 0) {
  response.data.customers_failed.forEach((failure) => {
    console.log(`Row ${failure.row}: ${failure.error}`);
  });
}
```

## Checkout & Billing

Configure your checkout experience

### Embed Checkout Pages

Embed Metrifox checkout pages directly in your application for seamless billing experiences.

```javascript
const client = window.metrifoxClient; // or your stored client instance

// Embed checkout pages within your application
await client.checkout.embed({
  productKey: "your_product_key",
  container: "#checkout-container", // CSS selector or DOM element
});

// The checkout page will be embedded as an iframe in the specified container
// Customers can upgrade/manage billing without leaving your app
```

### Generate checkout url

Generate checkout url for your customer.

```javascript
const client = window.metrifoxClient; // or your stored client instance

// Generate a checkout url
await client.checkout.url({
  offeringKey: "your_offering_key", // Key of the offering the customer will purchase
  billingInterval: "billing_interval", // Billing interval: e.g. "monthly", "yearly", or "quarterly". This is optional for offerings that do not have billing intervals
  customerKey: "customer_key", // Key of the customer making the purchase
});
```

If you're configuring your own pricing page, the above example should be sufficient. However, if you're using Metrifox's pricing page but want to handle customer verification yourself, follow the steps below:

- Set your signup URL in the Checkout section of your dashboard settings.
- On your signup/login page (the URL configured above), extract the `offering_key` and `billing_interval` query parameters from the URL. These are included when a customer is redirected from the Metrifox checkout page.
- After verifying the customer, retrieve the `customer_key` which is the unique identifier of the customer on your platform, and use it along with the extracted parameters to generate a checkout URL. (Remember to sync your new customer with Metrifox using `customer.create` from the sdk)
- Redirect the customer to the generated URL so they can complete their order.

```javascript
  const client = window.metrifoxClient; // or your stored client instance

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const offeringKey = urlParams.get('offering_key');
  const billingInterval = urlParams.get('billing_interval');
  //Store the extracted params above if your customer would navigate from the initial url

  const customerSignUp = async () => {
    try {
      const customerDetails = await mockCustomerSignUp() //Replace with your actual signup/login function

      if (customerDetails) {
        const customerKey = customerDetails.customer_key
        if (offeringKey) {
          const checkoutUrl = await client.checkout.url({
            customerKey,
            offeringKey,
            billingInterval
          })
          window.open(checkoutUrl, "_blank", "noopener,noreferrer") // Open the URL in a new tab or handle as needed
        }
      }
    } catch (error) {
      // handle error
    } finally {
      ...
    }
  };
```

## Framework Integration

The usage is identical across all frameworks. Only initialization differs:

### React/Vite

**Setup once in main.jsx:**

```javascript
import { init } from "metrifox-js";

const metrifoxClient = init({
  apiKey: import.meta.env.VITE_METRIFOX_API_KEY,
});
window.metrifoxClient = metrifoxClient;
```

**Use in components:**

```javascript
function FeatureButton({ customerKey }) {
  const handleClick = async () => {
    const client = window.metrifoxClient;
    const access = await client.usages.checkAccess({
      featureKey: "premium_feature",
      customerKey,
    });

    if (access.can_access) {
      await client.usages.recordUsage({
        customerKey,
        eventName: "button_clicked",
      });
    }
  };

  return <button onClick={handleClick}>Use Feature</button>;
}
```

### Next.js

**Setup once in \_app.js:**

```javascript
import { init } from "metrifox-js";

const metrifoxClient = init({
  apiKey: process.env.METRIFOX_API_KEY,
});

// Export for use in other modules
export { metrifoxClient };
```

### Node.js/Express

**Setup once:**

```javascript
import { init } from "metrifox-js";

const metrifoxClient = init({
  apiKey: process.env.METRIFOX_API_KEY,
});

app.get("/api/premium/:customerId", async (req, res) => {
  const access = await metrifoxClient.usages.checkAccess({
    featureKey: "premium_api",
    customerKey: req.params.customerId,
  });

  if (!access.can_access) {
    return res.status(403).json({ error: "Access denied" });
  }

  await metrifoxClient.usages.recordUsage({
    customerKey: req.params.customerId,
    eventName: "premium_api_call",
  });

  res.json({ data: "premium content" });
});
```

## API Reference

### Client Architecture

The SDK uses a modular client-based architecture:

```javascript
const client = init(config);

// Available modules:
client.usages; // Usage tracking and access control
client.customers; // Customer management
client.checkout; // Embedded checkout
```

### Functions

**Initialization:**

- `init(config?)` - Initialize and return the SDK client

**Usage Module (`client.usages`):**

- `checkAccess(request)` - Check feature access for a customer
- `recordUsage(request)` - Record a usage event

**Customers Module (`client.customers`):**

- `create(request)` - Add a customer
- `update(customerKey, request)` - Update a customer
- `list(params?)` - Get a paginated list of customers with optional filtering
- `get(customerKey)` - Get a customer
- `delete(customerKey)` - Delete a customer
- `getDetails(customerKey)` - Get detailed customer information
- `uploadCsv(file)` - Upload a CSV list of customers

**Checkout Module (`client.checkout`):**

- `embed(config)` - Embed checkout pages in your application

### Types

All TypeScript types are available for import from the SDK:

```typescript
import {
  AccessCheckRequest,
  UsageEventRequest,
  AccessResponse,
  CustomerCreateRequest,
  CustomerUpdateRequest,
  CustomerDeleteRequest,
  CustomerCSVSyncResponse,
  APIResponse,
  TaxStatus,
  EmailAddress,
  PhoneNumber,
  Address,
  BillingConfig,
  TaxIdentification,
  ContactPerson,
  PaymentTerm,
} from "metrifox-js";
```

For complete type definitions, see the [TypeScript definitions](https://github.com/metrifox/metrifox-js/blob/main/src/utils/interface.ts) in the source code.

📚 **Full Documentation**: Visit [docs.metrifox.com](https://docs.metrifox.com) for comprehensive guides, API reference, and examples.

## Configuration

- `apiKey` - Your Metrifox API key
- `baseUrl` - Custom API base URL (optional, defaults to `https://api.metrifox.com/api/v1/`)

### Environment URLs

- **Production (default):** `https://api.metrifox.com/api/v1/`
- **Demo/Testing:** Use our demo environment URL

**Recommendation:** Always test your integration against the demo environment first before switching to production.

## Error Handling

Wrap calls in try-catch blocks:

```javascript
try {
  const client = window.metrifoxClient; // or your stored client instance
  const access = await client.usages.checkAccess({ featureKey, customerKey });
} catch (error) {
  // Handle network errors, invalid API key, etc.
  console.error("Metrifox API error:", error.message);
}
```

## License

MIT License - see LICENSE file for details.

## Support

For support, contact [support@metrifox.com](mailto:support@metrifox.com) or visit our [documentation](https://docs.metrifox.com).

📚 **Documentation**: [docs.metrifox.com](https://docs.metrifox.com) - Complete guides, API reference, and examples.

---

## 🧪 Interactive Demo

Want to see the SDK in action? Clone this repository and try the demo app:

```bash
git clone https://github.com/metrifox/metrifox-js.git
cd metrifox-js/demo
npm install
npm run dev
```

Open http://localhost:3002 and test the library with your API key, customer key and features!

## License

MIT License - see LICENSE file for details.

## Support

For support, contact [support@metrifox.com](mailto:support@metrifox.com) or visit our [documentation](https://docs.metrifox.com).

# Metrifox JavaScript SDK

The official JavaScript library for Metrifox usage tracking and access control. Integrate usage-based features into your applications with just a few lines of code.

## Installation

```bash
npm install metrifox-js
```

## Quick Start

### 1. Set Environment Variable

```bash
# Node.js
METRIFOX_API_KEY=your_api_key_here

# Vite
VITE_METRIFOX_API_KEY=your_api_key_here

# Create React App
REACT_APP_METRIFOX_API_KEY=your_api_key_here
```

### 2. Initialize Once

**Vite/React (main.jsx):**

```javascript
import { init } from "metrifox-js";
init({ apiKey: import.meta.env.VITE_METRIFOX_API_KEY });
```

**Node.js:**

```javascript
// Auto-detects METRIFOX_API_KEY - no initialization needed!
```

**Manual:**

```javascript
import { init } from "metrifox-js";
init({ apiKey: "your_api_key_here" });
```

**Testing Environment:**

```javascript
import { init } from "metrifox-js";
init({
  apiKey: "your_test_api_key",
  baseUrl: "your_demo_environment_url", // Use our demo environment
});
```

### 3. Use Anywhere

```javascript
import { checkAccess, recordUsage } from "metrifox-js";

// Check access
const access = await checkAccess({
  featureKey: "feature_forms",
  customerKey: "cust-7ec1e51",
});

if (access.can_access) {
  // Perform the action you want and then record usage (amount defaults to 1)
  await recordUsage({
    customerKey: "cust-7ec1e51",
    eventName: "form.created",
  });
}
```

## Usage

### Checking Access Only

```javascript
const result = await checkAccess({
  featureKey: "premium_feature",
  customerKey: "customer_123",
});

if (result.can_access) {
  // User has access
} else {
  // Show upgrade prompt
}
```

### Recording Usage Only

```javascript
// Simple usage (amount = 1)
await recordUsage({
  customerKey: "customer_123",
  eventName: "api_call",
});

// Custom amount
await recordUsage({
  customerKey: "customer_123",
  eventName: "bulk_upload",
  amount: 50,
});
```

### Embed plan and checkout pages

```javascript
import { embedCheckout } from "metrifox-js";

// Embed checkout pages within your application
embedCheckout({
  productId: "your_product_key",
  container: "#checkout-container", //query selector or DOM node
});
```

### Complete Example

```javascript
import { checkAccess, recordUsage } from "metrifox-js";

async function useFeature(customerKey, featureKey, eventName) {
  try {
    const access = await checkAccess({ featureKey, customerKey });

    if (access.can_access) {
      // do something here and record the feature usage immediately after if needed
      await recordUsage({ customerKey, eventName });
      return { success: true };
    } else {
      return { success: false, balance: access.balance };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

### Customer Management

```javascript
import { createCustomer, updateCustomer, getCustomer, getCustomerDetails, deleteCustomer, uploadCustomersCsv } from "metrifox-js";
// Simple usage (amount = 1)
customerData = {
    customer_key: 'your_customer_unique_id',
    primary_email: 'customer_email@example.com',
    ...other_fields // See our documentation or types below
}
// Create a customer
const response = await createCustomer(customerData);

// Update a customer
currentCustomerKey = 'existing_customer_key'
editPayload = {
    customer_key: "new_customer_key_to_update", // You can update the customer key in case of mistakes
    primary_email: "new_email@example.com"
}
const response = await updateCustomer(currentCustomerKey, editPayload);

keyParam = {
    customer_key: 'your_customer_unique_id'
}

// Delete a customer
const response = await deleteCustomer(keyParam.customer_key);

// Get a customer
const response = await getCustomer(keyParam.customer_key);

// Get customer details
const response = await getCustomerDetails(keyParam.customer_key);

// Upload customers list in CSV
const response = await uploadCustomersCsv(csv_file); // See docs for downloadable sample csv
```

## Framework Integration

The usage is identical across all frameworks. Only initialization differs:

### React/Vite

**Setup once in main.jsx:**

```javascript
import { init } from "metrifox-js";
init({ apiKey: import.meta.env.VITE_METRIFOX_API_KEY });
```

**Use in components:**

```javascript
function FeatureButton({ customerKey }) {
  const handleClick = async () => {
    const access = await checkAccess({
      featureKey: "premium_feature",
      customerKey,
    });

    if (access.can_access) {
      await recordUsage({
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
init({ apiKey: process.env.METRIFOX_API_KEY });
```

### Node.js/Express

**No setup needed - auto-detects METRIFOX_API_KEY:**

```javascript
const { checkAccess, recordUsage } = require("metrifox-js");

app.get("/api/premium/:customerId", async (req, res) => {
  const access = await checkAccess({
    featureKey: "premium_api",
    customerKey: req.params.customerId,
  });

  if (!access.can_access) {
    return res.status(403).json({ error: "Access denied" });
  }

  await recordUsage({
    customerKey: req.params.customerId,
    eventName: "premium_api_call",
  });

  res.json({ data: "premium content" });
});
```

## API Reference

### Functions

- `init(config?)` - Initialize the SDK with configuration
- `checkAccess(request)` - Check feature access for a customer
- `recordUsage(request)` - Record a usage event
- `createCustomer(request)` - Add a customer
- `updateCustomer(customerKey, request)` - Update a customer
- `deleteCustomer(request)` - Delete a customer
- `uploadCustomersCsv(file)` - Upload a CSV list of customers


### Types

```typescript
interface AccessCheckRequest {
  featureKey: string;
  customerKey: string;
}

interface UsageEventRequest {
  customerKey: string;
  eventName: string;
  amount?: number; // Optional, defaults to 1
}

interface AccessResponse {
  can_access: boolean;
  customer_key: string;
  feature_key: string;
  used_quantity: number;
  quota: number;
  balance: number;
  next_reset_at: number;
  message: string;
  required_quantity: number;
  included_usage: number;
  unlimited: boolean;
  carryover_quantity: number;
}

export enum TaxStatus {
    TAXABLE = "TAXABLE",
    TAX_EXEMPT = "TAX_EXEMPT",
    REVERSE_CHARGE = "REVERSE_CHARGE"
}

// Utility DTOs
export interface EmailAddress {
    email: string;
    is_primary?: boolean;
}

export interface PhoneNumber {
    phone_number: string;
    country_code: string;
    is_primary?: boolean;
}

export interface Address {
    country?: string;
    address_line1?: string;
    address_line2?: string;
    city?: string;
    state?: string;
    zip_code?: string;
    phone_number?: string;
}

export interface BillingConfig {
    preferred_payment_gateway?: string;
    preferred_payment_method?: string;
    billing_email?: string;
    billing_address?: string;
    payment_reminder_days?: number;
}

export interface TaxIdentification {
    type: string;
    number: string;
    country?: string;
}

export interface ContactPerson {
    first_name?: string;
    last_name?: string;
    email_address?: string;
    designation?: string;
    department?: string;
    is_primary?: boolean;
    phone_number?: string;
}

export interface PaymentTerm {
    type: string;
    value: string;
}


type CustomerType = 'BUSINESS' | 'INDIVIDUAL';

export interface CustomerCreateRequest {
    // Core fields
    customer_key: string; // required field
    customer_type: CustomerType;
    primary_email: string; // required field
    primary_phone?: string;

    // Business fields
    legal_name?: string;
    display_name?: string;
    legal_number?: string;
    tax_identification_number?: string;
    logo_url?: string;
    website_url?: string;
    account_manager?: string;

    // Individual fields
    first_name?: string;
    middle_name?: string;
    last_name?: string;
    date_of_birth?: string; // ISO date string format
    billing_email?: string;

    // Preferences
    timezone?: string;
    language?: string;
    currency?: string;
    tax_status?: string;

    // Address fields
    address_line1?: string;
    address_line2?: string;
    city?: string;
    state?: string;
    country?: string;
    zip_code?: string;

    // Shipping address fields
    shipping_address_line1?: string;
    shipping_address_line2?: string;
    shipping_city?: string;
    shipping_state?: string;
    shipping_country?: string;
    shipping_zip_code?: string;

    // Complex JSON fields
    billing_configuration?: BillingConfig;
    tax_identifications?: Array<TaxIdentification>;
    contact_people?: Array<ContactPerson>;
    payment_terms?: Array<PaymentTerm>;
    metadata?: Record<string, any>;
}

export interface CustomerUpdateRequest {
    // Core fields
    customer_key: string; // required field
    customer_type?: CustomerType;
    primary_email?: string;
    primary_phone?: string;
    billing_email?: string;
    // Business fields
    legal_name?: string;
    display_name?: string;
    legal_number?: string;
    tax_identification_number?: string;
    logo_url?: string;
    website_url?: string;
    account_manager?: string;

    // Individual fields
    first_name?: string;
    middle_name?: string;
    last_name?: string;
    date_of_birth?: string; // ISO date string format

    // Preferences
    timezone?: string;
    language?: string;
    currency?: string;
    tax_status?: string;

    // Address fields
    address_line1?: string;
    address_line2?: string;
    city?: string;
    state?: string;
    country?: string;
    zip_code?: string;

    // Shipping address fields
    shipping_address_line1?: string;
    shipping_address_line2?: string;
    shipping_city?: string;
    shipping_state?: string;
    shipping_country?: string;
    shipping_zip_code?: string;

    // Complex JSON fields 
    billing_configuration?: BillingConfig;
    tax_identifications?: Array<TaxIdentification>;
    contact_people?: Array<ContactPerson>;
    payment_terms?: Array<PaymentTerm>;
    metadata?: Record<string, any>;
}

export interface CustomerDeleteRequest {
    customer_key: string;
}


export interface CustomerCSVSyncResponse {
    statusCode: number;
    message?: string;
    data: {
        total_customers: number;
        successful_upload_count: number;
        failed_upload_count: number;
        customers_added: Array<{
            row: number;
            customer_key: string;
            data: any;
        }>;
        customers_failed: Array<{
            row: number;
            customer_key: string;
            error: string;
        }>;
    }
    errors?: any;
    meta?: any;
}

export interface APIResponse {
    statusCode: number;
    message?: string;
    data?: any;
    errors?: any;
    meta?: any;
}
```

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
  const access = await checkAccess({ featureKey, customerKey });
} catch (error) {
  // Handle network errors, invalid API key, etc.
}
```

## License

MIT License - see LICENSE file for details.

## Support

For support, contact [support@metrifox.com](mailto:support@metrifox.com) or visit our [documentation](https://docs.metrifox.com).

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

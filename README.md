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
    customerKey: req.params.customerKey,
  });

  if (!access.can_access) {
    return res.status(403).json({ error: "Access denied" });
  }

  await recordUsage({
    customerKey: req.params.customerKey,
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
  // ... other fields
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

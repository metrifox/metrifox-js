# Metrifox Demo App

This is a complete demo application that shows how to use the Metrifox JavaScript SDK in a real React application.

## Features

- 🔑 **API Key Configuration** - Enter your Metrifox API key
- 🧪 **Live Testing** - Test access checking and usage recording
- 📊 **Real-time Results** - See quota, usage, and access information
- 🎨 **Beautiful UI** - Clean, modern interface
- ⚡ **Instant Feedback** - See exactly what's happening with each API call

## Quick Start

### 1. Install Dependencies

```bash
cd demo
npm install
```

### 2. Set Up Environment (Optional)

Copy the example environment file and add your API key:

```bash
cp .env.example .env
```

Edit `.env` and add your actual API key:

```
VITE_METRIFOX_API_KEY=your_actual_api_key_here
```

### 3. Run the Demo

```bash
npm run dev
```

Open http://localhost:3002 in your browser.

## How to Use

### Step 1: Configure the SDK

1. Enter your Metrifox API key in the "API Key" field
2. Set your customer key (e.g., `cust-7ec1e51`)
3. Set your feature key (e.g., `feature_intents`)
4. Click "Initialize SDK"

### Step 2: Test API Calls

1. Click "Make API Call" to test the functionality
2. The app will:
   - Check if the customer has access to the feature
   - If access is granted: record a usage event
   - If access is denied: show an error message
3. View the detailed results below

### Step 3: Understand the Results

- **Access Status**: Whether the customer can use the feature
- **Used/Quota**: How much of their quota they've used
- **Balance**: Remaining usage balance
- **Next Reset**: When their quota resets

## What This Demo Shows

### 1. Access Checking

```javascript
const access = await checkAccess({
  featureKey: "feature_intents",
  customerKey: "cust-7ec1e51",
});

if (access.canAccess) {
  // Customer has access - proceed with feature
} else {
  // Customer doesn't have access - show upgrade message
}
```

### 2. Usage Recording

```javascript
// Only record usage when customer actually uses the feature
await recordUsage({
  customerKey: "cust-7ec1e51",
  eventName: "api_call_made",
  amount: 1,
});
```

### 3. Error Handling

The demo shows proper error handling for:

- Invalid API keys
- Network errors
- API rate limits
- Missing configuration

## API Endpoints

By default, the demo connects to:

- **Base URL**: `https://api.metrifox.com`
- **Access Check**: `GET /usage/access`
- **Usage Recording**: `POST /usage/events`

To test against a different endpoint, modify the `baseUrl` in `src/App.jsx`.

## Customization

### Change API Endpoint

In `src/App.jsx`, update the initialization:

```javascript
init({
  apiKey: apiKey.trim(),
  baseUrl: "https://your-custom-api.com", // Change this
});
```

### Add More Features

You can extend the demo to test:

- Multiple features
- Different customer tiers
- Batch usage recording
- Custom event types

## Troubleshooting

### CORS Issues

If you get CORS errors, make sure your API server allows requests from `http://localhost:3002`.

### API Key Issues

- Make sure your API key is valid
- Check that your API key has the necessary permissions
- Verify the customer and feature keys exist in your system

### Build Issues

If you get build errors:

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

## Production Deployment

To build for production:

```bash
npm run build
npm run preview
```

The built files will be in the `dist` directory.

## Next Steps

Once you've tested the demo:

1. Integrate the Metrifox SDK into your actual application
2. Set up proper environment variable management
3. Add error logging and monitoring
4. Implement proper user authentication
5. Add more sophisticated access control logic

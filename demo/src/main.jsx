import React from 'react'
import ReactDOM from 'react-dom/client'
import { init } from 'metrifox-js'
import App from './App.jsx'

// Initialize Metrifox SDK once at app startup
const metrifoxClient = init({
    apiKey: import.meta.env.VITE_METRIFOX_API_KEY || "eb95ce038b6ba42a02b2ff254b37b3e7eadd1564e7fe566f1ac7a563de62ca12",
    webAppBaseUrl: import.meta.env.VITE_WEB_BASE_URL || "http://localhost:3000",
    baseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:3003/api/v1/"
});

// Make the client available globally
window.metrifoxClient = metrifoxClient;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App customerKey="cust-70ce1e51" featureKey="feature_forms" eventName="form.created" />
  </React.StrictMode>,
) 
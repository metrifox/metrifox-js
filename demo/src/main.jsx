import React from 'react'
import ReactDOM from 'react-dom/client'
import { init } from 'metrifox-js'
import App from './App.jsx'

// Initialize Metrifox SDK once at app startup
const metrifoxClient = init({
  apiKey: import.meta.env.VITE_METRIFOX_API_KEY,
  baseUrl: "http://localhost:5000/api/v1/",
  webAppBaseUrl: "http://localhost:3000"
});

// Make the client available globally
window.metrifoxClient = metrifoxClient;

console.log('key ', import.meta.env.VITE_METRIFOX_API_KEY)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App customerKey="cust-70ce1e51" featureKey="feature_forms" eventName="form.created" />
  </React.StrictMode>,
) 
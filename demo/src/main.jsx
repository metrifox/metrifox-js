import React from 'react'
import ReactDOM from 'react-dom/client'
import { init } from 'metrifox-js'
import App from './App.jsx'

// Initialize Metrifox SDK once at app startup
init({
    apiKey: import.meta.env.VITE_METRIFOX_API_KEY || "3d2475a57807243ab853bc0250d8eb30608074da355ca321394ae71a2aa882b7",
    webAppBaseUrl: import.meta.env.VITE_WEB_BASE_URL || "http://localhost:3000",
    baseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:3003/api/v1"
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App customerKey="cust-70ce1e51" featureKey="feature_forms" eventName="form.created" />
  </React.StrictMode>,
) 
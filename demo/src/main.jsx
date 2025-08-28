import React from 'react'
import ReactDOM from 'react-dom/client'
import { init } from 'metrifox-js'
import App from './App.jsx'

// Initialize Metrifox SDK once at app startup
init({ apiKey: "3d2475a57807243ab853bc0250d8eb30608074da355ca321394ae71a2aa882b7", webAppBaseUrl: "http://localhost:3000", baseUrl: "http://localhost:3003/api/v1/" });

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App customerKey="cust-70ce1e51" featureKey="feature_forms" eventName="form.created" />
  </React.StrictMode>,
) 
import React from 'react'
import ReactDOM from 'react-dom/client'
import { init } from 'metrifox-js'
import App from './App.jsx'

// Initialize Metrifox SDK once at app startup
init({ apiKey: "b9d1430abc6b17169d1922b47476a5faa0a16fa6402ce47b417c14f638f1edde", webAppBaseUrl: "http://localhost:3000", baseUrl: "http://localhost:3003/api/v1/" });

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App customerKey="cust-70ce1e51" featureKey="feature_forms" eventName="form.created" />
  </React.StrictMode>,
) 
/*
----------------------------------------------------------------------------
Project     : Zambia Smart Bus Tracker
Module      : index.js
Author      : Adam ChapChap Ng'uni
Date        : 2026-03-20
Time        : 10:54:11 CAT
Description :
  Bootstraps the React application into the browser DOM.

  This file's role in the codebase:
    - imports global dependencies and base CSS
    - creates the React root and mounts App component
    - acts as the frontend runtime entry point

Notes:
  Preserve root mount id consistency with public/index.html.
----------------------------------------------------------------------------
*/

import 'leaflet/dist/leaflet.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
)
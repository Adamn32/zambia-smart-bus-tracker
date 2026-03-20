/*
----------------------------------------------------------------------------
Project     : Zambia Smart Bus Tracker
Module      : index.js
Author      : Adam ChapChap Ng'uni
Date        : 2026-03-20
Time        : 10:54:11 CAT
Description : React entry point that mounts the application to the DOM.
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
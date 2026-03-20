/*
----------------------------------------------------------------------------
Project     : Zambia Smart Bus Tracker
Module      : App.js
Author      : Adam ChapChap Ng'uni
Date        : 2026-03-20
Time        : 10:54:11 CAT
Description :
  Renders the root React component for the web client.

  This file's role in the codebase:
    - mounts the main map experience through MapView
    - keeps the top-level app composition intentionally minimal
    - serves as the frontend handoff point from index.js

Notes:
  Keep this component lightweight to avoid unnecessary root re-renders.
----------------------------------------------------------------------------
*/

import MapView from "./MapView"

function App(){
  return <MapView/>
}

export default App

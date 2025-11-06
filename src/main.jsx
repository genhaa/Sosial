// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // <-- IMPORT INI
import App from './App.jsx'
import './index.css' // Pastiin CSS global ke-import

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> {/* <-- TAMBAH INI */}
      <App />
    </BrowserRouter> {/* <-- TAMBAH INI */}
  </React.StrictMode>,
)
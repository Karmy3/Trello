import React from 'react'
import { createRoot } from 'react-dom/client' // On importe directement createRoot
import { BrowserRouter } from 'react-router-dom'
import App from './App'

const container = document.getElementById('root');
const root = createRoot(container); // On l'utilise sans le préfixe ReactDOM

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
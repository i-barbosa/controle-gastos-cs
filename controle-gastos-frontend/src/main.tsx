import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Ponto de entrada da aplicação.
// É aqui que o React é inicializado e renderizado na página.
ReactDOM.createRoot(document.getElementById('root')!).render(

  // StrictMode ajuda a identificar possíveis problemas durante o desenvolvimento.
  <React.StrictMode>

    {/* Componente principal da aplicação. */}
    <App />

  </React.StrictMode>,
)
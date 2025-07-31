import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux';
import { store } from './redux/srore.js';
import "react-datepicker/dist/react-datepicker.css";
import { AuthProvider } from './context/AuthContext';





createRoot(document.getElementById('root')).render(


  <StrictMode>
            <Provider store={store}>
              <AuthProvider>

            <App />
              </AuthProvider>
            </Provider>

  </StrictMode>,
)

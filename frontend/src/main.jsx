import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store/store';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  // Doble render disable temporarily for dev environment
  // <StrictMode> 
  // Redux Provider
    <Provider store={store}>  
      <App />
    </Provider>
  // </StrictMode>,
);

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import PropertiesListRedux from './pages/PropertiesList/PropertiesListRedux';
import PropertyDetailOptimized from './pages/PropertyDetail/PropertyDetailOptimized';
import NotFound from './pages/NotFound/NotFound';
import './App.css';

/**
 * Million Luxury Application Root Component
 *
 * Configures routing for the entire application.
 * Uses Redux for state management (configured in main.jsx).
 *
 * Routes:
 * - / : Properties list page with filters and pagination
 * - /properties/:id : Property detail page
 * - * : 404 Not Found page
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<PropertiesListRedux />} />
          <Route path="properties/:id" element={<PropertyDetailOptimized />} />
          {/* Comodin redireciona al not found */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

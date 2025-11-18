import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import PropertiesListRedux from './pages/PropertiesList/PropertiesListRedux';
import PropertyDetailOptimized from './pages/PropertyDetail/PropertyDetailOptimized';
import NotFound from './pages/NotFound/NotFound';
import './App.css';

// Million Luxury Application Root Component
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<PropertiesListRedux />} />
          {/* Informacion de la propiedad */}
          <Route path="properties/:id" element={<PropertyDetailOptimized />} />
          {/* Comodin redireciona al not found */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import PropertiesList from './pages/PropertiesList/PropertiesList';
import PropertyDetail from './pages/PropertyDetail/PropertyDetail';
import NotFound from './pages/NotFound/NotFound';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<PropertiesList />} />
          <Route path="properties/:id" element={<PropertyDetail />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

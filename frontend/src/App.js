import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SellerDashboard from './pages/SellerDashboard';
import './globals.css';       // resets + variables
import './styles/layout.css'; // scoped layout + component rules

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/seller" element={<SellerDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

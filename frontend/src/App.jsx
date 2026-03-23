import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Marketplace from './pages/Marketplace';
import BusinessDetail from './pages/BusinessDetail';
import Dashboard from './pages/Dashboard';
import Buyers from './pages/Buyers';
import SellerPricing from './pages/SellerPricing';
import BuyerPricing from './pages/BuyerPricing';
import Valuation from './pages/Valuation';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen font-sans bg-background text-oxford">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/business/:slug" element={<BusinessDetail />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/buyers" element={<Buyers />} />
            <Route path="/pricing/sellers" element={<SellerPricing />} />
            <Route path="/pricing/buyers" element={<BuyerPricing />} />
            <Route path="/valuation" element={<Valuation />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

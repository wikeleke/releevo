import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useLayoutEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Onboarding from './pages/Onboarding';
import Marketplace from './pages/Marketplace';
import BusinessDetail from './pages/BusinessDetail';
import Dashboard from './pages/Dashboard';
import Buyers from './pages/Buyers';
import SellerPricing from './pages/SellerPricing';
import BuyerPricing from './pages/BuyerPricing';
import Valuation from './pages/Valuation';
import CreateListing from './pages/CreateListing';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import BuyerLists from './pages/BuyerLists';
import Inbox from './pages/Inbox';
import { setClerkGetToken } from './services/api';

function HomeOrDashboard() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) return <Home />;
  if (isSignedIn) return <Navigate to="/dashboard" replace />;
  return <Home />;
}

function App() {
  const { getToken } = useAuth();

  // Wire Clerk's getToken into the Axios interceptor so every API call is authenticated
  useLayoutEffect(() => {
    // Remove legacy JWT leftover from old auth implementation.
    localStorage.removeItem('token');
    setClerkGetToken(getToken);
  }, [getToken]);
  return (
    <Router>
      <div className="flex flex-col min-h-screen font-sans bg-background text-oxford">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomeOrDashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/business/:slug" element={<BusinessDetail />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/lists" element={<BuyerLists />} />
            <Route path="/dashboard/lists/:listId" element={<BuyerLists />} />
            <Route path="/inbox" element={<Inbox />} />
            <Route path="/inbox/:conversationId" element={<Inbox />} />
            <Route path="/buyers" element={<Buyers />} />
            <Route path="/pricing/sellers" element={<SellerPricing />} />
            <Route path="/pricing/buyers" element={<BuyerPricing />} />
            <Route path="/valuation" element={<Valuation />} />
            <Route path="/create-listing" element={<CreateListing />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

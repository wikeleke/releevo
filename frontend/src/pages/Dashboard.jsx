import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { PlusCircle, Edit, CheckCircle, Clock, Trash2, ShieldCheck, DollarSign } from 'lucide-react';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [businesses, setBusinesses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Form state for new listing
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '', description: '', category: 'Retail', sector: '', giro: '', size: 'Small',
        city: '', state: '', askingPrice: '', annualRevenue: '', annualProfit: '',
        businessName: '', exactAddress: '', contactPhone: '', contactEmail: '', website: ''
    });

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchDashboardBusinesses();
    }, [user, navigate]);

    const fetchDashboardBusinesses = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/business/dashboard');
            setBusinesses(data);
        } catch (err) {
            setError('Failed to fetch dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCreateBusiness = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                title: formData.title,
                description: formData.description,
                category: formData.category,
                sector: formData.sector,
                giro: formData.giro,
                size: formData.size,
                location: { city: formData.city, state: formData.state },
                financials: {
                    askingPrice: Number(formData.askingPrice),
                    annualRevenue: Number(formData.annualRevenue),
                    annualProfit: Number(formData.annualProfit)
                },
                confidentialData: {
                    businessName: formData.businessName,
                    exactAddress: formData.exactAddress,
                    contactPhone: formData.contactPhone,
                    contactEmail: formData.contactEmail,
                    website: formData.website
                }
            };

            await api.post('/business', payload);
            setShowAddForm(false);
            fetchDashboardBusinesses();
            // Reset form
            setFormData({
                title: '', description: '', category: 'Retail', sector: '', giro: '', size: 'Small',
                city: '', state: '', askingPrice: '', annualRevenue: '', annualProfit: '',
                businessName: '', exactAddress: '', contactPhone: '', contactEmail: '', website: ''
            });
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to create business');
        }
    };

    const handlePayListing = async (id) => {
        try {
            await api.put(`/business/${id}/paylisting`);
            fetchDashboardBusinesses();
        } catch (err) {
            alert('Failed to process payment');
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await api.put(`/business/${id}/status`, { status });
            fetchDashboardBusinesses();
        } catch (err) {
            alert('Failed to update status');
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-marine"></div></div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-oxford tracking-tight">Dashboard</h1>
                    <p className="text-gray-500 mt-1">Manage your business listings and account.</p>
                </div>

                {user?.role === 'seller' && (
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="flex items-center px-4 py-2 bg-marine text-white rounded-lg font-bold hover:bg-blue-900 transition-colors shadow-sm"
                    >
                        {showAddForm ? 'Cancel' : <><PlusCircle className="mr-2 h-5 w-5" /> Add New Listing</>}
                    </button>
                )}
            </div>

            {error && <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">{error}</div>}

            {/* Add New Business Form */}
            {showAddForm && user?.role === 'seller' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-10">
                    <h2 className="text-2xl font-bold text-oxford mb-6 border-b border-gray-100 pb-4">Create New Business Listing</h2>
                    <form onSubmit={handleCreateBusiness} className="space-y-8">
                        {/* 1. Public Info */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <span className="bg-marine text-white w-6 h-6 rounded-full inline-flex items-center justify-center text-xs mr-2">1</span>
                                Public Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Posting Title</label>
                                    <input type="text" name="title" required value={formData.title} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-marine focus:border-marine" placeholder="e.g. Profitable Downtown Cafe" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Description</label>
                                    <textarea name="description" required rows="4" value={formData.description} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-marine focus:border-marine" placeholder="Describe the business opportunity..."></textarea>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Category</label>
                                    <select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-marine">
                                        <option value="Retail">Retail</option>
                                        <option value="Food & Beverage">Food & Beverage</option>
                                        <option value="Technology">Technology</option>
                                        <option value="Services">Services</option>
                                        <option value="Manufacturing">Manufacturing</option>
                                        <option value="Healthcare">Healthcare</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Business Size</label>
                                    <select name="size" value={formData.size} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-marine">
                                        <option value="Small">Small (1-10 employees)</option>
                                        <option value="Medium">Medium (11-50 employees)</option>
                                        <option value="Large">Large (50+ employees)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Sector / Industry</label>
                                    <input type="text" name="sector" value={formData.sector} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-marine" placeholder="e.g. Specialty Coffee" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Giro (Local Classification)</label>
                                    <input type="text" name="giro" value={formData.giro} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-marine" placeholder="e.g. Restaurante-Bar" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">City</label>
                                    <input type="text" name="city" required value={formData.city} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-marine" placeholder="City" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">State</label>
                                    <input type="text" name="state" required value={formData.state} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-marine" placeholder="State / Province" />
                                </div>
                            </div>
                        </div>

                        {/* 2. Financials */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <span className="bg-marine text-white w-6 h-6 rounded-full inline-flex items-center justify-center text-xs mr-2">2</span>
                                Financial Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-gray-50 rounded-xl border border-gray-100">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Asking Price ($)</label>
                                    <input type="number" name="askingPrice" required value={formData.askingPrice} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-marine" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Annual Revenue ($)</label>
                                    <input type="number" name="annualRevenue" required value={formData.annualRevenue} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-marine" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Cash Flow/Profit ($)</label>
                                    <input type="number" name="annualProfit" required value={formData.annualProfit} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-marine" />
                                </div>
                            </div>
                        </div>

                        {/* 3. Confidential Data */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <span className="bg-marine text-white w-6 h-6 rounded-full inline-flex items-center justify-center text-xs mr-2">3</span>
                                Confidential Data <ShieldCheck className="w-5 h-5 text-green-500 ml-2" />
                            </h3>
                            <p className="text-sm text-gray-500 mb-4">This information is strictly hidden from regular users and only visible to Premium buyers.</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-blue-50/50 rounded-xl border border-blue-100">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Actual Business Legal Name</label>
                                    <input type="text" name="businessName" required value={formData.businessName} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-marine" placeholder="e.g. Acme Food Corp LLC" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Exact Street Address</label>
                                    <input type="text" name="exactAddress" required value={formData.exactAddress} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-marine" placeholder="123 Main St, Suite 100" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Contact Phone</label>
                                    <input type="tel" name="contactPhone" required value={formData.contactPhone} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-marine" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Contact Email</label>
                                    <input type="email" name="contactEmail" required value={formData.contactEmail} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-marine" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Website URL (Optional)</label>
                                    <input type="url" name="website" value={formData.website} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-marine" placeholder="https://..." />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100 flex justify-end gap-4">
                            <button type="button" onClick={() => setShowAddForm(false)} className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-bold hover:bg-gray-50 transition-colors">
                                Cancel
                            </button>
                            <button type="submit" className="px-8 py-3 bg-marine text-white rounded-lg font-bold hover:bg-blue-900 shadow-md transition-colors">
                                Submit Listing
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Existing Listings */}
            <h2 className="text-2xl font-bold text-oxford mb-6">{user?.role === 'admin' ? 'All Platform Listings' : 'My Listings'}</h2>

            {businesses.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-gray-300">
                    <p className="text-gray-500 text-lg">You don't have any business listings yet.</p>
                </div>
            ) : (
                <div className="overflow-hidden bg-white shadow-sm rounded-2xl border border-gray-200">
                    <ul className="divide-y divide-gray-200">
                        {businesses.map((biz) => (
                            <li key={biz._id} className="p-6 hover:bg-gray-50 transition-colors">
                                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                                    {/* Info */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h4 className="text-lg font-bold text-gray-900">{biz.title}</h4>
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${biz.status === 'published' ? 'bg-green-100 text-green-800' :
                                                    biz.status === 'sold' ? 'bg-gray-100 text-gray-800' : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {biz.status}
                                            </span>
                                            {biz.isListingPaid && (
                                                <span className="flex items-center text-xs font-bold text-green-600 bg-green-50 px-2.5 py-0.5 rounded-full border border-green-200">
                                                    <DollarSign className="w-3 h-3 mr-1" /> Fee Paid
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-sm text-gray-500 mb-2">
                                            ${biz.financials?.askingPrice?.toLocaleString()} • {biz.location?.city}, {biz.location?.state}
                                        </div>
                                        {user?.role === 'admin' && (
                                            <div className="text-xs text-gray-400">
                                                Seller ID: {biz.sellerId}
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-wrap items-center gap-3">
                                        {user?.role === 'seller' && !biz.isListingPaid && biz.status === 'pending' && (
                                            <button
                                                onClick={() => handlePayListing(biz._id)}
                                                className="flex items-center px-4 py-2 bg-green-600 text-white text-sm font-bold rounded-lg hover:bg-green-700 transition"
                                            >
                                                <DollarSign className="w-4 h-4 mr-1" /> Pay Listing Fee
                                            </button>
                                        )}

                                        {user?.role === 'admin' && biz.status === 'pending' && (
                                            <button
                                                onClick={() => handleUpdateStatus(biz._id, 'published')}
                                                className="flex items-center px-4 py-2 bg-green-600 text-white text-sm font-bold rounded-lg hover:bg-green-700 transition"
                                            >
                                                <CheckCircle className="w-4 h-4 mr-1" /> Approve & Publish
                                            </button>
                                        )}

                                        {user?.role === 'admin' && biz.status === 'published' && (
                                            <button
                                                onClick={() => handleUpdateStatus(biz._id, 'sold')}
                                                className="flex items-center px-4 py-2 bg-gray-600 text-white text-sm font-bold rounded-lg hover:bg-gray-700 transition"
                                            >
                                                <CheckCircle className="w-4 h-4 mr-1" /> Mark as Sold
                                            </button>
                                        )}

                                        <button
                                            onClick={() => navigate(`/business/${biz.slug}`)}
                                            className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-100 transition"
                                        >
                                            View Live
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Dashboard;

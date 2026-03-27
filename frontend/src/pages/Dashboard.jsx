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
                        onClick={() => navigate('/create-listing')}
                        className="flex items-center px-4 py-2 bg-marine text-white rounded-lg font-bold hover:bg-blue-900 transition-colors shadow-sm"
                    >
                        <PlusCircle className="mr-2 h-5 w-5" /> Add New Listing
                    </button>
                )}
            </div>

            {error && <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">{error}</div>}


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

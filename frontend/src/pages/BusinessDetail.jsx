import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useUser } from '@clerk/clerk-react';
import PaywallModal from '../components/PaywallModal';
import { MapPin, Briefcase, TrendingUp, DollarSign, Lock, Mail, Phone, Globe, ChevronLeft } from 'lucide-react';

const BusinessDetail = () => {
    const { slug } = useParams();
    const { user } = useUser();
    const [business, setBusiness] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showPaywall, setShowPaywall] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBusiness = async () => {
            try {
                const { data } = await api.get(`/business/${slug}`);
                setBusiness(data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load business details');
            } finally {
                setLoading(false);
            }
        };
        fetchBusiness();
    }, [slug, user?.isPremium]);

    if (loading) return <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-marine text-marine"></div></div>;
    if (error) return <div className="text-center mt-20 text-red-600 font-medium">{error}</div>;
    if (!business) return <div className="text-center mt-20 font-medium text-gray-500">Business not found.</div>;

    const canViewConfidential = Boolean(business?.canViewConfidential || user?.isPremium);
    const isOwner = user?._id === business.sellerId?._id; // optional check

    return (
        <div className="bg-background min-h-[calc(100vh-4rem)] pb-12">
            {/* Header Banner */}
            <div className="bg-marine text-white pt-12 pb-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">
                    <Link to="/marketplace" className="inline-flex items-center text-blue-200 hover:text-white mb-6 font-medium transition-colors">
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Back to Marketplace
                    </Link>
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className="bg-blue-800/80 text-blue-100 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                            {business.category}
                        </span>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm ${business.status === 'sold' ? 'bg-red-500 text-white' : business.status === 'published' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'}`}>
                            {business.status}
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
                        {canViewConfidential && business.confidentialData?.businessName ? business.confidentialData.businessName : business.title}
                    </h1>
                    <div className="flex flex-wrap gap-6 text-blue-100 font-medium mt-6">
                        <div className="flex items-center">
                            <MapPin className="h-5 w-5 mr-2 opacity-80" />
                            {business.location?.city}, {business.location?.state}
                        </div>
                        <div className="flex items-center">
                            <Briefcase className="h-5 w-5 mr-2 opacity-80" />
                            {business.sector} • {business.size}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                            <h2 className="text-2xl font-bold text-oxford mb-5 tracking-tight">Business Overview</h2>
                            <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">{business.description}</p>
                        </div>

                        {/* Confidential Data Section */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden relative">
                            <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/80">
                                <h2 className="text-xl font-bold text-oxford flex items-center tracking-tight">
                                    <Lock className={`h-5 w-5 mr-3 ${canViewConfidential ? 'text-green-500' : 'text-yellow-500'}`} />
                                    Confidential Details
                                </h2>
                                {!canViewConfidential && (
                                    <button
                                        onClick={() => setShowPaywall(true)}
                                        className="text-sm font-bold bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg hover:bg-yellow-200 transition-colors shadow-sm"
                                    >
                                        Unlock
                                    </button>
                                )}
                            </div>

                            <div className="p-8">
                                {canViewConfidential && business.confidentialData ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                        <div>
                                            <div className="text-sm text-gray-500 mb-1.5 font-medium flex items-center"><Briefcase className="h-4 w-4 mr-2" /> Legal Name</div>
                                            <div className="font-bold text-gray-900 text-lg">{business.confidentialData.businessName}</div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-500 mb-1.5 font-medium flex items-center"><MapPin className="h-4 w-4 mr-2" /> Exact Address</div>
                                            <div className="font-bold text-gray-900 text-lg">{business.confidentialData.exactAddress}</div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-500 mb-1.5 font-medium flex items-center"><Phone className="h-4 w-4 mr-2" /> Phone Number</div>
                                            <div className="font-bold text-gray-900 text-lg">{business.confidentialData.contactPhone}</div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-500 mb-1.5 font-medium flex items-center"><Mail className="h-4 w-4 mr-2" /> Contact Email</div>
                                            <div className="font-bold text-marine hover:underline cursor-pointer text-lg">{business.confidentialData.contactEmail}</div>
                                        </div>
                                        {business.confidentialData.website && (
                                            <div className="sm:col-span-2 border-t border-gray-100 pt-6 mt-2">
                                                <div className="text-sm text-gray-500 mb-1.5 font-medium flex items-center"><Globe className="h-4 w-4 mr-2" /> Official Website</div>
                                                <a href={business.confidentialData.website} target="_blank" rel="noopener noreferrer" className="font-bold text-marine hover:underline text-lg">
                                                    {business.confidentialData.website}
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="relative border border-gray-100 rounded-xl overflow-hidden bg-white">
                                        <div className="filter blur-[6px] opacity-40 p-6 pointer-events-none select-none">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                                <div>
                                                    <div className="text-sm text-gray-500 mb-1.5 font-medium flex items-center"><Briefcase className="h-4 w-4 mr-2" /> Legal Name</div>
                                                    <div className="font-bold text-gray-900 text-lg">Acme Corporation Inc.</div>
                                                </div>
                                                <div>
                                                    <div className="text-sm text-gray-500 mb-1.5 font-medium flex items-center"><MapPin className="h-4 w-4 mr-2" /> Exact Address</div>
                                                    <div className="font-bold text-gray-900 text-lg">123 Business Avenue, Suite 100, City</div>
                                                </div>
                                                <div>
                                                    <div className="text-sm text-gray-500 mb-1.5 font-medium flex items-center"><Phone className="h-4 w-4 mr-2" /> Phone Number</div>
                                                    <div className="font-bold text-gray-900 text-lg">+1 (555) 123-4567</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-white/50 backdrop-blur-[2px]">
                                            <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 text-center max-w-sm w-full mx-4">
                                                <Lock className="h-10 w-10 text-gray-400 mx-auto mb-4" />
                                                <h3 className="text-lg font-bold text-oxford mb-2 tracking-tight">Premium Details Locked</h3>
                                                <p className="text-gray-500 text-sm mb-6">Upgrade to Premium to view confidential contacts, exact addresses, and verified legal names.</p>
                                                <button
                                                    onClick={() => setShowPaywall(true)}
                                                    className="w-full bg-marine text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-900 shadow-md transition-all active:scale-95"
                                                >
                                                    Unlock Information
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar / Financials */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-24">
                            <h3 className="text-xl font-bold text-oxford border-b border-gray-100 pb-4 mb-5 tracking-tight">Financial Overview</h3>
                            <div className="space-y-6">
                                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                    <div className="text-gray-500 text-sm mb-1 font-medium">Asking Price</div>
                                    <div className="text-3xl font-extrabold text-marine tracking-tight">
                                        ${business.financials?.askingPrice?.toLocaleString()}
                                    </div>
                                </div>
                                <div className="px-2">
                                    <div className="text-gray-500 text-sm mb-1 font-medium">Gross Revenue (Annual)</div>
                                    <div className="text-xl font-bold text-gray-900 flex items-center tracking-tight">
                                        <TrendingUp className="h-5 w-5 text-gray-400 mr-2" />
                                        ${business.financials?.annualRevenue?.toLocaleString()}
                                    </div>
                                </div>
                                <div className="px-2">
                                    <div className="text-gray-500 text-sm mb-1 font-medium">Cash Flow / Profit</div>
                                    <div className="text-xl font-bold text-gray-900 flex items-center tracking-tight">
                                        <DollarSign className="h-5 w-5 text-gray-400 mr-2" />
                                        ${business.financials?.annualProfit?.toLocaleString()}
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    if (!canViewConfidential) setShowPaywall(true);
                                    else alert("Contacting seller functionality would open here.");
                                }}
                                className={`w-full mt-8 py-4 rounded-xl font-bold shadow-md transition-all flex justify-center items-center ${business.status === 'sold' ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none' : 'bg-marine text-white hover:bg-blue-900 active:scale-95'}`}
                                disabled={business.status === 'sold'}
                            >
                                {business.status === 'sold' ? 'Listing Sold' : (
                                    <>
                                        <Mail className="h-5 w-5 mr-2" />
                                        Contact Seller
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {showPaywall && <PaywallModal onClose={() => setShowPaywall(false)} />}
        </div>
    );
};

export default BusinessDetail;

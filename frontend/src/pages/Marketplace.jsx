import React, { useState, useEffect } from 'react';
import api from '../services/api';
import BusinessCard from '../components/BusinessCard';
import FilterSidebar from '../components/FilterSidebar';
import { Loader2, SearchX } from 'lucide-react';

const Marketplace = () => {
    const [businesses, setBusinesses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        city: '',
        sector: '',
        minPrice: '',
        maxPrice: ''
    });

    const fetchBusinesses = async (activeFilters = filters) => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams();
            Object.entries(activeFilters).forEach(([key, value]) => {
                if (value) queryParams.append(key, value);
            });

            const { data } = await api.get(`/business?${queryParams.toString()}`);
            setBusinesses(data);
        } catch (err) {
            console.error('Failed to fetch businesses');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBusinesses();
    }, []);

    const handleApplyFilters = () => {
        fetchBusinesses(filters);
    };

    const clearFilters = () => {
        const emptyFilters = { city: '', sector: '', minPrice: '', maxPrice: '' };
        setFilters(emptyFilters);
        fetchBusinesses(emptyFilters);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="mb-8">
                <h1 className="text-4xl font-extrabold text-oxford tracking-tight">Marketplace</h1>
                <p className="text-gray-500 mt-2 text-lg">Find the right business for your next venture.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Sidebar */}
                <div className="w-full md:w-1/4 flex-shrink-0">
                    <FilterSidebar
                        filters={filters}
                        setFilters={setFilters}
                        applyFilters={handleApplyFilters}
                    />
                </div>

                {/* Listings grid */}
                <div className="w-full md:w-3/4">
                    {loading ? (
                        <div className="flex justify-center items-center h-64 bg-white rounded-2xl border border-gray-100 shadow-sm">
                            <Loader2 className="h-10 w-10 text-marine animate-spin" />
                        </div>
                    ) : businesses.length > 0 ? (
                        <>
                            <div className="mb-6 text-sm font-medium text-gray-500">
                                Found {businesses.length} {businesses.length === 1 ? 'business' : 'businesses'}
                            </div>
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                {businesses.map(biz => (
                                    <BusinessCard key={biz._id || biz.slug} business={biz} />
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="text-center bg-white p-16 rounded-2xl border border-gray-200 shadow-sm">
                            <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                <SearchX className="h-8 w-8 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No businesses found</h3>
                            <p className="text-gray-500 max-w-sm mx-auto">We couldn't find any listings matching your current criteria. Try adjusting your filters.</p>
                            <button
                                onClick={clearFilters}
                                className="mt-6 inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-marine"
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Marketplace;

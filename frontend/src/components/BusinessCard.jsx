import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Briefcase, TrendingUp } from 'lucide-react';

const BusinessCard = ({ business }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-marine mb-2 truncate" title={business.title}>
                        {business.title}
                    </h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {business.category}
                    </span>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3 h-14">
                    {business.description}
                </p>

                <div className="space-y-2 mb-6">
                    <div className="flex items-center text-sm text-gray-500 truncate">
                        <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                        {business.location?.city}, {business.location?.state}
                    </div>
                    <div className="flex items-center text-sm text-gray-500 truncate">
                        <Briefcase className="h-4 w-4 mr-2 flex-shrink-0" />
                        {business.sector} • {business.size}
                    </div>
                    <div className="flex items-center text-sm font-semibold text-green-600 truncate">
                        <TrendingUp className="h-4 w-4 mr-2 flex-shrink-0" />
                        Asking: ${business.financials?.askingPrice?.toLocaleString()}
                    </div>
                </div>

                <Link
                    to={`/business/${business.slug}`}
                    className="block w-full text-center bg-gray-50 text-marine border border-gray-200 hover:bg-gray-100 font-medium py-2 px-4 rounded-lg transition-colors"
                >
                    View Details
                </Link>
            </div>
        </div>
    );
};

export default BusinessCard;

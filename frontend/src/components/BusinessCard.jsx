import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Briefcase, TrendingUp, ListPlus } from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';
import AddToListModal from './AddToListModal';

const categoryLabel = (category) => {
    const value = String(category || '').toLowerCase();
    if (value === 'retail') return 'Comercio minorista';
    if (value === 'food & beverage') return 'Alimentos y bebidas';
    if (value === 'services') return 'Servicios';
    if (value === 'technology') return 'Tecnologia';
    if (value === 'manufacturing') return 'Manufactura';
    if (value === 'healthcare') return 'Salud';
    if (value === 'real estate') return 'Bienes raices';
    return category;
};

const BusinessCard = ({ business }) => {
    const { isSignedIn } = useAuth();
    const navigate = useNavigate();
    const [listModalOpen, setListModalOpen] = useState(false);
    const canSave = Boolean(business?._id);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className="min-w-0 flex-1 pr-2">
                        <h3 className="text-xl font-semibold text-marine truncate" title={business.title}>
                            {business.title}
                        </h3>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {categoryLabel(business.category)}
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
                        Precio solicitado: ${business.financials?.askingPrice?.toLocaleString()}
                    </div>
                </div>

                <div className="flex gap-2 items-stretch">
                    {canSave ? (
                        <button
                            type="button"
                            title={isSignedIn ? 'Agregar a una lista' : 'Inicia sesión para guardar en listas'}
                            onClick={() => (isSignedIn ? setListModalOpen(true) : navigate('/signup'))}
                            className="shrink-0 flex items-center justify-center w-11 rounded-lg border border-gray-200 bg-white text-marine hover:bg-gray-50 hover:border-marine/40 transition-colors"
                        >
                            <ListPlus className="w-5 h-5" strokeWidth={2.2} />
                        </button>
                    ) : null}
                    <Link
                        to={`/business/${business.slug}`}
                        className="flex-1 text-center bg-gray-50 text-marine border border-gray-200 hover:bg-gray-100 font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                    >
                        Ver detalles
                    </Link>
                </div>
            </div>
            {listModalOpen && (
                <AddToListModal
                    businessId={business._id}
                    onClose={() => setListModalOpen(false)}
                />
            )}
        </div>
    );
};

export default BusinessCard;

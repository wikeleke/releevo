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
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
            <div className="p-6">
                <div className="mb-4 flex items-start justify-between">
                    <div className="min-w-0 flex-1 pr-2">
                        <h3 className="truncate text-xl font-semibold text-marine" title={business.title}>
                            {business.title}
                        </h3>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                        {categoryLabel(business.category)}
                    </span>
                </div>

                <p className="mb-4 line-clamp-3 h-14 text-sm text-gray-600">
                    {business.description}
                </p>

                <div className="mb-6 space-y-2">
                    <div className="flex items-center truncate text-sm text-gray-500">
                        <MapPin className="mr-2 h-4 w-4 flex-shrink-0" />
                        {business.location?.city}, {business.location?.state}
                    </div>
                    <div className="flex items-center truncate text-sm text-gray-500">
                        <Briefcase className="mr-2 h-4 w-4 flex-shrink-0" />
                        {business.sector} • {business.size}
                    </div>
                    <div className="flex items-center truncate text-sm font-semibold text-green-600">
                        <TrendingUp className="mr-2 h-4 w-4 flex-shrink-0" />
                        Precio solicitado: ${business.financials?.askingPrice?.toLocaleString()}
                    </div>
                </div>

                <div className="flex items-stretch gap-2">
                    {canSave ? (
                        <button
                            type="button"
                            title={isSignedIn ? 'Agregar a una lista' : 'Inicia sesión para guardar en listas'}
                            onClick={() => (isSignedIn ? setListModalOpen(true) : navigate('/signup'))}
                            className="flex w-11 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-marine transition-colors hover:border-marine/40 hover:bg-gray-50"
                        >
                            <ListPlus className="h-5 w-5" strokeWidth={2.2} />
                        </button>
                    ) : null}
                    <Link
                        to={`/business/${business.slug}`}
                        className="flex flex-1 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-center font-medium text-marine transition-colors hover:bg-gray-100"
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

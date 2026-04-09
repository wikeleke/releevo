import React, { useState, useEffect } from 'react';
import api from '../services/api';
import BusinessCard from '../components/BusinessCard';
import FilterSidebar from '../components/FilterSidebar';
import { Loader2, SearchX } from 'lucide-react';

const Marketplace = () => {
    const [businesses, setBusinesses] = useState([]);
    const [cities, setCities] = useState([]);
    const [citiesLoading, setCitiesLoading] = useState(true);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);
    const [filters, setFilters] = useState({
        city: '',
        sector: '',
        minPrice: '',
        maxPrice: ''
    });

    const hasActiveFilters = () => {
        const { city, sector, minPrice, maxPrice } = filters;
        return (
            Boolean(String(city || '').trim()) ||
            Boolean(String(sector || '').trim()) ||
            minPrice !== '' && minPrice != null ||
            maxPrice !== '' && maxPrice != null
        );
    };

    const fetchBusinesses = async (activeFilters = filters) => {
        setLoading(true);
        setFetchError(null);
        try {
            const queryParams = new URLSearchParams();
            Object.entries(activeFilters).forEach(([key, value]) => {
                if (value !== '' && value != null) queryParams.append(key, value);
            });

            const qs = queryParams.toString();
            const { data } = await api.get(qs ? `/business?${qs}` : '/business');
            const list = Array.isArray(data) ? data : [];
            setBusinesses(list);
        } catch (err) {
            console.error('No se pudieron cargar los negocios', err);
            setFetchError(
                err?.response?.data?.message ||
                    err?.message ||
                    'No se pudo conectar con el servidor. Comprueba que el backend esté en marcha.'
            );
            setBusinesses([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBusinesses();
    }, []);

    useEffect(() => {
        const loadCities = async () => {
            setCitiesLoading(true);
            try {
                const { data } = await api.get('/business/cities');
                setCities(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error('No se pudieron cargar las ciudades', err);
                setCities([]);
            } finally {
                setCitiesLoading(false);
            }
        };
        loadCities();
    }, []);

    useEffect(() => {
        if (citiesLoading) return;
        setFilters((prev) => {
            if (!prev.city) return prev;
            if (cities.includes(prev.city)) return prev;
            return { ...prev, city: '' };
        });
    }, [cities, citiesLoading]);

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
                <h1 className="text-3xl font-semibold tracking-tight text-oxford md:text-4xl">Mercado</h1>
                <p className="mt-2 text-base text-dark-500 md:text-lg">Encuentra el negocio ideal para tu próxima inversión.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Sidebar */}
                <div className="w-full md:w-1/4 flex-shrink-0">
                    <FilterSidebar
                        filters={filters}
                        setFilters={setFilters}
                        applyFilters={handleApplyFilters}
                        cities={cities}
                        citiesLoading={citiesLoading}
                    />
                </div>

                {/* Listings grid */}
                <div className="w-full md:w-3/4">
                    {loading ? (
                        <div className="flex h-64 items-center justify-center pd-card">
                            <Loader2 className="h-9 w-9 animate-spin text-brand-900" />
                        </div>
                    ) : fetchError ? (
                        <div className="pd-card p-12 text-center md:p-16">
                            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-light-100">
                                <SearchX className="h-7 w-7 text-dark-300" />
                            </div>
                            <h3 className="mb-2 text-lg font-semibold text-oxford">No se pudieron cargar los listados</h3>
                            <p className="mx-auto max-w-md text-[15px] text-dark-500">{fetchError}</p>
                            <button
                                type="button"
                                onClick={() => fetchBusinesses()}
                                className="pd-btn-primary mt-6 px-5"
                            >
                                Reintentar
                            </button>
                        </div>
                    ) : businesses.length > 0 ? (
                        <>
                            <div className="mb-6 text-sm font-medium text-dark-500">
                                Se encontraron {businesses.length} {businesses.length === 1 ? 'negocio' : 'negocios'}
                            </div>
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                {businesses.map(biz => (
                                    <BusinessCard key={biz._id || biz.slug} business={biz} />
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="pd-card p-12 text-center md:p-16">
                            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-light-100">
                                <SearchX className="h-7 w-7 text-dark-300" />
                            </div>
                            <h3 className="mb-2 text-lg font-semibold text-oxford">No se encontraron negocios</h3>
                            {hasActiveFilters() ? (
                                <p className="mx-auto max-w-sm text-[15px] text-dark-500">
                                    No hay listados que coincidan con los filtros. Prueba ampliar criterios o limpiarlos.
                                </p>
                            ) : (
                                <p className="mx-auto max-w-md text-[15px] text-dark-500">
                                    En el mercado solo se muestran anuncios publicados (aprobados y con publicación activa). Si
                                    acabas de crear un listado, puede seguir en revisión o pendiente de activación.
                                </p>
                            )}
                            {hasActiveFilters() && (
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="pd-btn-secondary mt-6 px-5"
                                >
                                    Limpiar todos los filtros
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Marketplace;

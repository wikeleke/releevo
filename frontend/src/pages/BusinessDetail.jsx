import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import PaywallModal from '../components/PaywallModal';
import { MapPin, Briefcase, TrendingUp, DollarSign, Lock, Mail, Phone, Globe, ChevronLeft } from 'lucide-react';

const BusinessDetail = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [business, setBusiness] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showPaywall, setShowPaywall] = useState(false);
    const [error, setError] = useState(null);
    const [contactLoading, setContactLoading] = useState(false);

    useEffect(() => {
        const fetchBusiness = async () => {
            try {
                const { data } = await api.get(`/business/${slug}`);
                setBusiness(data);
            } catch (err) {
                setError(err.response?.data?.message || 'No se pudieron cargar los detalles del negocio');
            } finally {
                setLoading(false);
            }
        };
        fetchBusiness();
    }, [slug]);

    if (loading) return <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-marine text-marine"></div></div>;
    if (error) return <div className="text-center mt-20 text-red-600 font-medium">{error}</div>;
    if (!business) return <div className="text-center mt-20 font-medium text-gray-500">Negocio no encontrado.</div>;

    const canViewConfidential = Boolean(business?.canViewConfidential);
    const confidentialData = business?.confidentialData || {};
    const hasConfidentialData = Boolean(
        confidentialData.businessName ||
        confidentialData.exactAddress ||
        confidentialData.contactPhone ||
        confidentialData.contactEmail ||
        confidentialData.website
    );

    const handleContactSeller = async () => {
        if (!canViewConfidential) {
            setShowPaywall(true);
            return;
        }
        if (!business._id) return;
        setContactLoading(true);
        try {
            const { data } = await api.post('/messages/conversations', { businessId: business._id });
            navigate(`/inbox/${data._id}`);
        } catch (err) {
            alert(err?.response?.data?.message || 'No se pudo abrir la conversación');
        } finally {
            setContactLoading(false);
        }
    };

    return (
        <div className="bg-background min-h-[calc(100vh-4rem)] pb-12">
            {/* Header Banner */}
            <div className="bg-marine text-white pt-12 pb-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">
                    <Link to="/marketplace" className="inline-flex items-center text-blue-200 hover:text-white mb-6 font-medium transition-colors">
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Volver al mercado
                    </Link>
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className="bg-blue-800/80 text-blue-100 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                            {business.category}
                        </span>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm ${business.status === 'sold' ? 'bg-red-500 text-white' : business.status === 'published' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'}`}>
                            {business.status}
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-2 leading-tight">
                        {canViewConfidential && confidentialData.businessName ? confidentialData.businessName : business.title}
                    </h1>
                    {business.isTitleMasked ? (
                        <p className="text-blue-100/90 text-sm max-w-2xl">
                            Vista pública: solo giro y ubicación. El nombre del negocio y los datos completos requieren membresía de comprador.
                        </p>
                    ) : null}
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
                            <h2 className="text-2xl font-bold text-oxford mb-5 tracking-tight">Resumen del negocio</h2>
                            <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">{business.description}</p>
                        </div>

                        {/* Confidential Data Section */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden relative">
                            <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/80">
                                <h2 className="text-xl font-bold text-oxford flex items-center tracking-tight">
                                    <Lock className={`h-5 w-5 mr-3 ${canViewConfidential ? 'text-green-500' : 'text-yellow-500'}`} />
                                    Detalles confidenciales
                                </h2>
                                {!canViewConfidential && (
                                    <button
                                        onClick={() => setShowPaywall(true)}
                                        className="text-sm font-bold bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg hover:bg-yellow-200 transition-colors shadow-sm"
                                    >
                                        Desbloquear
                                    </button>
                                )}
                            </div>

                            <div className="p-8">
                                {canViewConfidential ? (
                                    hasConfidentialData ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                            <div>
                                                <div className="text-sm text-gray-500 mb-1.5 font-medium flex items-center"><Briefcase className="h-4 w-4 mr-2" /> Nombre legal</div>
                                                <div className="font-bold text-gray-900 text-lg">{confidentialData.businessName || 'No proporcionado'}</div>
                                            </div>
                                            <div>
                                                <div className="text-sm text-gray-500 mb-1.5 font-medium flex items-center"><MapPin className="h-4 w-4 mr-2" /> Direccion exacta</div>
                                                <div className="font-bold text-gray-900 text-lg">{confidentialData.exactAddress || 'No proporcionado'}</div>
                                            </div>
                                            <div>
                                                <div className="text-sm text-gray-500 mb-1.5 font-medium flex items-center"><Phone className="h-4 w-4 mr-2" /> Telefono</div>
                                                <div className="font-bold text-gray-900 text-lg">{confidentialData.contactPhone || 'No proporcionado'}</div>
                                            </div>
                                            <div>
                                                <div className="text-sm text-gray-500 mb-1.5 font-medium flex items-center"><Mail className="h-4 w-4 mr-2" /> Correo de contacto</div>
                                                <div className="font-bold text-marine text-lg">{confidentialData.contactEmail || 'No proporcionado'}</div>
                                            </div>
                                            {confidentialData.website && (
                                                <div className="sm:col-span-2 border-t border-gray-100 pt-6 mt-2">
                                                    <div className="text-sm text-gray-500 mb-1.5 font-medium flex items-center"><Globe className="h-4 w-4 mr-2" /> Sitio web oficial</div>
                                                    <a href={confidentialData.website} target="_blank" rel="noopener noreferrer" className="font-bold text-marine hover:underline text-lg">
                                                        {confidentialData.website}
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="rounded-xl border border-blue-100 bg-blue-50 p-6 text-blue-900">
                                            Este listado aun no tiene detalles confidenciales cargados.
                                        </div>
                                    )
                                ) : (
                                    <div className="relative border border-gray-100 rounded-xl overflow-hidden bg-white">
                                        <div className="filter blur-[6px] opacity-40 p-6 pointer-events-none select-none">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                                <div>
                                                    <div className="text-sm text-gray-500 mb-1.5 font-medium flex items-center"><Briefcase className="h-4 w-4 mr-2" /> Nombre legal</div>
                                                    <div className="font-bold text-gray-900 text-lg">Acme Corporation Inc.</div>
                                                </div>
                                                <div>
                                                    <div className="text-sm text-gray-500 mb-1.5 font-medium flex items-center"><MapPin className="h-4 w-4 mr-2" /> Direccion exacta</div>
                                                    <div className="font-bold text-gray-900 text-lg">Avenida Empresarial 123, Suite 100, Ciudad</div>
                                                </div>
                                                <div>
                                                    <div className="text-sm text-gray-500 mb-1.5 font-medium flex items-center"><Phone className="h-4 w-4 mr-2" /> Telefono</div>
                                                    <div className="font-bold text-gray-900 text-lg">+1 (555) 123-4567</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-white/50 backdrop-blur-[2px]">
                                            <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 text-center max-w-sm w-full mx-4">
                                                <Lock className="h-10 w-10 text-gray-400 mx-auto mb-4" />
                                                <h3 className="text-lg font-bold text-oxford mb-2 tracking-tight">Detalles premium bloqueados</h3>
                                                <p className="text-gray-500 text-sm mb-6">Sube al plan avanzado para ver contactos confidenciales, direcciones exactas y nombres legales verificados.</p>
                                                <button
                                                    onClick={() => setShowPaywall(true)}
                                                    className="w-full bg-marine text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-900 shadow-md transition-all active:scale-95"
                                                >
                                                    Desbloquear informacion
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
                            <h3 className="text-xl font-bold text-oxford border-b border-gray-100 pb-4 mb-5 tracking-tight">Resumen financiero</h3>
                            <div className="space-y-6">
                                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                    <div className="text-gray-500 text-sm mb-1 font-medium">Precio solicitado</div>
                                    <div className="text-3xl font-extrabold text-marine tracking-tight">
                                        ${business.financials?.askingPrice?.toLocaleString()}
                                    </div>
                                </div>
                                <div className="px-2">
                                    <div className="text-gray-500 text-sm mb-1 font-medium">Ingresos brutos (anual)</div>
                                    <div className="text-xl font-bold text-gray-900 flex items-center tracking-tight">
                                        <TrendingUp className="h-5 w-5 text-gray-400 mr-2" />
                                        ${business.financials?.annualRevenue?.toLocaleString()}
                                    </div>
                                </div>
                                <div className="px-2">
                                    <div className="text-gray-500 text-sm mb-1 font-medium">Flujo de caja / utilidad</div>
                                    <div className="text-xl font-bold text-gray-900 flex items-center tracking-tight">
                                        <DollarSign className="h-5 w-5 text-gray-400 mr-2" />
                                        ${business.financials?.annualProfit?.toLocaleString()}
                                    </div>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={handleContactSeller}
                                className={`w-full mt-8 py-4 rounded-xl font-bold shadow-md transition-all flex justify-center items-center ${business.status === 'sold' ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none' : 'bg-marine text-white hover:bg-blue-900 active:scale-95'}`}
                                disabled={business.status === 'sold' || contactLoading}
                            >
                                {business.status === 'sold' ? 'Listado vendido' : (
                                    <>
                                        <Mail className="h-5 w-5 mr-2" />
                                        {contactLoading ? 'Abriendo…' : 'Contactar vendedor'}
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

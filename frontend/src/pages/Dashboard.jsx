import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth, RedirectToSignIn } from '@clerk/clerk-react';
import { useMessageNotificationsContext } from '../context/MessageNotificationsContext.jsx';
import { PlusCircle, CheckCircle, Trash2, DollarSign, FolderOpen, Mail } from 'lucide-react';

const statusLabel = (status) => {
    const normalized = String(status || '').toLowerCase();
    if (normalized === 'published') return 'publicado';
    if (normalized === 'pending') return 'pendiente';
    if (normalized === 'accepted') return 'aceptado';
    if (normalized === 'sold') return 'vendido';
    if (normalized === 'cancelled') return 'cancelado';
    return status;
};

const Dashboard = () => {
    const { isLoaded, isSignedIn, getToken } = useAuth();
    const navigate = useNavigate();
    const [businesses, setBusinesses] = useState([]);
    const [currentRole, setCurrentRole] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { unreadTotal: unreadMessages } = useMessageNotificationsContext();

    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const fetchDashboardBusinesses = async (options = {}) => {
        const { attempts = 4 } = options;

        try {
            setLoading(true);
            setError(null);

            for (let attempt = 0; attempt < attempts; attempt++) {
                try {
                    const token = await getToken({ skipCache: true });
                    const { data } = await api.get('/business/dashboard', {
                        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
                        // Render cold starts can exceed 15s after inactivity.
                        timeout: 45000,
                    });
                    if (data?.needsRoleOnboarding) {
                        navigate('/onboarding', { replace: true });
                        return;
                    }
                    const roleFromApi = data?.role;
                    const businessesFromApi = Array.isArray(data) ? data : (data?.businesses || []);
                    setCurrentRole(typeof roleFromApi === 'string' ? roleFromApi : '');
                    setBusinesses(businessesFromApi);
                    return;
                } catch (err) {
                    const status = err?.response?.status;
                    const isLastAttempt = attempt === attempts - 1;

                    // Retry transient auth propagation/timeouts after OAuth login.
                    if (!isLastAttempt && (status === 401 || err?.code === 'ECONNABORTED')) {
                        await wait(1200);
                        continue;
                    }
                    throw err;
                }
            }
        } catch (err) {
            const status = err?.response?.status;

            if (status === 403) {
                setError('No tienes permiso para esta acción.');
            } else if (status === 401) {
                setError('No se pudo validar tu sesión. Intenta recargar la página.');
            } else if (err?.code === 'ECONNABORTED') {
                setError('El servidor tardó en responder. Intenta de nuevo en unos segundos.');
            } else {
                setError('No se pudo cargar el panel.');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isLoaded && isSignedIn) {
            fetchDashboardBusinesses();
        } else if (isLoaded && !isSignedIn) {
            setLoading(false);
        }
    }, [isLoaded, isSignedIn]);

    if (!isLoaded || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-marine"></div>
            </div>
        );
    }

    if (!isSignedIn) {
        return <RedirectToSignIn />;
    }



    const handlePayListing = async (id) => {
        try {
            const { data } = await api.post(`/billing/checkout/seller-listing/${id}`);
            if (data?.url) {
                window.location.href = data.url;
                return;
            }
            alert('No se pudo iniciar el pago en Stripe');
        } catch (err) {
            alert(err?.response?.data?.message || 'No se pudo procesar el pago');
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await api.put(`/business/${id}/status`, { status });
            fetchDashboardBusinesses();
        } catch {
            alert('No se pudo actualizar el estado');
        }
    };

    const handleCancelListing = async (id) => {
        try {
            await api.put(`/business/${id}/cancel`);
            fetchDashboardBusinesses();
        } catch (err) {
            alert(err?.response?.data?.message || 'No se pudo cancelar el listado');
        }
    };

    if (currentRole === 'buyer') {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-oxford tracking-tight">Tu cuenta</h1>
                    <p className="text-gray-500 mt-1">
                        Explora el mercado, guarda listas y chatea con vendedores si tienes membresía premium.
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
                    <button
                        type="button"
                        onClick={() => navigate('/dashboard/lists')}
                        className="text-left bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:border-marine/40 hover:shadow-md transition-all"
                    >
                        <FolderOpen className="w-8 h-8 text-marine mb-3" />
                        <h2 className="font-bold text-lg text-oxford">Mis listas</h2>
                        <p className="text-sm text-gray-500 mt-1">Agrupa negocios para revisarlos después.</p>
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/inbox')}
                        className="text-left bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:border-marine/40 hover:shadow-md transition-all"
                    >
                        <Mail className="w-8 h-8 text-marine mb-3" />
                        <h2 className="font-bold text-lg text-oxford flex items-center gap-2">
                            Mensajes
                            {unreadMessages > 0 ? (
                                <span className="text-xs font-bold bg-marine text-white px-2 py-0.5 rounded-full">{unreadMessages}</span>
                            ) : null}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">Solo con membresía premium puedes contactar vendedores.</p>
                    </button>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 p-8 max-w-xl shadow-sm">
                    <p className="text-gray-700 mb-4 font-medium">
                        Descubre negocios en venta en el mercado.
                    </p>
                    <button
                        type="button"
                        onClick={() => navigate('/marketplace')}
                        className="px-5 py-2.5 bg-marine text-white rounded-lg font-bold hover:bg-blue-900 transition-colors"
                    >
                        Ir al marketplace
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/pricing/buyers')}
                        className="ml-3 px-5 py-2.5 border border-gray-300 text-gray-800 rounded-lg font-bold hover:bg-gray-50 transition-colors"
                    >
                        Membresía comprador
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-oxford tracking-tight">
                        {currentRole === 'admin' ? 'Panel de administración' : 'Tus listados'}
                    </h1>
                    <p className="text-gray-500 mt-1">
                        {currentRole === 'admin'
                            ? 'Revisa y gestiona los listados de la plataforma.'
                            : 'Administra los negocios que tienes en venta.'}
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    {(currentRole === 'seller' || currentRole === 'admin') && (
                        <button
                            type="button"
                            onClick={() => navigate('/inbox')}
                            className="flex items-center px-4 py-2 border border-gray-300 text-oxford rounded-lg font-bold hover:bg-gray-50 transition-colors shadow-sm"
                        >
                            <Mail className="mr-2 h-5 w-5 text-marine" />
                            Mensajes
                            {unreadMessages > 0 ? (
                                <span className="ml-2 text-xs bg-marine text-white px-2 py-0.5 rounded-full">{unreadMessages}</span>
                            ) : null}
                        </button>
                    )}
                    {(currentRole === 'seller' || currentRole === 'admin') && (
                        <button
                            type="button"
                            onClick={() => navigate('/create-listing')}
                            className="flex items-center px-4 py-2 bg-marine text-white rounded-lg font-bold hover:bg-blue-900 transition-colors shadow-sm"
                        >
                            <PlusCircle className="mr-2 h-5 w-5" /> Agregar negocio en venta
                        </button>
                    )}
                </div>
            </div>

            {error && <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">{error}</div>}


            {/* Existing Listings */}
            <h2 className="text-2xl font-bold text-oxford mb-6">{currentRole === 'admin' ? 'Todos los listados de la plataforma' : 'Negocios que listaste'}</h2>

            {businesses.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-gray-300">
                    <p className="text-gray-500 text-lg">Aun no tienes negocios listados.</p>
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
                                                {statusLabel(biz.status)}
                                            </span>
                                            {biz.isListingPaid && (
                                                <span className="flex items-center text-xs font-bold text-green-600 bg-green-50 px-2.5 py-0.5 rounded-full border border-green-200">
                                                    <DollarSign className="w-3 h-3 mr-1" /> Tarifa pagada
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-sm text-gray-500 mb-2">
                                            ${biz.financials?.askingPrice?.toLocaleString()} • {biz.location?.city}, {biz.location?.state}
                                        </div>
                                        {currentRole === 'admin' && (
                                            <div className="text-xs text-gray-400">
                                                ID del vendedor: {biz.sellerId}
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-wrap items-center gap-3">
                                        {currentRole === 'seller' && !biz.isListingPaid && biz.status === 'accepted' && (
                                            <button
                                                onClick={() => handlePayListing(biz._id)}
                                                className="flex items-center px-4 py-2 bg-green-600 text-white text-sm font-bold rounded-lg hover:bg-green-700 transition"
                                            >
                                                <DollarSign className="w-4 h-4 mr-1" /> Pagar tarifa de listado
                                            </button>
                                        )}

                                        {currentRole === 'seller' && (biz.status === 'pending' || biz.status === 'accepted' || biz.status === 'published') && (
                                            <button
                                                onClick={() => handleCancelListing(biz._id)}
                                                className="flex items-center px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-lg hover:bg-red-700 transition"
                                            >
                                                <Trash2 className="w-4 h-4 mr-1" /> Cancelar listado
                                            </button>
                                        )}

                                        {currentRole === 'admin' && biz.status === 'pending' && (
                                            <button
                                                onClick={() => handleUpdateStatus(biz._id, 'accepted')}
                                                className="flex items-center px-4 py-2 bg-green-600 text-white text-sm font-bold rounded-lg hover:bg-green-700 transition"
                                            >
                                                <CheckCircle className="w-4 h-4 mr-1" /> Aceptar listado
                                            </button>
                                        )}

                                        {currentRole === 'admin' && biz.status === 'published' && (
                                            <button
                                                onClick={() => handleUpdateStatus(biz._id, 'sold')}
                                                className="flex items-center px-4 py-2 bg-gray-600 text-white text-sm font-bold rounded-lg hover:bg-gray-700 transition"
                                            >
                                                <CheckCircle className="w-4 h-4 mr-1" /> Marcar como vendido
                                            </button>
                                        )}

                                        <button
                                            onClick={() => navigate(`/business/${biz.slug}`)}
                                            className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-100 transition"
                                        >
                                            Ver publicación
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

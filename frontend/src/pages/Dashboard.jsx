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
                <div className="h-12 w-12 animate-spin rounded-full border-2 border-line border-t-brand-900" />
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
                    <h1 className="text-3xl font-semibold tracking-tight text-oxford">Tu cuenta</h1>
                    <p className="mt-1 text-dark-500">
                        Explora el mercado, guarda listas y chatea con vendedores si tienes membresía premium.
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mb-10">
                    <button
                        type="button"
                        onClick={() => navigate('/dashboard/lists')}
                        className="rounded-xl border border-line bg-white p-6 text-left shadow-pd transition-all hover:border-brand-900/25 hover:shadow-pd-md"
                    >
                        <FolderOpen className="mb-3 h-8 w-8 text-brand-900" />
                        <h2 className="text-lg font-semibold text-oxford">Mis listas</h2>
                        <p className="mt-1 text-sm text-dark-500">Agrupa negocios para revisarlos después.</p>
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/inbox')}
                        className="rounded-xl border border-line bg-white p-6 text-left shadow-pd transition-all hover:border-brand-900/25 hover:shadow-pd-md"
                    >
                        <Mail className="mb-3 h-8 w-8 text-brand-900" />
                        <h2 className="flex items-center gap-2 text-lg font-semibold text-oxford">
                            Mensajes
                            {unreadMessages > 0 ? (
                                <span className="rounded-md bg-brand-900 px-2 py-0.5 text-xs font-semibold text-white">{unreadMessages}</span>
                            ) : null}
                        </h2>
                        <p className="mt-1 text-sm text-dark-500">Solo con membresía premium puedes contactar vendedores.</p>
                    </button>
                </div>

                <div className="max-w-xl rounded-xl border border-line bg-white p-8 shadow-pd">
                    <p className="mb-4 font-medium text-dark-700">Descubre negocios en venta en el mercado.</p>
                    <button
                        type="button"
                        onClick={() => navigate('/marketplace')}
                        className="rounded-lg bg-brand-900 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-brand-700"
                    >
                        Ir al marketplace
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/pricing/buyers')}
                        className="ml-3 rounded-lg border border-line px-5 py-2.5 font-semibold text-oxford transition-colors hover:bg-light-100"
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
                    <h1 className="text-3xl font-semibold tracking-tight text-oxford">
                        {currentRole === 'admin' ? 'Panel de administración' : 'Tus listados'}
                    </h1>
                    <p className="mt-1 text-dark-500">
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
                            className="flex items-center rounded-lg border border-line px-4 py-2 font-semibold text-oxford shadow-pd transition-colors hover:bg-light-100"
                        >
                            <Mail className="mr-2 h-5 w-5 text-brand-900" />
                            Mensajes
                            {unreadMessages > 0 ? (
                                <span className="ml-2 rounded-md bg-brand-900 px-2 py-0.5 text-xs font-semibold text-white">{unreadMessages}</span>
                            ) : null}
                        </button>
                    )}
                    {(currentRole === 'seller' || currentRole === 'admin') && (
                        <button
                            type="button"
                            onClick={() => navigate('/create-listing')}
                            className="flex items-center rounded-lg bg-brand-900 px-4 py-2 font-semibold text-white shadow-pd transition-colors hover:bg-brand-700"
                        >
                            <PlusCircle className="mr-2 h-5 w-5" /> Agregar negocio en venta
                        </button>
                    )}
                </div>
            </div>

            {error && (
                <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>
            )}


            {/* Existing Listings */}
            <h2 className="mb-6 text-2xl font-semibold text-oxford">
                {currentRole === 'admin' ? 'Todos los listados de la plataforma' : 'Negocios que listaste'}
            </h2>

            {businesses.length === 0 ? (
                <div className="rounded-xl border border-dashed border-line bg-white p-12 text-center">
                    <p className="text-lg text-dark-500">Aun no tienes negocios listados.</p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-xl border border-line bg-white shadow-pd">
                    <ul className="divide-y divide-line">
                        {businesses.map((biz) => (
                            <li key={biz._id} className="p-6 transition-colors hover:bg-light-100/80">
                                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                                    {/* Info */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h4 className="text-lg font-semibold text-oxford">{biz.title}</h4>
                                            <span
                                                className={`rounded-md px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${
                                                    biz.status === 'published'
                                                        ? 'bg-green-100 text-green-800'
                                                        : biz.status === 'sold'
                                                          ? 'bg-light-100 text-dark-700'
                                                          : 'bg-amber-50 text-amber-900'
                                                }`}
                                            >
                                                {statusLabel(biz.status)}
                                            </span>
                                            {biz.isListingPaid && (
                                                <span className="flex items-center rounded-md border border-green-200 bg-green-50 px-2.5 py-0.5 text-xs font-semibold text-green-700">
                                                    <DollarSign className="w-3 h-3 mr-1" /> Tarifa pagada
                                                </span>
                                            )}
                                        </div>
                                        <div className="mb-2 text-sm text-dark-500">
                                            {typeof biz.financials?.askingPrice === 'number'
                                                ? `$${biz.financials.askingPrice.toLocaleString()}`
                                                : 'Precio por definir'}
                                            {(biz.location?.city || biz.location?.state) && (
                                                <>
                                                    {' '}
                                                    •{' '}
                                                    {[biz.location?.city, biz.location?.state]
                                                        .filter(Boolean)
                                                        .join(', ')}
                                                </>
                                            )}
                                        </div>
                                        {currentRole === 'admin' && (
                                            <div className="text-xs text-dark-300">
                                                ID del vendedor: {biz.sellerId}
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-wrap items-center gap-3">
                                        {currentRole === 'seller' && !biz.isListingPaid && biz.status === 'accepted' && (
                                            <button
                                                onClick={() => handlePayListing(biz._id)}
                                                className="flex items-center rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
                                            >
                                                <DollarSign className="mr-1 h-4 w-4" /> Pagar tarifa de listado
                                            </button>
                                        )}

                                        {currentRole === 'seller' && (biz.status === 'pending' || biz.status === 'accepted' || biz.status === 'published') && (
                                            <button
                                                onClick={() => handleCancelListing(biz._id)}
                                                className="flex items-center rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                                            >
                                                <Trash2 className="mr-1 h-4 w-4" /> Cancelar listado
                                            </button>
                                        )}

                                        {currentRole === 'admin' && biz.status === 'pending' && (
                                            <button
                                                onClick={() => handleUpdateStatus(biz._id, 'accepted')}
                                                className="flex items-center rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
                                            >
                                                <CheckCircle className="mr-1 h-4 w-4" /> Aceptar listado
                                            </button>
                                        )}

                                        {currentRole === 'admin' && biz.status === 'published' && (
                                            <button
                                                onClick={() => handleUpdateStatus(biz._id, 'sold')}
                                                className="flex items-center rounded-lg bg-dark-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-dark-800"
                                            >
                                                <CheckCircle className="mr-1 h-4 w-4" /> Marcar como vendido
                                            </button>
                                        )}

                                        <button
                                            onClick={() => navigate(`/business/${biz.slug}`)}
                                            className="rounded-lg border border-line px-4 py-2 text-sm font-semibold text-oxford transition hover:bg-light-100"
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

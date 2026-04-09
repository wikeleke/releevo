import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth, RedirectToSignIn } from '@clerk/clerk-react';
import { FolderOpen, Plus, Trash2, ChevronLeft, Loader2 } from 'lucide-react';

const BuyerLists = () => {
    const { listId } = useParams();
    const navigate = useNavigate();
    const { isLoaded, isSignedIn } = useAuth();
    const [lists, setLists] = useState([]);
    const [detail, setDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newName, setNewName] = useState('');
    const [creating, setCreating] = useState(false);

    const refreshLists = async () => {
        const { data } = await api.get('/watchlists');
        setLists(Array.isArray(data) ? data : []);
    };

    useEffect(() => {
        if (!isLoaded || !isSignedIn) return;
        let cancelled = false;
        (async () => {
            setLoading(true);
            setError(null);
            try {
                if (listId) {
                    setDetail(null);
                    const { data } = await api.get(`/watchlists/${listId}`);
                    if (!cancelled) setDetail(data);
                } else {
                    setDetail(null);
                    const { data } = await api.get('/watchlists');
                    if (!cancelled) setLists(Array.isArray(data) ? data : []);
                }
            } catch (err) {
                if (!cancelled) {
                    if (err?.response?.status === 403) {
                        setError('Las listas guardadas son para cuentas de comprador.');
                    } else {
                        setError(listId ? 'Lista no encontrada.' : 'No se pudieron cargar tus listas.');
                    }
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, [isLoaded, isSignedIn, listId]);

    const createList = async (e) => {
        e.preventDefault();
        const name = newName.trim();
        if (!name) return;
        setCreating(true);
        try {
            const { data } = await api.post('/watchlists', { name });
            setNewName('');
            await refreshLists();
            navigate(`/dashboard/lists/${data._id}`);
        } catch (err) {
            alert(err?.response?.data?.message || 'No se pudo crear');
        } finally {
            setCreating(false);
        }
    };

    const removeItem = async (businessMongoId) => {
        if (!listId || !businessMongoId) return;
        try {
            await api.delete(`/watchlists/${listId}/items/${businessMongoId}`);
            const { data } = await api.get(`/watchlists/${listId}`);
            setDetail(data);
            await refreshLists();
        } catch {
            alert('No se pudo quitar de la lista');
        }
    };

    const deleteList = async () => {
        if (!listId || !window.confirm('¿Eliminar esta lista?')) return;
        try {
            await api.delete(`/watchlists/${listId}`);
            navigate('/dashboard/lists');
        } catch {
            alert('No se pudo eliminar');
        }
    };

    if (!isLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-10 w-10 text-brand-900 animate-spin" />
            </div>
        );
    }
    if (!isSignedIn) return <RedirectToSignIn />;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-10 w-10 text-brand-900 animate-spin" />
            </div>
        );
    }

    if (listId && detail) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-10">
                <button
                    type="button"
                    onClick={() => navigate('/dashboard/lists')}
                    className="inline-flex items-center text-brand-900 font-medium mb-6 hover:underline"
                >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Mis listas
                </button>
                <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-oxford">{detail.name}</h1>
                        <p className="text-gray-500 mt-1">{detail.items?.length || 0} negocios guardados</p>
                    </div>
                    <button
                        type="button"
                        onClick={deleteList}
                        className="px-4 py-2 text-sm font-bold text-red-700 border border-red-200 rounded-lg hover:bg-red-50"
                    >
                        Eliminar lista
                    </button>
                </div>

                {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}

                {(!detail.items || detail.items.length === 0) ? (
                    <div className="bg-white border border-dashed border-line rounded-2xl p-12 text-center text-gray-500">
                        Aún no hay negocios en esta lista. Añádelos desde el mercado.
                    </div>
                ) : (
                    <ul className="space-y-3">
                        {detail.items.map((row) => {
                            const biz = row.business;
                            if (!biz) return null;
                            return (
                                <li key={String(biz._id || row.business)} className="bg-white border border-line rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
                                    <div>
                                        <p className="font-bold text-gray-900">{biz.title}</p>
                                        <p className="text-sm text-gray-500">${biz.financials?.askingPrice?.toLocaleString()} · {biz.location?.city}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Link
                                            to={`/business/${biz.slug}`}
                                            className="px-3 py-1.5 text-sm font-bold rounded-lg border border-line hover:bg-gray-50"
                                        >
                                            Ver
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() => removeItem(biz._id)}
                                            className="p-2 rounded-lg text-red-600 hover:bg-red-50"
                                            title="Quitar de la lista"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        );
    }

    if (listId && !detail && !loading) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-10 text-center text-gray-600">
                {error || 'Lista no encontrada.'}
                <button type="button" className="block mx-auto mt-4 text-brand-900 font-bold" onClick={() => navigate('/dashboard/lists')}>
                    Volver
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-extrabold text-oxford mb-2">Mis listas</h1>
            <p className="text-gray-500 mb-8">Organiza los negocios que quieres revisar.</p>

            {error && <div className="mb-4 text-red-600 text-sm bg-red-50 rounded-lg px-4 py-3">{error}</div>}

            <form onSubmit={createList} className="flex flex-wrap gap-2 items-center mb-10 bg-white border border-line rounded-xl p-4">
                <FolderOpen className="w-5 h-5 text-brand-900 shrink-0" />
                <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Nombre de la nueva lista"
                    className="flex-1 min-w-[200px] rounded-lg border border-line px-3 py-2 text-sm focus:ring-2 focus:ring-brand-900/20 outline-none"
                    maxLength={120}
                />
                <button
                    type="submit"
                    disabled={creating || !newName.trim()}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-brand-900 text-white text-sm font-bold rounded-lg hover:bg-brand-700 disabled:opacity-50"
                >
                    <Plus className="w-4 h-4" /> Crear
                </button>
            </form>

            {lists.length === 0 ? (
                <p className="text-gray-500">Aún no tienes listas. Crea una arriba.</p>
            ) : (
                <ul className="grid gap-3 sm:grid-cols-2">
                    {lists.map((list) => (
                        <li key={list._id}>
                            <Link
                                to={`/dashboard/lists/${list._id}`}
                                className="block bg-white border border-line rounded-xl p-5 hover:border-brand-900/30 hover:shadow-sm transition-all"
                            >
                                <span className="font-bold text-lg text-oxford">{list.name}</span>
                                <p className="text-sm text-gray-500 mt-1">{list.items?.length || 0} negocios</p>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default BuyerLists;

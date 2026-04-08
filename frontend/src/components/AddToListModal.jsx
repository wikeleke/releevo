import React, { useCallback, useEffect, useState } from 'react';
import api from '../services/api';
import { X, FolderPlus, Loader2 } from 'lucide-react';

const AddToListModal = ({ businessId, onClose, onAdded }) => {
    const [lists, setLists] = useState([]);
    const [newName, setNewName] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await api.get('/watchlists');
            setLists(Array.isArray(data) ? data : []);
        } catch (err) {
            if (err?.response?.status === 403) {
                setError('Las listas guardadas son para cuentas de comprador.');
            } else {
                setError('No se pudieron cargar tus listas.');
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const addToList = async (listId) => {
        setSubmitting(true);
        setError(null);
        try {
            await api.post(`/watchlists/${listId}/items`, { businessId });
            onAdded?.();
            onClose();
        } catch (err) {
            setError(err?.response?.data?.message || 'No se pudo agregar a la lista');
        } finally {
            setSubmitting(false);
        }
    };

    const createAndAdd = async (e) => {
        e?.preventDefault();
        const name = newName.trim();
        if (!name) return;
        setSubmitting(true);
        setError(null);
        try {
            const { data } = await api.post('/watchlists', { name });
            await api.post(`/watchlists/${data._id}/items`, { businessId });
            setNewName('');
            onAdded?.();
            onClose();
        } catch (err) {
            setError(err?.response?.data?.message || 'No se pudo crear la lista');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[85vh] overflow-hidden flex flex-col border border-gray-200">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-oxford flex items-center gap-2">
                        <FolderPlus className="w-5 h-5 text-marine" />
                        Guardar en una lista
                    </h3>
                    <button type="button" onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500" aria-label="Cerrar">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="px-5 py-4 overflow-y-auto flex-1">
                    {error && <div className="mb-3 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</div>}

                    {loading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="w-8 h-8 text-marine animate-spin" />
                        </div>
                    ) : (
                        <>
                            <p className="text-sm text-gray-600 mb-3">Elige una lista o crea una nueva.</p>
                            <ul className="space-y-1 mb-4">
                                {lists.map((list) => (
                                    <li key={list._id}>
                                        <button
                                            type="button"
                                            disabled={submitting}
                                            onClick={() => addToList(list._id)}
                                            className="w-full text-left px-3 py-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-marine/30 font-medium text-gray-800 transition-colors disabled:opacity-50"
                                        >
                                            {list.name}
                                            <span className="text-gray-400 text-sm font-normal ml-2">({list.items?.length || 0})</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>

                            <form onSubmit={createAndAdd} className="border-t border-gray-100 pt-4">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Nueva lista</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        placeholder="Ej. Oportunidades Q1"
                                        className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-marine/30 focus:border-marine outline-none"
                                        maxLength={120}
                                    />
                                    <button
                                        type="submit"
                                        disabled={submitting || !newName.trim()}
                                        className="px-4 py-2 bg-marine text-white text-sm font-bold rounded-lg hover:bg-blue-900 disabled:opacity-50"
                                    >
                                        Crear
                                    </button>
                                </div>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddToListModal;

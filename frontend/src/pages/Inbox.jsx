import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth, RedirectToSignIn } from '@clerk/clerk-react';
import { Loader2, Send, Mail, ChevronLeft } from 'lucide-react';
import { useMessageNotificationsContext } from '../context/MessageNotificationsContext.jsx';

const Inbox = () => {
    const { conversationId } = useParams();
    const navigate = useNavigate();
    const { isLoaded, isSignedIn } = useAuth();
    const { refreshUnread } = useMessageNotificationsContext();
    const [conversations, setConversations] = useState([]);
    const [thread, setThread] = useState(null);
    const [messages, setMessages] = useState([]);
    const [body, setBody] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);

    const loadConversations = useCallback(async () => {
        const { data } = await api.get('/messages/conversations');
        setConversations(Array.isArray(data) ? data : []);
    }, []);

    const loadThread = useCallback(async (id) => {
        if (!id) {
            setThread(null);
            setMessages([]);
            return;
        }
        const { data } = await api.get(`/messages/conversations/${id}`);
        setThread(data.conversation);
        setMessages(Array.isArray(data.messages) ? data.messages : []);
    }, []);

    useEffect(() => {
        if (!isLoaded || !isSignedIn) return;
        let cancelled = false;
        (async () => {
            setLoading(true);
            try {
                await loadConversations();
                if (conversationId) {
                    await loadThread(conversationId);
                } else {
                    setThread(null);
                    setMessages([]);
                }
            } catch {
                if (!cancelled && conversationId) navigate('/inbox', { replace: true });
            } finally {
                if (!cancelled) {
                    setLoading(false);
                    refreshUnread().catch(() => {});
                }
            }
        })();
        return () => { cancelled = true; };
    }, [isLoaded, isSignedIn, conversationId, loadConversations, loadThread, navigate, refreshUnread]);

    useEffect(() => {
        if (!conversationId || !isSignedIn) return;
        const interval = setInterval(() => {
            (async () => {
                try {
                    await loadThread(conversationId);
                } catch {
                    /* ignore */
                }
                loadConversations().catch(() => {});
                refreshUnread().catch(() => {});
            })();
        }, 15000);
        return () => clearInterval(interval);
    }, [conversationId, isSignedIn, loadThread, loadConversations, refreshUnread]);

    const send = async (e) => {
        e.preventDefault();
        const text = body.trim();
        if (!text || !conversationId) return;
        setSending(true);
        try {
            await api.post(`/messages/conversations/${conversationId}/messages`, { body: text });
            setBody('');
            await loadThread(conversationId);
            await loadConversations();
            await refreshUnread();
        } catch (err) {
            alert(err?.response?.data?.message || 'No se pudo enviar el mensaje');
        } finally {
            setSending(false);
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

    const formatTime = (d) => {
        if (!d) return '';
        return new Date(d).toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'short' });
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 min-h-[calc(100vh-5rem)]">
            <div className="mb-6">
                <Link to="/dashboard" className="inline-flex items-center text-sm text-brand-900 font-medium hover:underline">
                    <ChevronLeft className="w-4 h-4 mr-1" /> Panel
                </Link>
                <h1 className="text-3xl font-extrabold text-oxford mt-2 flex items-center gap-2">
                    <Mail className="w-8 h-8 text-brand-900" />
                    Mensajes
                </h1>
                <p className="text-gray-500 text-sm mt-1">Compradores premium y vendedores conectan aquí.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-4 bg-white rounded-xl border border-line overflow-hidden min-h-[480px]">
                <aside className={`lg:w-[320px] border-b lg:border-b-0 lg:border-r border-line flex flex-col ${conversationId ? 'hidden lg:flex' : 'flex'}`}>
                    <div className="p-3 border-b border-gray-100 font-bold text-gray-700 text-sm uppercase tracking-wide">
                        Conversaciones ({conversations.length})
                    </div>
                    <div className="overflow-y-auto flex-1 max-h-[50vh] lg:max-h-[calc(100vh-16rem)]">
                        {loading && conversations.length === 0 ? (
                            <div className="flex justify-center py-12">
                                <Loader2 className="h-8 w-8 text-brand-900 animate-spin" />
                            </div>
                        ) : conversations.length === 0 ? (
                            <p className="p-4 text-gray-500 text-sm">Aún no tienes conversaciones.</p>
                        ) : (
                            <ul>
                                {conversations.map((c) => {
                                    const active = conversationId === c._id;
                                    const title = c.business?.title || 'Listado';
                                    return (
                                        <li key={c._id}>
                                            <button
                                                type="button"
                                                onClick={() => navigate(`/inbox/${c._id}`)}
                                                className={`w-full text-left px-4 py-3 border-b border-light-100 hover:bg-gray-50 transition-colors ${active ? 'bg-blue-50 border-l-4 border-l-brand-900' : ''}`}
                                            >
                                                <div className="font-semibold text-gray-900 truncate">{title}</div>
                                                <div className="text-xs text-gray-500 truncate">{c.peerLabel}</div>
                                                {c.lastMessagePreview ? (
                                                    <div className="text-xs text-gray-400 truncate mt-1">{c.lastMessagePreview}</div>
                                                ) : null}
                                                {(c.unreadCount > 0) ? (
                                                    <span className="inline-block mt-1 text-[10px] font-bold bg-brand-900 text-white px-2 py-0.5 rounded-full">{c.unreadCount} nuevo</span>
                                                ) : null}
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                </aside>

                <section className={`flex-1 flex flex-col min-h-[400px] ${!conversationId ? 'hidden lg:flex' : 'flex'}`}>
                    {!conversationId ? (
                        <div className="flex-1 flex items-center justify-center text-gray-500 p-8 text-center">
                            Selecciona una conversación o inicia una desde el detalle de un listado (comprador premium).
                        </div>
                    ) : (
                        <>
                            <div className="p-4 border-b border-gray-100 flex items-center gap-3">
                                <button
                                    type="button"
                                    className="lg:hidden p-2 rounded-lg border border-line"
                                    onClick={() => navigate('/inbox')}
                                    aria-label="Volver al listado"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <div className="min-w-0 flex-1">
                                    <div className="font-bold text-oxford truncate">{thread?.business?.title || 'Conversación'}</div>
                                    <div className="text-xs text-gray-500 truncate">{thread?.peerLabel || '—'}</div>
                                </div>
                                {thread?.business?.slug ? (
                                    <Link
                                        to={`/business/${thread.business.slug}`}
                                        className="text-sm font-bold text-brand-900 hover:underline shrink-0"
                                    >
                                        Ver listado
                                    </Link>
                                ) : null}
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/80 max-h-[45vh] lg:max-h-[calc(100vh-22rem)]">
                                {messages.length === 0 ? (
                                    <p className="text-center text-gray-500 text-sm py-8">Escribe el primer mensaje.</p>
                                ) : (
                                    messages.map((m) => (
                                        <div
                                            key={m._id}
                                            className={`flex ${m.fromMe ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${m.fromMe
                                                    ? 'bg-brand-900 text-white rounded-br-md'
                                                    : 'bg-white border border-line text-gray-900 rounded-bl-md'}`}
                                            >
                                                <p className="whitespace-pre-wrap break-words">{m.body}</p>
                                                <div className={`text-[10px] mt-1 ${m.fromMe ? 'text-blue-100' : 'text-gray-400'}`}>
                                                    {formatTime(m.createdAt)}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            <form onSubmit={send} className="p-4 border-t border-gray-100 flex gap-2 bg-white">
                                <textarea
                                    value={body}
                                    onChange={(e) => setBody(e.target.value)}
                                    placeholder="Escribe un mensaje…"
                                    rows={2}
                                    className="flex-1 rounded-xl border border-line px-3 py-2 text-sm focus:ring-2 focus:ring-brand-900/20 outline-none resize-none"
                                />
                                <button
                                    type="submit"
                                    disabled={sending || !body.trim()}
                                    className="self-end px-4 py-3 bg-brand-900 text-white rounded-xl font-bold hover:bg-brand-700 disabled:opacity-50 flex items-center gap-2"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </form>
                        </>
                    )}
                </section>
            </div>
        </div>
    );
};

export default Inbox;

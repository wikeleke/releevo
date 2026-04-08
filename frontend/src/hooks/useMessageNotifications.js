import { useCallback, useEffect, useRef, useState } from 'react';
import api from '../services/api';

const POLL_MS = 25000;

const getNotifyPermission = () =>
    typeof Notification !== 'undefined' ? Notification.permission : 'denied';

/**
 * Polling de mensajes sin leer + aviso en página y notificación de sistema (si hay permiso y la pestaña está en segundo plano).
 */
export function useMessageNotifications(isSignedIn) {
    const [unreadTotal, setUnreadTotal] = useState(0);
    const [toastText, setToastText] = useState(null);
    const [notifyPermission, setNotifyPermission] = useState(getNotifyPermission);
    const prevRef = useRef(null);
    const toastTimerRef = useRef(null);

    const clearToastTimer = () => {
        if (toastTimerRef.current) {
            clearTimeout(toastTimerRef.current);
            toastTimerRef.current = null;
        }
    };

    const fetchUnread = useCallback(async () => {
        if (!isSignedIn) return;
        try {
            const { data } = await api.get('/messages/conversations/unread');
            const n = Number(data?.total) || 0;
            const prev = prevRef.current;

            if (prev !== null && n > prev) {
                const body =
                    n === 1 ? 'Tienes 1 mensaje sin leer' : `Tienes ${n} mensajes sin leer`;

                if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
                    try {
                        if (typeof document !== 'undefined' && document.hidden) {
                            new Notification('Releevo — Mensajes', {
                                body,
                                tag: 'releevo-inbox',
                            });
                        }
                    } catch {
                        // ignore
                    }
                }

                setToastText(body);
                clearToastTimer();
                toastTimerRef.current = setTimeout(() => {
                    setToastText(null);
                    toastTimerRef.current = null;
                }, 6000);
            }

            prevRef.current = n;
            setUnreadTotal(n);
        } catch {
            prevRef.current = 0;
            setUnreadTotal(0);
        }
    }, [isSignedIn]);

    useEffect(() => {
        if (!isSignedIn) {
            prevRef.current = null;
            setUnreadTotal(0);
            setToastText(null);
            clearToastTimer();
            return;
        }

        fetchUnread();
        const id = setInterval(fetchUnread, POLL_MS);

        const onVisible = () => {
            fetchUnread();
        };
        document.addEventListener('visibilitychange', onVisible);

        return () => {
            clearInterval(id);
            document.removeEventListener('visibilitychange', onVisible);
            clearToastTimer();
        };
    }, [isSignedIn, fetchUnread]);

    const requestNotifyPermission = useCallback(async () => {
        if (typeof Notification === 'undefined' || !Notification.requestPermission) {
            return 'denied';
        }
        const r = await Notification.requestPermission();
        setNotifyPermission(r);
        return r;
    }, []);

    const dismissToast = useCallback(() => {
        clearToastTimer();
        setToastText(null);
    }, []);

    return {
        unreadTotal,
        refreshUnread: fetchUnread,
        toastText,
        dismissToast,
        requestNotifyPermission,
        notifySupported: typeof Notification !== 'undefined',
        notifyPermission,
    };
}

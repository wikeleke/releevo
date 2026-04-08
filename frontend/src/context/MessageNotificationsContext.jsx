import React, { createContext, useContext } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useMessageNotifications } from '../hooks/useMessageNotifications';

const MessageNotificationsContext = createContext(null);

export function MessageNotificationsProvider({ children }) {
    const { isSignedIn } = useAuth();
    const value = useMessageNotifications(isSignedIn);

    return (
        <MessageNotificationsContext.Provider value={value}>
            {children}
        </MessageNotificationsContext.Provider>
    );
}

export function useMessageNotificationsContext() {
    const ctx = useContext(MessageNotificationsContext);
    if (!ctx) {
        throw new Error('useMessageNotificationsContext debe usarse dentro de MessageNotificationsProvider');
    }
    return ctx;
}

import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // In local mode, we skip authentication entirely
    const user = { id: 'local-user', name: 'Local Admin', email: 'admin@aegis.local', role: 'admin' };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: true,
            isLoadingAuth: false,
            isLoadingPublicSettings: false,
            authError: null,
            appPublicSettings: null,
            authChecked: true,
            logout: () => console.log('[Aegis] Logout (local mode)'),
            navigateToLogin: () => console.log('[Aegis] Login redirect (local mode)'),
            checkUserAuth: () => Promise.resolve(),
            checkAppState: () => Promise.resolve(),
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

import { createContext, useContext, useState } from 'react';

const ManualAuthContext = createContext();

export function ManualAuthProvider({ children }) {
    const [manualAuth, setManualAuth] = useState({
        isAuthenticated: false,
        email: null,
        fullName: null,
        displayName: null
    });

    const login = (email, fullName, displayName) => {
        localStorage.setItem('microsoftAuth', 'true');
        localStorage.setItem('microsoftEmail', email);
        localStorage.setItem('microsoftFullName', fullName);
        localStorage.setItem('microsoftDisplayName', displayName);
        setManualAuth({
            isAuthenticated: true,
            email,
            fullName,
            displayName
        });
    };

    const logout = () => {
        localStorage.removeItem('microsoftAuth');
        localStorage.removeItem('microsoftEmail');
        localStorage.removeItem('microsoftFullName');
        localStorage.removeItem('microsoftDisplayName');
        setManualAuth({
            isAuthenticated: false,
            email: null,
            fullName: null,
            displayName: null
        });
    };

    return (
        <ManualAuthContext.Provider value={{ manualAuth, login, logout }}>
            {children}
        </ManualAuthContext.Provider>
    );
}

export function useManualAuth() {
    return useContext(ManualAuthContext);
}
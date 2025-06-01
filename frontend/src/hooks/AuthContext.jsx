import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    const login = (token, userData) => {
        localStorage.setItem("token", token);
        setIsAuthenticated(true);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        setUser(null);
    };

    useEffect(() => {
        const checkAuth = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setIsAuthenticated(false);
            setUser(null);
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("http://localhost:5000/api/auth/verify", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            });

            const data = await res.json();

            if (res.ok && data.valid) {
            setIsAuthenticated(true);
            setUser(data.user);
            } else {
            setIsAuthenticated(false);
            setUser(null);
            }
        } catch (err) {
            setIsAuthenticated(false);
            setUser(null);
        } finally {
            setLoading(false);
        }
        };

        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, loading, login, logout, user }}>
        {children}
        </AuthContext.Provider>
    );
};
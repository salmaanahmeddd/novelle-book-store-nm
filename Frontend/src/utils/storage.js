// storage.js
const USER_TOKEN_KEY = 'user-access-token';
const SELLER_TOKEN_KEY = 'seller-access-token';
const ADMIN_TOKEN_KEY = 'admin-access-token';

// Generic methods for setting, getting, and clearing tokens
const setToken = (key, token) => localStorage.setItem(key, token);
const getToken = (key) => localStorage.getItem(key);
const clearToken = (key) => localStorage.removeItem(key);

// Export role-specific methods
export const setUserToken = (token) => setToken(USER_TOKEN_KEY, token);
export const getUserToken = () => getToken(USER_TOKEN_KEY);
export const clearUserToken = () => clearToken(USER_TOKEN_KEY);

export const setSellerToken = (token) => setToken(SELLER_TOKEN_KEY, token);
export const getSellerToken = () => getToken(SELLER_TOKEN_KEY);
export const clearSellerToken = () => clearToken(SELLER_TOKEN_KEY);

export const setAdminToken = (token) => setToken(ADMIN_TOKEN_KEY, token);
export const getAdminToken = () => getToken(ADMIN_TOKEN_KEY);
export const clearAdminToken = () => clearToken(ADMIN_TOKEN_KEY);

// const TOKEN_KEY = 'access-token';

// export const setToken = (token) => {
//   localStorage.setItem(TOKEN_KEY, token);
// };

// export const getToken = () => {
//   return localStorage.getItem(TOKEN_KEY);
// };

// export const clearToken = () => {
//   localStorage.removeItem(TOKEN_KEY);
// };


const TOKEN_KEY = 'access-token';

/**
 * Save token to localStorage
 * @param {string} token - The token to save
 */
export const setToken = (token) => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error('Failed to set token in localStorage:', error);
  }
};

/**
 * Retrieve token from localStorage
 * @returns {string|null} - The stored token or null if not found
 */
export const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Failed to get token from localStorage:', error);
    return null;
  }
};

/**
 * Clear token from localStorage
 */
export const clearToken = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error('Failed to clear token from localStorage:', error);
  }
};

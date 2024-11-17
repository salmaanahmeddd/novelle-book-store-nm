import { useState, useEffect } from 'react';
import axios from 'axios';
import { getToken } from '../utils/storage';

const useAuth = (role) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken();

      if (!token) {
        console.warn('No token found in localStorage. User is not logged in.');
        setIsLoggedIn(false);
        setLoading(false);
        return;
      }

      try {
        console.log(`Checking auth for role: ${role} with token:`, token);

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/${role}/check-auth`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
            withCredentials: true, // Ensures cookies are sent for cross-origin requests
          }
        );

        console.log('Check-auth response:', response.data);

        if (response.status === 200 && response.data.authenticated) {
          setIsLoggedIn(true);
        } else {
          console.warn('Authentication failed or user not authorized.');
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Error during authentication check:', {
          message: error.message,
          response: error.response?.data || 'No response data',
          headers: error.config?.headers,
        });
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [role]);

  return { isLoggedIn, loading };
};

export default useAuth;

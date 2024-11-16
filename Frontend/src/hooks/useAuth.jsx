import { useState, useEffect } from 'react';
import axios from 'axios';
import { getToken } from '../utils/storage';

const useAuth = (role) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = getToken();
        if (!token) {
          setIsLoggedIn(false);
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/${role}/check-auth`,
          {
            headers: { 'Authorization': `Bearer ${token}` },
            withCredentials: true,
          }
        );

        if (response.status === 200 && response.data.authenticated) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error(`Authentication check failed for ${role}:`, error);
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

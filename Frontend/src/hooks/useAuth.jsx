import { useState, useEffect } from 'react';
import axios from 'axios';
import { getToken } from '../utils/storage';

const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = getToken();
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/check-auth`, {
          withCredentials: true,
          headers: {
            "access-token": token
          }
        });
        setIsLoggedIn(response.data.authenticated);
      } catch (error) {
        console.error('Authentication check failed:', error);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return { isLoggedIn, loading };
};

export default useAuth;

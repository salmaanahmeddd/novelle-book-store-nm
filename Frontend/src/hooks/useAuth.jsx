import { useState, useEffect } from 'react';
import axios from 'axios';
import { getUserToken, getSellerToken, getAdminToken } from '../utils/storage';

const useAuth = (role) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      setIsLoggedIn(false);

      let token;

      // Get the correct token based on the role
      if (role === 'user') {
        token = getUserToken();
      } else if (role === 'seller') {
        token = getSellerToken();
      } else if (role === 'admin') {
        token = getAdminToken();
      }

      if (!token) {
        console.warn(`No token found for role: ${role}`);
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/${role}/check-auth`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        if (response.status === 200 && response.data.authenticated) {
          setIsLoggedIn(true);
        } else {
          console.warn(`${role} authentication failed.`);
        }
      } catch (error) {
        console.error(`Error during ${role} authentication check:`, error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [role]);

  return { isLoggedIn, loading };
};

export default useAuth;

// src/useAuth.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken, isTokenValid, clearToken } from './auth';

const useAuth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    if (!token || !isTokenValid(token)) {
      clearToken();
      navigate('/login');
    }
  }, [navigate]);
};

export default useAuth;

// src/auth.js
import { jwtDecode } from "jwt-decode";

export const getToken = () => {
  return localStorage.getItem('accessToken');
};

export const clearToken = () => {
  localStorage.removeItem('accessToken');
};

export const isTokenValid = (token) => {
  if (!token) return false;

  try {
    const decode = jwtDecode(token);
    if (decode.exp < Date.now() / 1000) {
      clearToken();
      return false;
    }
    return true;
  } catch (err) {
    console.error('Token validation failed', err);
    return false;
  }
};

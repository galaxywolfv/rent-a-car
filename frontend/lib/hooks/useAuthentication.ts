import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import config from "../config";
import { useNotification } from "./useNotification";
import { useAuth } from "@/AuthContext";
import { Role, User } from "../types";

function useAuthentication() {
  const router = useRouter();

  const { onSuccess, onError } = useNotification()
  const { setIsAuthenticated, setRole } = useAuth();

  const [loading, setLoading] = useState<boolean>(false);
  const [loadingAuth, setLoadingAuth] = useState<boolean>(true);
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);

  const baseUrl = config.user;

  useEffect(() => {
    setToken(localStorage.getItem('token'));
  }, []);

  const register = async (username: string, email: string, password: string) => {
    try {
      setLoading(true);
      const response = await axios.post(`${baseUrl}/register`, {
        username,
        email,
        password,
      });
      const data = response.data;
      localStorage.setItem('token', data);
      setToken(data);
      setIsAuth(true);
      setIsAuthenticated(true);
      router.replace('/');
      onSuccess('Registered successfully');
    } catch (error) {
      console.error('Registration failed:', error);
      setIsAuthenticated(false);
      onError('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const login = async (identifier: string, password: string) => {
    try {
      setLoading(true);
      const response = await axios.post(`${baseUrl}/login`, {
        identifier,
        password,
      });
      const data = response.data;
      localStorage.setItem('token', data);
      setToken(data);
      setIsAuth(true);
      setIsAuthenticated(true);
      router.replace('/');
      onSuccess('Logged in successfully');
    } catch (error) {
      console.error('Authentication failed:', error);
      setIsAuthenticated(false);
      onError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem('token')
      
      setIsAuthenticated(false);
      setToken(null);
      setRole(Role.user);
      onSuccess('Logged out successfully');
    } catch (error) {
      console.log(error)
    }
  };

  const checkAuth = async (token: string | null = localStorage.getItem('token')) => {
    setLoadingAuth(true);
    if (!token) {
      setIsAuthenticated(false);
      setLoadingAuth(false);
      return;
    }
    try {
      setLoading(true);

      const response = await axios.get(`${baseUrl}/verify`, {
        headers: {
          bearer: token,
        },
      });

      const user: User = response.data;

      setToken(token);
      setIsAuthenticated(true);
      setIsAuth(true);
      setRole(user.role);
    } catch (error) {
      setToken(null);
      setIsAuthenticated(false);
      setIsAuth(false);
      setRole(Role.user);

      localStorage.removeItem('token');
    } finally {
      setLoadingAuth(false);
      setLoading(false);
    }
  }

  return { register, login, logout, checkAuth, isAuth, loading, loadingAuth, token };
}

export default useAuthentication;

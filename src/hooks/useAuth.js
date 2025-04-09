import { useState } from 'react';
import { toast } from 'react-toastify';
import { login } from '../utils/api';

export const useAuth = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  const handleLogin = async (username, password, navigate) => {
    try {
      const res = await login(username, password);
      if (!res.data.token) {
        throw new Error('Không nhận được token từ server');
      }
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      const role = JSON.parse(atob(res.data.token.split('.')[1])).role;
      navigate(role === 'student' ? '/student' : '/admin');
      toast.success('Đăng nhập thành công!');
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Lỗi đăng nhập không xác định';
      toast.error(errorMessage);
      console.error('Login error:', err); // Log lỗi để debug
    }
  };

  const handleLogout = (navigate) => {
    localStorage.removeItem('token');
    setToken('');
    navigate('/');
    toast.success('Đăng xuất thành công');
  };

  return { token, handleLogin, handleLogout, setToken };
};
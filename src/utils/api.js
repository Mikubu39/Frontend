import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const login = (username, password) =>
  axios.post(`${API_BASE_URL}/login`, { username, password });

export const fetchAdminData = (token) =>
  axios.get(`${API_BASE_URL}/admin/students`, { headers: { Authorization: token } });

export const fetchAdminClasses = (token) =>
  axios.get(`${API_BASE_URL}/admin/classes`, { headers: { Authorization: token } });

export const fetchStudentDashboard = (token) =>
  axios.get(`${API_BASE_URL}/student/dashboard`, { headers: { Authorization: token } });

export const fetchStudentHistory = (token) =>
  axios.get(`${API_BASE_URL}/student/history`, { headers: { Authorization: token } });

export const addStudent = (data, token) =>
  axios.post(`${API_BASE_URL}/admin/add-student`, data, { headers: { Authorization: token } });

export const addClass = (data, token) =>
  axios.post(`${API_BASE_URL}/admin/add-class`, data, { headers: { Authorization: token } });

export const addTuition = (data, token) =>
  axios.post(`${API_BASE_URL}/admin/add-tuition`, data, { headers: { Authorization: token } });

export const updateTuition = (id, data, token) =>
  axios.put(`${API_BASE_URL}/admin/update-tuition/${id}`, data, { headers: { Authorization: token } });

export const deleteTuition = (id, token) =>
  axios.delete(`${API_BASE_URL}/admin/delete-tuition/${id}`, { headers: { Authorization: token } });

export const deleteStudent = (id, token) =>
  axios.delete(`${API_BASE_URL}/admin/delete-student/${id}`, { headers: { Authorization: token } });

export const updateStudent = (id, data, token) =>
  axios.put(`${API_BASE_URL}/admin/update-student/${id}`, data, { headers: { Authorization: token } });

export const createPayment = (data, token) =>
  axios.post(`${API_BASE_URL}/create-payment`, data, { headers: { Authorization: token } });

export const executePayment = (data, token) =>
  axios.post(`${API_BASE_URL}/execute-payment`, data, { headers: { Authorization: token } });

export const changePassword = (data, token) =>
  axios.post(`${API_BASE_URL}/student/change-password`, data, { headers: { Authorization: token } });
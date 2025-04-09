import React from 'react';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './components/Login';
import StudentDashboard from './components/student/StudentDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import { useTheme } from './hooks/useTheme';
import { useAuth } from './hooks/useAuth';
import './styles/App.css';

function App() {
  const { theme, toggleTheme } = useTheme();
  const { token, handleLogin, handleLogout } = useAuth();
  const navigate = useNavigate();

  const wrappedHandleLogout = () => handleLogout(navigate); // Bao bọc handleLogout với navigate

  return (
    <div className="App">
      <button onClick={toggleTheme} className="theme-toggle">
        <i className={theme === 'light' ? 'fas fa-moon' : 'fas fa-sun'}></i>
        {theme === 'light' ? ' Chuyển sang Dark Mode' : ' Chuyển sang Light Mode'}
      </button>
      <Routes>
        <Route path="/" element={<Login handleLogin={handleLogin} navigate={navigate} />} />
        <Route path="/student" element={token ? <StudentDashboard token={token} handleLogout={wrappedHandleLogout} /> : <Navigate to="/" />} />
        <Route path="/admin" element={token ? <AdminDashboard handleLogout={wrappedHandleLogout} /> : <Navigate to="/" />} />
        <Route path="/success" element={token ? <StudentDashboard token={token} handleLogout={wrappedHandleLogout} /> : <Navigate to="/" />} />
        <Route path="/cancel" element={token ? <StudentDashboard token={token} handleLogout={wrappedHandleLogout} /> : <Navigate to="/" />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover />
    </div>
  );
}

export default App;
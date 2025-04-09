import React, { useState } from 'react';

function Login({ handleLogin, navigate }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      alert('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!');
      return;
    }
    handleLogin(username, password, navigate); // Truyền navigate vào handleLogin
  };

  return (
    <div className="login-container">
      <h1><i className="fas fa-sign-in-alt"></i> Đăng Nhập Hệ Thống</h1>
      <form onSubmit={onSubmit}>
        <div className="input-group">
          <i className="fas fa-user"></i>
          <input
            type="text"
            placeholder="Tên đăng nhập"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input-field"
          />
        </div>
        <div className="input-group">
          <i className="fas fa-lock"></i>
          <input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
          />
        </div>
        <button type="submit" className="login-btn">
          <i className="fas fa-arrow-right"></i> Đăng nhập
        </button>
      </form>
    </div>
  );
}

export default Login;
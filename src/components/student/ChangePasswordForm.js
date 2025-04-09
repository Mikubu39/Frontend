import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Thêm import này
import { toast } from 'react-toastify';
import { changePassword } from '../../utils/api';
import { useAuth } from '../../hooks/useAuth';
import Input from '../common/Input';

function ChangePasswordForm({ token }) {
  const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '' });
  const [isSubmitting, setIsSubmitting] = useState(false); // Thêm trạng thái submit
  const { handleLogout } = useAuth();
  const navigate = useNavigate(); // Thêm useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return; // Ngăn gửi nhiều yêu cầu
    if (!passwordData.oldPassword || !passwordData.newPassword) {
      toast.error('Vui lòng nhập đầy đủ mật khẩu cũ và mới');
      return;
    }

    setIsSubmitting(true); // Đánh dấu đang xử lý
    try {
      const res = await changePassword(passwordData, token);
      toast.success(res.data.message || 'Đổi mật khẩu thành công!');
      setPasswordData({ oldPassword: '', newPassword: '' }); // Reset form
      handleLogout(navigate); // Truyền navigate vào handleLogout
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Lỗi không xác định';
      toast.error('Lỗi khi đổi mật khẩu: ' + errorMessage);
      console.error('Change password error:', err); // Log lỗi để debug
    } finally {
      setIsSubmitting(false); // Reset trạng thái sau khi hoàn tất
    }
  };

  return (
    <div className="change-password-form">
      <h3><i className="fas fa-lock"></i> Đổi Mật Khẩu</h3>
      <form onSubmit={handleSubmit}>
        <Input
          icon="fas fa-lock"
          type="password"
          placeholder="Mật khẩu cũ"
          value={passwordData.oldPassword}
          onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
          required
          disabled={isSubmitting} // Vô hiệu hóa khi đang xử lý
        />
        <Input
          icon="fas fa-lock"
          type="password"
          placeholder="Mật khẩu mới"
          value={passwordData.newPassword}
          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
          required
          disabled={isSubmitting}
        />
        <button type="submit" disabled={isSubmitting}>
          <i className="fas fa-save"></i> {isSubmitting ? 'Đang cập nhật...' : 'Cập Nhật Mật Khẩu'}
        </button>
      </form>
    </div>
  );
}

export default ChangePasswordForm;
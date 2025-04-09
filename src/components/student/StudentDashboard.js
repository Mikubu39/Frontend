import React, { useState, useEffect } from 'react';
import { useFetchData } from '../../hooks/useFetchData';
import { fetchStudentDashboard, fetchStudentHistory, executePayment } from '../../utils/api'; // Đúng với cấu trúc
import { toast } from 'react-toastify';
import TuitionTable from './TuitionTable';
import HistoryTable from './HistoryTable';
import ChangePasswordForm from './ChangePasswordForm';
import { formatCurrency } from '../../utils/formatters';

function StudentDashboard({ token, handleLogout }) {
  const { data: dashboardData, refetch: refetchDashboard } = useFetchData(fetchStudentDashboard, token);
  const { data: historyData, refetch: refetchHistory } = useFetchData(fetchStudentHistory, token);
  const [showChangePassword, setShowChangePassword] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentId = urlParams.get('paymentId');
    const payerId = urlParams.get('PayerID');
    if (paymentId && payerId) {
      const tuitionId = localStorage.getItem('pendingTuitionId');
      executePayment({ paymentId, payerId, tuitionId }, token)
        .then(() => {
          toast.success('Thanh toán thành công!');
          localStorage.removeItem('pendingTuitionId');
          window.history.replaceState({}, document.title, '/student');
          refetchDashboard();
          refetchHistory();
        })
        .catch(err => toast.error('Lỗi khi xử lý thanh toán: ' + (err.response?.data.message || 'Không rõ')));
    }
  }, [token, refetchDashboard, refetchHistory]);

  return (
    <div className="dashboard">
      <h1><i className="fas fa-user-graduate"></i> Dashboard Sinh Viên</h1>
      <button onClick={handleLogout} className="logout-btn">
        <i className="fas fa-sign-out-alt"></i> Đăng Xuất
      </button>
      <button onClick={() => setShowChangePassword(!showChangePassword)} className="change-password-btn">
        <i className="fas fa-key"></i> {showChangePassword ? 'Hủy' : 'Đổi Mật Khẩu'}
      </button>
      {showChangePassword && <ChangePasswordForm token={token} />}
      <div className="total-debt">
        <h2><i className="fas fa-wallet"></i> Tổng Nợ: {formatCurrency(dashboardData?.totalDebt || 0)}</h2>
      </div>
      <TuitionTable tuitions={dashboardData?.tuitions || []} token={token} />
      <HistoryTable history={historyData || []} />
    </div>
  );
}

export default StudentDashboard;
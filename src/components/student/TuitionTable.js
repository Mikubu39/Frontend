import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { createPayment } from '../../utils/api';
import { formatCurrency } from '../../utils/formatters';
import Table from '../common/Table';
import Button from '../common/Button';

function TuitionTable({ tuitions, token }) {
  const [filter, setFilter] = useState('unpaid');

  const handlePayment = async (tuitionId) => {
    localStorage.setItem('pendingTuitionId', tuitionId);
    try {
      const res = await createPayment({ tuitionId }, token);
      window.location.href = res.data.approvalUrl;
    } catch (err) {
      toast.error('Lỗi khi tạo thanh toán: ' + (err.response?.data.message || 'Không rõ'));
    }
  };

  const filteredTuitions = tuitions.filter(t => 
    filter === 'all' || (filter === 'unpaid' && !t.paid) || (filter === 'paid' && t.paid)
  );

  return (
    <>
      <h3 className="section-title"><i className="fas fa-money-bill-wave"></i> Các Khoản Nợ</h3>
      <div className="filter-container">
        <label>Lọc: </label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="unpaid">Chưa thanh toán</option>
          <option value="paid">Đã thanh toán</option>
          <option value="all">Tất cả</option>
        </select>
      </div>
      <Table headers={['Mô Tả', 'Số Tiền (USD)', 'Hạn Nộp', 'Trạng Thái', 'Thao Tác']}>
        {filteredTuitions.map(t => (
          <tr key={t._id}>
            <td>{t.description}</td>
            <td>{formatCurrency(t.amount)}</td>
            <td>{new Date(t.dueDate).toLocaleDateString()}</td>
            <td className={t.paid ? 'status-paid' : 'status-unpaid'}>
              <i className={t.paid ? 'fas fa-check' : 'fas fa-times'}></i> {t.paid ? 'Đã thanh toán' : 'Chưa thanh toán'}
            </td>
            <td>
              {!t.paid && (
                <Button className="pay-btn" onClick={() => handlePayment(t._id)}>
                  <i className="fas fa-credit-card"></i> Thanh Toán
                </Button>
              )}
            </td>
          </tr>
        ))}
      </Table>
    </>
  );
}

export default TuitionTable;
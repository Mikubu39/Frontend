import React from 'react';
import { formatCurrency } from '../../utils/formatters';
import Table from '../common/Table';

function HistoryTable({ history }) {
  return (
    <>
      <h3 className="section-title"><i className="fas fa-history"></i> Lịch Sử Thanh Toán</h3>
      <Table headers={['Mô Tả', 'Số Tiền (USD)', 'Ngày Thanh Toán']}>
        {history.map(t => (
          <tr key={t._id}>
            <td>{t.description}</td>
            <td>{formatCurrency(t.amount)}</td>
            <td>{new Date(t.paidDate).toLocaleDateString()}</td>
          </tr>
        ))}
      </Table>
    </>
  );
}

export default HistoryTable;
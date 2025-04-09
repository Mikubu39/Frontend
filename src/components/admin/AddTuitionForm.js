import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { addTuition } from '../../utils/api';
import { formatDate } from '../../utils/formatters';
import { TUITION_TYPES } from '../../utils/constants';
import Input from '../common/Input';
import Select from '../common/Select';

function AddTuitionForm({ token, classes, onTuitionAdded }) {
  const [newTuition, setNewTuition] = useState({
    class: '',
    amount: '',
    type: TUITION_TYPES[0],
    dueDate: '',
    academicYear: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const description = `${newTuition.type} - ${newTuition.class} - ${formatDate(newTuition.dueDate)}`;
    try {
      const res = await addTuition({ ...newTuition, description }, token);
      toast.success(res.data.message);
      setNewTuition({ class: '', amount: '', type: TUITION_TYPES[0], dueDate: '', academicYear: '' });
      onTuitionAdded();
    } catch (err) {
      toast.error(err.response?.data.message || 'Lỗi khi thêm khoản nợ');
    }
  };

  const classOptions = [{ value: '', label: 'Chọn lớp' }, ...classes.map(c => ({ value: c.name, label: c.name }))];
  const typeOptions = TUITION_TYPES.map(t => ({ value: t, label: t }));

  return (
    <div className="tab-content">
      <h2 className="section-title"><i className="fas fa-money-bill-wave"></i> Thêm Khoản Nợ</h2>
      <form onSubmit={handleSubmit} className="admin-form">
        <Select
          icon="fas fa-school"
          value={newTuition.class}
          onChange={(e) => setNewTuition({ ...newTuition, class: e.target.value })}
          options={classOptions}
          required
        />
        <Select
          icon="fas fa-list"
          value={newTuition.type}
          onChange={(e) => setNewTuition({ ...newTuition, type: e.target.value })}
          options={typeOptions}
          required
        />
        <Input
          icon="fas fa-calendar"
          placeholder="Năm học (ví dụ: 2023-2024)"
          value={newTuition.academicYear}
          onChange={(e) => setNewTuition({ ...newTuition, academicYear: e.target.value })}
          required
        />
        <Input
          icon="fas fa-dollar-sign"
          type="number"
          placeholder="Số tiền (USD)"
          value={newTuition.amount}
          onChange={(e) => setNewTuition({ ...newTuition, amount: e.target.value })}
          required
        />
        <Input
          icon="fas fa-calendar-alt"
          type="date"
          value={newTuition.dueDate}
          onChange={(e) => setNewTuition({ ...newTuition, dueDate: e.target.value })}
          required
          min={new Date().toISOString().split("T")[0]}
        />
        <button type="submit"><i className="fas fa-plus"></i> Thêm Khoản Nợ</button>
      </form>
    </div>
  );
}

export default AddTuitionForm;
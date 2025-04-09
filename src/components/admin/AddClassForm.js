import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { addClass } from '../../utils/api';
import Input from '../common/Input';

function AddClassForm({ token, onClassAdded }) {
  const [newClass, setNewClass] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const className = newClass.trim().toUpperCase();
    const validClassNameRegex = /^[A-Z0-9-]+$/;
    if (!validClassNameRegex.test(className)) {
      toast.error("Tên lớp chỉ được chứa chữ cái, số và dấu gạch ngang (ví dụ: 23CS1, IT-2023)");
      return;
    }
    try {
      const res = await addClass({ name: className }, token);
      toast.success(res.data.message);
      setNewClass('');
      onClassAdded();
    } catch (err) {
      toast.error(err.response?.data.message || 'Lỗi khi thêm lớp học');
    }
  };

  return (
    <div className="tab-content">
      <h2 className="section-title"><i className="fas fa-school"></i> Thêm Lớp Học</h2>
      <form onSubmit={handleSubmit} className="admin-form">
        <Input
          icon="fas fa-school"
          placeholder="Tên lớp (ví dụ: 23CS1)"
          value={newClass}
          onChange={(e) => setNewClass(e.target.value)}
          required
        />
        <button type="submit"><i className="fas fa-plus"></i> Thêm Lớp Học</button>
      </form>
    </div>
  );
}

export default AddClassForm;
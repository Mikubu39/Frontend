import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { addStudent } from '../../utils/api';
import Input from '../common/Input';
import Select from '../common/Select';

function AddStudentForm({ token, classes, onStudentAdded }) {
  const [newStudent, setNewStudent] = useState({ name: '', class: '', dateOfBirth: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await addStudent(newStudent, token);
      toast.success(res.data.message);
      setNewStudent({ name: '', class: '', dateOfBirth: '' });
      onStudentAdded();
    } catch (err) {
      toast.error(err.response?.data.message || 'Lỗi khi thêm sinh viên');
    }
  };

  const classOptions = [{ value: '', label: 'Chọn lớp' }, ...classes.map(c => ({ value: c.name, label: c.name }))];

  return (
    <div className="tab-content">
      <h2 className="section-title"><i className="fas fa-user-plus"></i> Thêm Sinh Viên</h2>
      <form onSubmit={handleSubmit} className="admin-form">
        <Input
          icon="fas fa-address-card"
          placeholder="Tên sinh viên"
          value={newStudent.name}
          onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
          required
        />
        <Select
          icon="fas fa-school"
          value={newStudent.class}
          onChange={(e) => setNewStudent({ ...newStudent, class: e.target.value })}
          options={classOptions}
          required
        />
        <Input
          icon="fas fa-calendar-alt"
          type="date"
          value={newStudent.dateOfBirth}
          onChange={(e) => setNewStudent({ ...newStudent, dateOfBirth: e.target.value })}
          required
        />
        <button type="submit"><i className="fas fa-plus"></i> Thêm Sinh Viên</button>
      </form>
    </div>
  );
}

export default AddStudentForm;
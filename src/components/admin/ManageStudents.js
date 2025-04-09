import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { updateTuition, deleteTuition, updateStudent, deleteStudent } from '../../utils/api';
import { formatDate } from '../../utils/formatters';
import { PAYMENT_FILTERS } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatters';
import Input from '../common/Input';
import Select from '../common/Select';
import Table from '../common/Table';
import Button from '../common/Button';

function ManageStudents({ token, students, tuitions, classes, onDataUpdated }) {
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [editStudentId, setEditStudentId] = useState(null);
  const [editStudentData, setEditStudentData] = useState({ name: '', class: '', dateOfBirth: '' });
  const [editTuitionId, setEditTuitionId] = useState(null);
  const [editTuitionData, setEditTuitionData] = useState({});
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    let filtered = students;
    if (selectedClass) {
      filtered = filtered.filter(student => student.class === selectedClass);
    } else {
      filtered = [];
    }
    if (paymentFilter !== 'all') {
      filtered = filtered.filter(student => {
        const studentTuitions = tuitions.filter(t => t.studentId === student.username);
        if (paymentFilter === 'paid') return studentTuitions.some(t => t.paid);
        if (paymentFilter === 'unpaid') return studentTuitions.some(t => !t.paid);
        if (paymentFilter === 'overdue') return studentTuitions.some(t => !t.paid && new Date(t.dueDate) < new Date());
        return true;
      });
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(student => 
        student?.username?.toLowerCase().includes(term) || student?.name?.toLowerCase().includes(term)
      );
    }
    filtered.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
    setFilteredStudents(filtered);
  }, [selectedClass, paymentFilter, searchTerm, students, tuitions]);

  const handleStudentEditChange = (e, field) => {
    setEditStudentData({ ...editStudentData, [field]: e.target.value });
  };

  const handleTuitionEditChange = (e, field) => {
    setEditTuitionData({ ...editTuitionData, [field]: e.target.value });
  };

  const startEditStudent = (student) => {
    setEditStudentId(student._id);
    setEditStudentData({
      name: student.name,
      class: student.class,
      dateOfBirth: student.dateOfBirth.split("T")[0],
    });
  };

  const updateStudentHandler = async (e, id) => {
    e.preventDefault();
    try {
      const res = await updateStudent(id, editStudentData, token);
      toast.success(res.data.message);
      setEditStudentId(null);
      onDataUpdated();
    } catch (err) {
      toast.error(err.response?.data.message || 'Lỗi khi cập nhật sinh viên');
    }
  };

  const deleteStudentHandler = async (id) => {
    try {
      const res = await deleteStudent(id, token);
      toast.success(res.data.message);
      setSelectedStudent(null);
      onDataUpdated();
    } catch (err) {
      toast.error(err.response?.data.message || 'Lỗi khi xóa sinh viên');
    }
  };

  const updateTuitionHandler = async (e, id) => {
    e.preventDefault();
    try {
      const res = await updateTuition(id, editTuitionData, token);
      toast.success(res.data.message);
      setEditTuitionId(null);
      onDataUpdated();
    } catch (err) {
      toast.error(err.response?.data.message || 'Lỗi khi cập nhật khoản nợ');
    }
  };

  const deleteTuitionHandler = async (id) => {
    try {
      const res = await deleteTuition(id, token);
      toast.success(res.data.message);
      onDataUpdated();
    } catch (err) {
      toast.error(err.response?.data.message || 'Lỗi khi xóa khoản nợ');
    }
  };

  const classOptions = [{ value: '', label: 'Chọn lớp' }, ...classes.map(c => ({ value: c.name, label: c.name }))];
  const filterOptions = Object.entries(PAYMENT_FILTERS).map(([value, label]) => ({ value, label }));

  return (
    <div className="tab-content">
      <h2 className="section-title"><i className="fas fa-users"></i> Quản Lý Sinh Viên</h2>
      <div className="filter-container">
        <Select
          icon="fas fa-school"
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          options={classOptions}
        />
        <Select
          icon="fas fa-filter"
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
          options={filterOptions}
        />
      </div>
      {selectedClass && (
        <Table headers={['Mã Sinh Viên', 'Tên', 'Lớp', 'Ngày Sinh', 'Trạng Thái Thanh Toán', 'Thao Tác']}>
          {filteredStudents.map(s => {
            const studentTuitions = tuitions.filter(t => t.studentId === s.username);
            const allPaid = studentTuitions.every(t => t.paid);
            const hasOverdue = studentTuitions.some(t => !t.paid && new Date(t.dueDate) < new Date());

            return (
              <React.Fragment key={s._id}>
                <tr onClick={() => setSelectedStudent(selectedStudent?._id === s._id ? null : s)}
                    className={selectedStudent?._id === s._id ? 'selected-row' : ''}>
                  <td>{s.username}</td>
                  <td>
                    {editStudentId === s._id ? (
                      <Input value={editStudentData.name} onChange={(e) => handleStudentEditChange(e, 'name')} />
                    ) : s.name}
                  </td>
                  <td>
                    {editStudentId === s._id ? (
                      <Select
                        value={editStudentData.class}
                        onChange={(e) => handleStudentEditChange(e, 'class')}
                        options={classOptions}
                      />
                    ) : s.class}
                  </td>
                  <td>
                    {editStudentId === s._id ? (
                      <Input
                        type="date"
                        value={editStudentData.dateOfBirth}
                        onChange={(e) => handleStudentEditChange(e, 'dateOfBirth')}
                      />
                    ) : formatDate(s.dateOfBirth)}
                  </td>
                  <td>
                    {allPaid ? (
                      <span className="status-paid"><i className="fas fa-check"></i> Đã thanh toán</span>
                    ) : hasOverdue ? (
                      <span className="status-overdue"><i className="fas fa-exclamation-triangle"></i> Quá hạn</span>
                    ) : (
                      <span className="status-unpaid"><i className="fas fa-times"></i> Chưa thanh toán</span>
                    )}
                  </td>
                  <td>
                    <div className="table-actions">
                      {editStudentId === s._id ? (
                        <>
                          <Button className="edit-btn" onClick={(e) => updateStudentHandler(e, s._id)}>
                            <i className="fas fa-save"></i> Lưu
                          </Button>
                          <Button className="delete-btn" onClick={() => setEditStudentId(null)}>
                            <i className="fas fa-times"></i> Hủy
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button className="edit-btn" onClick={() => startEditStudent(s)}>
                            <i className="fas fa-edit"></i> Sửa
                          </Button>
                          <Button className="delete-btn" onClick={() => deleteStudentHandler(s._id)}>
                            <i className="fas fa-trash"></i> Xóa
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
                {selectedStudent?._id === s._id && (
                  <tr>
                    <td colSpan="6">
                      <div className="tuition-details">
                        <h4>Khoản Nợ Của {s.name} ({s.username})</h4>
                        <Table headers={['Mô Tả', 'Số Tiền (USD)', 'Hạn Nộp', 'Trạng Thái', paymentFilter === 'paid' ? 'Ngày Thanh Toán' : 'Thao Tác']}>
                          {tuitions.filter(t => t.studentId === s.username)
                            .filter(t => paymentFilter === 'paid' ? t.paid : paymentFilter === 'unpaid' ? !t.paid : paymentFilter === 'overdue' ? !t.paid && new Date(t.dueDate) < new Date() : true)
                            .map(t => (
                              <tr key={t._id}>
                                <td>
                                  {editTuitionId === t._id ? (
                                    <Input
                                      value={editTuitionData.description}
                                      onChange={(e) => handleTuitionEditChange(e, 'description')}
                                    />
                                  ) : t.description}
                                </td>
                                <td>
                                  {editTuitionId === t._id ? (
                                    <Input
                                      type="number"
                                      value={editTuitionData.amount}
                                      onChange={(e) => handleTuitionEditChange(e, 'amount')}
                                    />
                                  ) : formatCurrency(t.amount)}
                                </td>
                                <td>
                                  {editTuitionId === t._id ? (
                                    <Input
                                      type="date"
                                      value={editTuitionData.dueDate?.split('T')[0]}
                                      onChange={(e) => handleTuitionEditChange(e, 'dueDate')}
                                    />
                                  ) : formatDate(t.dueDate)}
                                </td>
                                <td className={t.paid ? 'status-paid' : 'status-unpaid'}>
                                  <i className={t.paid ? 'fas fa-check' : 'fas fa-times'}></i> {t.paid ? 'Đã thanh toán' : 'Chưa thanh toán'}
                                </td>
                                <td>
                                  {paymentFilter === 'paid' ? (
                                    formatDate(t.paidDate) + ' ' + new Date(t.paidDate).toLocaleTimeString()
                                  ) : !t.paid && (
                                    <div className="table-actions">
                                      {editTuitionId === t._id ? (
                                        <>
                                          <Button className="edit-btn" onClick={(e) => updateTuitionHandler(e, t._id)}>
                                            <i className="fas fa-save"></i> Lưu
                                          </Button>
                                          <Button className="delete-btn" onClick={() => setEditTuitionId(null)}>
                                            <i className="fas fa-times"></i> Hủy
                                          </Button>
                                        </>
                                      ) : (
                                        <>
                                          <Button className="edit-btn" onClick={() => { setEditTuitionId(t._id); setEditTuitionData(t); }}>
                                            <i className="fas fa-edit"></i> Sửa
                                          </Button>
                                          <Button className="delete-btn" onClick={() => deleteTuitionHandler(t._id)}>
                                            <i className="fas fa-trash"></i> Xóa
                                          </Button>
                                        </>
                                      )}
                                    </div>
                                  )}
                                </td>
                              </tr>
                            ))}
                        </Table>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </Table>
      )}
    </div>
  );
}

export default ManageStudents;
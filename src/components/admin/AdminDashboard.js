import React, { useState } from 'react';
import { useFetchData } from '../../hooks/useFetchData';
import { fetchAdminData, fetchAdminClasses } from '../../utils/api';
import { useAuth } from '../../hooks/useAuth';
import AddStudentForm from './AddStudentForm';
import AddClassForm from './AddClassForm';
import AddTuitionForm from './AddTuitionForm';
import ManageStudents from './ManageStudents';

function AdminDashboard({ handleLogout }) {
  const { token } = useAuth();
  const { data: adminData, refetch: refetchAdminData } = useFetchData(fetchAdminData, token);
  const { data: classesData, refetch: refetchClasses } = useFetchData(fetchAdminClasses, token);
  const [activeTab, setActiveTab] = useState('addStudent');

  const students = adminData?.students || [];
  const tuitions = adminData?.tuitions || [];
  const classes = classesData || [];

  const handleDataUpdate = () => {
    refetchAdminData();
    refetchClasses();
  };

  return (
    <div className="dashboard">
      <h1><i className="fas fa-user-shield"></i> Dashboard Admin</h1>
      <button onClick={handleLogout} className="logout-btn">
        <i className="fas fa-sign-out-alt"></i> Đăng Xuất
      </button>
      <div className="tabs">
        <button className={activeTab === 'addStudent' ? 'tab active' : 'tab'} onClick={() => setActiveTab('addStudent')}>
          <i className="fas fa-user-plus"></i> Thêm Sinh Viên
        </button>
        <button className={activeTab === 'addClass' ? 'tab active' : 'tab'} onClick={() => setActiveTab('addClass')}>
          <i className="fas fa-school"></i> Thêm Lớp Học
        </button>
        <button className={activeTab === 'addTuition' ? 'tab active' : 'tab'} onClick={() => setActiveTab('addTuition')}>
          <i className="fas fa-money-bill-wave"></i> Thêm Khoản Nợ
        </button>
        <button className={activeTab === 'manageStudents' ? 'tab active' : 'tab'} onClick={() => setActiveTab('manageStudents')}>
          <i className="fas fa-users"></i> Quản Lý Sinh Viên
        </button>
      </div>

      {activeTab === 'addStudent' && (
        <AddStudentForm token={token} classes={classes} onStudentAdded={handleDataUpdate} />
      )}
      {activeTab === 'addClass' && (
        <AddClassForm token={token} onClassAdded={handleDataUpdate} />
      )}
      {activeTab === 'addTuition' && (
        <AddTuitionForm token={token} classes={classes} onTuitionAdded={handleDataUpdate} />
      )}
      {activeTab === 'manageStudents' && (
        <ManageStudents
          token={token}
          students={students}
          tuitions={tuitions}
          classes={classes}
          onDataUpdated={handleDataUpdate}
        />
      )}
    </div>
  );
}

export default AdminDashboard;
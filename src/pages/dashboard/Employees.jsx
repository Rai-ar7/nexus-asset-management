import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmp, setEditingEmp] = useState(null);
  const [formData, setFormData] = useState(initialFormState());

  function initialFormState() {
    return { name: '', email: '', department: 'IT', role: 'Employee', password: '' };
  }

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await api.get('/employees');
      setEmployees(res.data);
    } catch (err) {
      toast.error('Failed to load employees');
    }
  };

  const handleOpenModal = (emp = null) => {
    if (emp) {
      setEditingEmp(emp);
      setFormData({
        name: emp.name,
        email: emp.email,
        department: emp.department || 'IT',
        role: emp.role || 'Employee',
        password: '' // password not filled on edit
      });
    } else {
      setEditingEmp(null);
      setFormData(initialFormState());
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEmp) {
        await api.put(`/employees/${editingEmp._id}`, formData);
        toast.success('Employee updated');
      } else {
        await api.post('/employees', formData);
        toast.success('Employee created');
      }
      fetchEmployees();
      closeModal();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await api.delete(`/employees/${id}`);
        toast.success('Employee deleted');
        fetchEmployees();
      } catch (err) {
        toast.error('Failed to delete employee');
      }
    }
  };

  const filtered = employees.filter(e => 
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div style={styles.header}>
        <h2 className="title-2">Employee Management</h2>
        <button className="btn-primary" onClick={() => handleOpenModal()} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} /> Add Employee
        </button>
      </div>

      <div style={styles.controls}>
        <input 
          type="text" 
          placeholder="Search employees..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          style={{ maxWidth: '300px' }}
        />
      </div>

      <div className="nexus-table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan="5" style={{textAlign: 'center'}}>No employees found</td></tr>
            ) : (
              filtered.map(emp => (
                <tr key={emp._id}>
                  <td style={{fontWeight: 500}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                      <div style={styles.avatarMini}>{emp.name.charAt(0)}</div>
                      {emp.name}
                    </div>
                  </td>
                  <td>{emp.email}</td>
                  <td>{emp.department || '-'}</td>
                  <td>{emp.role}</td>
                  <td>
                    <button onClick={() => handleOpenModal(emp)} style={styles.iconBtn}><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(emp._id)} style={{...styles.iconBtn, color: 'var(--accent-red)'}}><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div className="nexus-card" style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3>{editingEmp ? 'Edit Employee' : 'Add New Employee'}</h3>
              <button onClick={closeModal} style={styles.closeBtn}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={styles.label}>Full Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label style={styles.label}>Email Adddress</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              {!editingEmp && (
                <div>
                  <label style={styles.label}>Temporary Password</label>
                  <input required type="text" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                </div>
              )}
              <div>
                <label style={styles.label}>Department</label>
                <select value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})}>
                  <option value="IT">IT</option>
                  <option value="HR">HR</option>
                  <option value="Finance">Finance</option>
                  <option value="Operations">Operations</option>
                  <option value="Sales">Sales</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label style={styles.label}>Role</label>
                <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                  <option value="Manager">Manager</option>
                  <option value="Engineer">Engineer</option>
                  <option value="Analyst">Analyst</option>
                  <option value="Employee">Employee</option>
                </select>
              </div>
              <button type="submit" className="btn-primary" style={{ marginTop: '16px' }}>Save Employee</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px'
  },
  controls: {
    display: 'flex',
    gap: '16px',
    marginBottom: '24px'
  },
  avatarMini: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: 'var(--bg-tertiary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    color: 'var(--accent-blue)'
  },
  iconBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-secondary)',
    padding: '4px 8px',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100
  },
  modalContent: {
    width: '100%',
    maxWidth: '500px',
    backgroundColor: 'var(--bg-tertiary)',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px'
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-secondary)'
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '0.9rem',
    color: 'var(--text-secondary)'
  }
};

export default Employees;

import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Plus, X, CornerDownLeft } from 'lucide-react';

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Data for creation modal
  const [availableAssets, setAvailableAssets] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({ asset: '', employee: '', assignedDate: new Date().toISOString().slice(0,10) });

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const res = await api.get('/assignments');
      setAssignments(res.data);
    } catch (err) {
      toast.error('Failed to load assignments');
    }
  };

  const handleOpenModal = async () => {
    try {
      const [assetsRes, empRes] = await Promise.all([
        api.get('/assets'),
        api.get('/employees')
      ]);
      const avail = assetsRes.data.filter(a => a.status === 'Available');
      setAvailableAssets(avail);
      setEmployees(empRes.data);
      
      setFormData({
        asset: avail.length > 0 ? avail[0]._id : '',
        employee: empRes.data.length > 0 ? empRes.data[0]._id : '',
        assignedDate: new Date().toISOString().slice(0,10)
      });
      setIsModalOpen(true);
    } catch (err) {
      toast.error('Failed to load reference data');
    }
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.asset || !formData.employee) {
      return toast.error('Please select both asset and employee');
    }
    
    try {
      await api.post('/assignments', formData);
      toast.success('Asset assigned successfully');
      fetchAssignments();
      closeModal();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Assignment failed');
    }
  };

  const handleReturn = async (id) => {
    if (window.confirm('Mark this asset as returned?')) {
      try {
        await api.put(`/assignments/${id}/return`);
        toast.success('Asset returned successfully');
        fetchAssignments();
      } catch (err) {
        toast.error('Failed to return asset');
      }
    }
  };

  return (
    <div>
      <div style={styles.header}>
        <h2 className="title-2">Asset Assignments</h2>
        <button className="btn-primary" onClick={handleOpenModal} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} /> New Assignment
        </button>
      </div>

      <div className="nexus-table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Asset</th>
              <th>Employee</th>
              <th>Assigned Date</th>
              <th>Return Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {assignments.length === 0 ? (
              <tr><td colSpan="6" style={{textAlign: 'center'}}>No assignments recorded</td></tr>
            ) : (
              assignments.map(assign => (
                <tr key={assign._id}>
                  <td>
                    <div style={{fontWeight: 500}}>{assign.asset?.name || 'Deleted Asset'}</div>
                    <div style={{fontSize: '0.8rem', color: 'var(--text-secondary)'}}>{assign.asset?.serialNumber}</div>
                  </td>
                  <td>
                    <div>{assign.employee?.name || 'Deleted User'}</div>
                  </td>
                  <td>{new Date(assign.assignedDate).toLocaleDateString()}</td>
                  <td>{assign.returnDate ? new Date(assign.returnDate).toLocaleDateString() : '-'}</td>
                  <td><span className={`badge ${assign.status === 'Active' ? 'assigned' : 'available'}`}>{assign.status}</span></td>
                  <td>
                    {assign.status === 'Active' && (
                      <button className="btn-outline" onClick={() => handleReturn(assign._id)} style={{padding: '6px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px'}}>
                        <CornerDownLeft size={14} /> Return
                      </button>
                    )}
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
              <h3>New Asset Assignment</h3>
              <button onClick={closeModal} style={styles.closeBtn}><X size={20} /></button>
            </div>
            
            {availableAssets.length === 0 ? (
              <p style={{color: 'var(--accent-amber)', padding: '20px 0'}}>There are no available assets to assign.</p>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={styles.label}>Select Asset</label>
                  <select required value={formData.asset} onChange={e => setFormData({...formData, asset: e.target.value})}>
                    {availableAssets.map(a => (
                      <option key={a._id} value={a._id}>{a.name} ({a.serialNumber})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={styles.label}>Select Employee</label>
                  <select required value={formData.employee} onChange={e => setFormData({...formData, employee: e.target.value})}>
                    {employees.map(e => (
                      <option key={e._id} value={e._id}>{e.name} - {e.department}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={styles.label}>Assigned Date</label>
                  <input required type="date" value={formData.assignedDate} onChange={e => setFormData({...formData, assignedDate: e.target.value})} />
                </div>
                <button type="submit" className="btn-primary" style={{ marginTop: '16px' }}>Assign Asset</button>
              </form>
            )}
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

export default Assignments;

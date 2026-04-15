import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

const Assets = () => {
  const [assets, setAssets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);
  const [formData, setFormData] = useState(initialFormState());

  function initialFormState() {
    return { name: '', category: 'Laptop', serialNumber: '', status: 'Available' };
  }

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      const res = await api.get('/assets');
      setAssets(res.data);
    } catch (err) {
      toast.error('Failed to load assets');
    }
  };

  const handleOpenModal = (asset = null) => {
    if (asset) {
      setEditingAsset(asset);
      setFormData({
        name: asset.name,
        category: asset.category,
        serialNumber: asset.serialNumber,
        status: asset.status
      });
    } else {
      setEditingAsset(null);
      setFormData(initialFormState());
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAsset) {
        await api.put(`/assets/${editingAsset._id}`, formData);
        toast.success('Asset updated');
      } else {
        await api.post('/assets', formData);
        toast.success('Asset created');
      }
      fetchAssets();
      closeModal();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you confirm to delete this asset?')) {
      try {
        await api.delete(`/assets/${id}`);
        toast.success('Asset deleted');
        fetchAssets();
      } catch (err) {
        toast.error('Failed to delete asset');
      }
    }
  };

  const filteredAssets = assets.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          a.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'All' || a.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div>
      <div style={styles.header}>
        <h2 className="title-2">Asset Management</h2>
        <button className="btn-primary" onClick={() => handleOpenModal()} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} /> Add Asset
        </button>
      </div>

      <div style={styles.controls}>
        <input 
          type="text" 
          placeholder="Search by name or serial..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          style={{ maxWidth: '300px' }}
        />
        <select 
          value={filterStatus} 
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{ maxWidth: '200px' }}
        >
          <option value="All">All Statuses</option>
          <option value="Available">Available</option>
          <option value="Assigned">Assigned</option>
          <option value="Repair">Repair</option>
        </select>
      </div>

      <div className="nexus-table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Asset Name</th>
              <th>Category</th>
              <th>Serial Number</th>
              <th>Status</th>
              <th>Assigned To</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAssets.length === 0 ? (
              <tr><td colSpan="6" style={{textAlign: 'center'}}>No assets found</td></tr>
            ) : (
              filteredAssets.map(asset => (
                <tr key={asset._id}>
                  <td style={{fontWeight: 500}}>{asset.name}</td>
                  <td>{asset.category}</td>
                  <td><span style={{fontFamily: 'monospace', color: 'var(--text-secondary)'}}>{asset.serialNumber}</span></td>
                  <td><span className={`badge ${asset.status.toLowerCase()}`}>{asset.status}</span></td>
                  <td>{asset.assignedTo ? asset.assignedTo.name : '-'}</td>
                  <td>
                    <button onClick={() => handleOpenModal(asset)} style={styles.iconBtn}><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(asset._id)} style={{...styles.iconBtn, color: 'var(--accent-red)'}}><Trash2 size={16} /></button>
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
              <h3>{editingAsset ? 'Edit Asset' : 'Add New Asset'}</h3>
              <button onClick={closeModal} style={styles.closeBtn}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={styles.label}>Asset Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label style={styles.label}>Category</label>
                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                  <option value="Laptop">Laptop</option>
                  <option value="Monitor">Monitor</option>
                  <option value="Printer">Printer</option>
                  <option value="Server">Server</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label style={styles.label}>Serial Number</label>
                <input required type="text" value={formData.serialNumber} onChange={e => setFormData({...formData, serialNumber: e.target.value})} />
              </div>
              <div>
                <label style={styles.label}>Status</label>
                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                  <option value="Available">Available</option>
                  <option value="Assigned">Assigned</option>
                  <option value="Repair">Repair</option>
                </select>
              </div>
              <button type="submit" className="btn-primary" style={{ marginTop: '16px' }}>Save Asset</button>
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

export default Assets;

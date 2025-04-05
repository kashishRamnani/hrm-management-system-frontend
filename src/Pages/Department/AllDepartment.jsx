import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../src/context/AuthContext';
import { Department } from '../../../src/utils/Department';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DeleteConfirmationModal from '../../../src/Components/DelectModel';
import BackButton from '../../../src/Components/Backbutton/Backbutton';
export default function DepartmentList() {
  const { user } = useAuth();
  const [departments, setDepartments] = useState([]);
  const [message, setMessage] = useState('');
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDepartment, setNewDepartment] = useState({ title: '' });
  const [errors, setErrors] = useState({});
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState(null);

  
  const showToast = (type, message) => {
    type === 'success' ? toast.success(message) : toast.error(message);
  };

  const handleEditClick = (department) => {
    setEditingDepartment({ ...department });
  };

  const handleChange = (e) => {
    setEditingDepartment((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
 
  const handleSaveChanges = () => {
    setLoading(true);
    Department.update(user.token, editingDepartment, setMessage, setLoading)
      .then(() => {
        showToast('success', 'Department updated successfully!');
        setEditingDepartment(null);
        setMessage('');
      })
      .catch((err) => showToast('error', `Failed to save changes: ${err.message}`))
      .finally(() => setLoading(false));
  };

  const handleInputChange = (e) => {
    setNewDepartment({
      ...newDepartment,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newDepartment.title.trim()) {
      setLoading(true);
      Department.add(user.token, newDepartment, setMessage, setLoading)
        .then(() => {
          showToast('success', 'Department added successfully!');
          setNewDepartment({ title: '' });
          setShowAddForm(false);
          
          setDepartments((prev) => [...prev, { ...newDepartment, id: Date.now() }]); // Assuming the new department has an id
        })
        .catch((err) => showToast('error', `Failed to add department: ${err.message}`))
        .finally(() => setLoading(false));
    } else {
      setErrors({ title: ['Department title is required.'] });
    }
  };
  

  const handleDeleteClick = (department) => {
    setDepartmentToDelete(department);
    setIsDeleteModalVisible(true);
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalVisible(false);
    setDepartmentToDelete(null);
  };

  const handleDeleteConfirm = () => {
    if (departmentToDelete) {
      setLoading(true);
      Department.delete(departmentToDelete.id, user.token, setMessage)
        .then(() => {
          showToast('success', 'Department deleted successfully!');
          setDepartments((prev) => prev.filter((d) => d.id !== departmentToDelete.id));
        })
        .catch((err) => showToast('error', `Failed to delete department: ${err.message}`))
        .finally(() => {
          setLoading(false);
          setIsDeleteModalVisible(false);
          setDepartmentToDelete(null);
        });
    }
  };

  useEffect(() => {
    if (user.token) {
      setLoading(true);
      Department.all(user.token, setDepartments, setMessage, setLoading)
        .catch((err) => showToast('error', `Failed to load data: ${err.message}`))
        .finally(() => setLoading(false));
    }
  }, [user.token]);

  return (
    <div className="container my-4">
       <BackButton/>
      <h4 className="text-center mb-3 fw-bold" style={{ color: "#49266a" }}>
        All Departments
      </h4>

      <div className="d-flex justify-content-end mb-3">
        <button
          onClick={() => setShowAddForm((prev) => !prev)}
          className="btn text-white mb-3"
          style={{ backgroundColor: '#49266a' }}
        >
          {showAddForm ? 'Close Add Department Form' : 'Add Department'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="mb-3">
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Department Title:
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={newDepartment.title}
              onChange={handleInputChange}
              placeholder="Enter department title"
              className="form-control"
            />
            {errors['title'] && (
              <p style={{ color: 'red' }}>{errors['title'][0]}</p>
            )}
          </div>
          <div className="d-flex justify-content-end">
            <button
              type="submit"
              className="btn btn-success px-4"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-striped align-middle">
            <thead className="text-white" style={{ backgroundColor: '#49266a' }}>
              <tr>
                <th>Department Title</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {departments.length > 0 ? (
                departments.map((department,index) => (
                  <tr key={index}>
                    <td>
                      {editingDepartment?.id === department.id ? (
                        <input
                          type="text"
                          name="title"
                          value={editingDepartment.title ?? ''}
                          onChange={handleChange}
                          className="form-control form-control-sm"
                        />
                      ) : (
                        department.title ?? 'N/A'
                      )}
                    </td>
                    <td>
                      {editingDepartment?.id === department.id ? (
                        <>
                          <button
                            onClick={handleSaveChanges}
                            className="btn btn-success btn-sm me-2 rounded-3"
                            style={{ backgroundColor: '#49266a' }}
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingDepartment(null)}
                            className="btn btn-secondary btn-sm rounded-3"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEditClick(department)}
                            className="primary-btn btn-sm mx-2"
                            style={{ backgroundColor: '#49266a' }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteClick(department)}
                            className="btn btn-danger btn-sm rounded-3"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="text-danger" colSpan="2">
                    No departments available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <DeleteConfirmationModal
        isVisible={isDeleteModalVisible}
        departmentToDelete={departmentToDelete}
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
      />

      <ToastContainer />
    </div>
  );
}

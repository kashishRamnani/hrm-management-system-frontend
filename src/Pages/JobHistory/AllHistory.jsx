import React, { useState, useEffect } from "react";
import { useAuth } from "../../../src/context/AuthContext";
import { JobHistory, Positions } from "../../../src/utils/JobHistory";
import { Department } from "../../../src/utils/Department";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DeleteConfirmationModal from "../../../src/Components/DelectModel";
import BackButton from "../../../src/Components/Backbutton/Backbutton";
export default function AllJobHistory() {
    const [jobHistory, setJobHistory] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [positions, setPositions] = useState([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [editingJobId, setEditingJobId] = useState(null);
    const [editedFields, setEditedFields] = useState({});
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [departmentToDelete, setDepartmentToDelete] = useState(null);
    const { user } = useAuth();

    const handleEditClick = (job) => {
        setEditingJobId(job.id);
        setEditedFields(job);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedFields((prev) => ({ ...prev, [name]: value }));
    };

    const handleSaveChanges = (id) => {
        JobHistory.update(id, user.token, editedFields, setMessage, setEditingJobId);
    };

    const handleDelete = (id) => {
        setIsDeleteModalVisible(true);
        setDepartmentToDelete(id);
    };

    const handleDeleteCancel = () => {
        setIsDeleteModalVisible(false);
        setDepartmentToDelete(null);
    };

    const handleDeleteConfirm = () => {
        if (departmentToDelete) {
            JobHistory.delete(departmentToDelete, user.token, setMessage)
                .then(() => {
                    setMessage("Record deleted successfully!");  // Set success message
                    setJobHistory((prev) => prev.filter((job) => job.id !== departmentToDelete));
                    toast.success("Record deleted successfully!");  // Toast for success
                })
                .catch((err) => {
                    setMessage("Failed to delete record: " + err.message);  // Set error message
                    toast.error("Failed to delete record");
                });
        }
        setIsDeleteModalVisible(false);
    };

    useEffect(() => {
        if (user.token) {
            setLoading(true);
            JobHistory.all(user.token, setJobHistory)
                .then(() => setLoading(false))
                .catch((err) => {
                    setMessage("Failed to load data: " + err.message);
                    setLoading(false);
                    toast.error("Failed to load data");
                });
        }

        Department.all(user.token, setDepartments, setMessage, setLoading);
        Positions.all(user.token, setPositions);
    }, [user.token]);

    return (
        <div>
            {loading ? (
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                <>


                    {!loading && jobHistory.length > 0 && (
                        <div className="container my-2">
                             <BackButton/>
                            <div className="card card-body">
                            <h4
                                className=" text-center mb-3 fw-bold"
                                style={{ color: "#49266a" }}
                            >
                                Job History
                            </h4>
                            <table className="table table-striped table-bordered">
                                <thead className="thead-dark">
                                    <tr>
                                        <th>Name</th>
                                        <th>Position</th>
                                        <th>Department</th>
                                        <th>Status</th>
                                        <th>Employment From</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {jobHistory.map((job) => (
                                        <tr key={job.id}>
                                            <td>
                                                {job.employee.first_name} {job.employee.last_name}
                                            </td>
                                            <td>
                                                {editingJobId === job.id ? (
                                                    <select name="position_id" className="form-control" onChange={handleInputChange}>
                                                        {positions.map((pos) => (
                                                            <option
                                                                key={pos.id}
                                                                value={pos.id}
                                                                selected={pos.id === editedFields.position.id}
                                                            >
                                                                {pos.job_position}
                                                            </option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    job.position.job_position
                                                )}
                                            </td>
                                            <td>
                                                {editingJobId === job.id ? (
                                                    <select name="department_id" className="form-control" onChange={handleInputChange}>
                                                        {departments.map((dept) => (
                                                            <option
                                                                key={dept.id}
                                                                value={dept.id}
                                                                selected={dept.title === editedFields.department.title}
                                                            >
                                                                {dept.title}
                                                            </option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    job.department.title
                                                )}
                                            </td>
                                            <td>
                                                {editingJobId === job.id ? (
                                                    <select onChange={handleInputChange} className="form-control" name="status">
                                                        <option value="latest" defaultValue={editingJobId.status == 'latest'}>Latest</option>
                                                        <option value="previous" defaultValue={editingJobId.status == 'previous'}>Previous</option>
                                                    </select>
                                                ) : (
                                                    job.status
                                                )}
                                            </td>
                                            <td>
                                                {editingJobId === job.id ? (
                                                    <input
                                                        type="date"
                                                        name="employment_from"
                                                        value={editedFields.employment_from || ""}
                                                        onChange={handleInputChange}
                                                        className="form-control"
                                                    />
                                                ) : (
                                                    job.employment_from
                                                )}
                                            </td>
                                            <td>
                                                {editingJobId === job.id ? (
                                                    <>
                                                        <button
                                                            onClick={() => handleSaveChanges(job.id)}
                                                            className="primary-btn btn-sm mr-2"
                                                        >
                                                            Save
                                                        </button>
                                                        <button
                                                            onClick={() => setEditingJobId(null)}
                                                            className="btn btn-secondary btn-sm"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={() => handleEditClick(job)}
                                                            className="btn text-white btn-sm me-2 rounded-3"
                                                            style={{ backgroundColor: "#49266a" }}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(job.id)}
                                                            className="btn btn-danger btn-sm"
                                                        >
                                                            Delete
                                                        </button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            </div>
                        </div>
                    )}
                    <DeleteConfirmationModal
                        isVisible={isDeleteModalVisible}
                        onCancel={handleDeleteCancel}
                        onConfirm={handleDeleteConfirm}
                    />
                    <ToastContainer />
                </>
            )}
        </div>
    );
}

import React, { useEffect, useState } from "react";
import { useAuth } from "../../../src/context/AuthContext";
import { Department } from "../../../src/utils/Department";

export default function Departments() {
    const [departments, setDepartments] = useState([]);
    const [newDepartment, setNewDepartment] = useState({ title: "" });
    const [message, setMessage] = useState("");
    const [errors, setErrors] = useState({});
    const { user } = useAuth();

    const handleInputChange = (e) => {
        setNewDepartment({
            ...newDepartment,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newDepartment.title) {
            Department.add(user.token, newDepartment, setMessage, setErrors);
        } else {
            setMessage("Department title is required.");
        }
    };


    useEffect(() => {
        if (user.token) {
            Department.all(user.token, setDepartments, setMessage);
        }
    }, [user.token]);

    return (
        <div>
            <h1>Manage Departments</h1>
            {/* {message && <p>{message}</p>} */}

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title">Department Title:</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={newDepartment.title}
                        onChange={handleInputChange}
                        placeholder="Enter department title"
                    />
                    {errors['title'] && errors['title'][0]}
                </div>
                <button type="submit" className="btn btn-success">
                    Submit
                </button>
            </form>

            <h3>Existing Departments</h3>
            <ul>
                {departments.length > 0 ? (
                    departments.map((dept, index) => (
                        <li key={index}>
                            <strong>{dept.title}</strong>
                        </li>
                    ))
                ) : (
                    <p>No departments available.</p>
                )}
            </ul>
        </div>
    );
}

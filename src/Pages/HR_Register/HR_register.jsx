import React, { useState, useEffect } from 'react';
import { HR } from "../../../src/utils/HRRegister";
import { useAuth } from '../../../src/context/AuthContext';
import { validationSchema } from '../../../src/context/ValidationSchema';
import { useNavigate } from 'react-router-dom'; 
import { ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import BackButton from '../../../src/Components/Backbutton/Backbutton';

export default function HR_register() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate(); 

  const [newHR, setNewHR] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    name: [],
    email: [],
    password: [],
  });

  const [passwordVisible, setPasswordVisible] = useState(false);

  const validateForm = () => {
    let formErrors = { name: [], email: [], password: [] };
    try {
      validationSchema.validateSync(newHR, { abortEarly: false });
      setErrors(formErrors);
      return true;
    } catch (err) {
      err.inner.forEach((fieldError) => {
        formErrors[fieldError.path] = [fieldError.message];
      });
      setErrors(formErrors);
      return false;
    }
  };

 

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setNewHR({
      ...newHR,
      [id]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const token = user.token;
      if (!token) {
        throw new Error('User token is missing');
      }

      await HR.register(token, newHR, setMessage, setErrors);

      setNewHR({ name: "", email: "", password: "" });
      setError('');

      setTimeout(() => {
        setMessage('');
        
        navigate('/admin/all-hr');  
      }, 5000);

    } catch (err) {
      setError(err.message || 'Failed to register HR');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const token = user?.token;
    if (!token) {
      setError('User token is missing');
    }
  }, [user]);

  return (
    <div className="container my-4">
       <BackButton/>
      <div className="d-flex row justify-content-center">
        <div className="col-lg-8 col-md-6 col-sm-8">
          <div className="card shadow border">
            <div className="card-body py-4 shadow">
              <h3
                className="text-center text-uppercase fw-bold "
                style={{ color: "#49266a"}}
              >
                Register HR
              </h3>

              {/* Display Toast Notifications */}
              <ToastContainer />

              <form className="mt-4" onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label
                    htmlFor="name"
                    className="form-label fw-semibold"
                    style={{ fontSize: "0.875rem" }}
                  >
                    Full Name
                  </label>
                  <input
                    className="form-control "
                    type="text"
                    id="name"
                    value={newHR.name}
                    onChange={handleInputChange}
                    placeholder="Enter your Name"
                  />
                  {errors.name && errors.name.map((msg, idx) => (
                    <small key={idx} className="text-danger">{msg}</small>
                  ))}
                </div>

                <div className="mb-3">
                  <label
                    htmlFor="email"
                    className="form-label fw-semibold"
                    style={{ fontSize: "0.875rem" }}
                  >
                    Email Address
                  </label>
                  <input
                    className="form-control "
                    type="email"
                    id="email"
                    value={newHR.email}
                    onChange={handleInputChange}
                    placeholder="Enter your Email"
                  />
                  {errors.email && errors.email.map((msg, idx) => (
                    <small key={idx} className="text-danger">{msg}</small>
                  ))}
                </div>

                <div className="mb-3">
                  <label
                    htmlFor="password"
                    className="form-label fw-semibold"
                    style={{ fontSize: "0.875rem" }}
                  >
                    Password
                  </label>
                  <div className="input-group w-100">
                    <input
                      className="form-control "
                      type={passwordVisible ? "text" : "password"}
                      id="password"
                      value={newHR.password}
                      onChange={handleInputChange}
                      placeholder="Enter your Password"
                    />
                    <button
                      type="button"
                      className="btn btn-light btn-sm"
                      onClick={togglePasswordVisibility}
                    >
                      {passwordVisible ? (
                        <i className="far fa-eye-slash"></i>
                      ) : (
                        <i className="far fa-eye"></i>
                      )}
                    </button>
                  </div>
                  {errors.password && errors.password.map((msg, idx) => (
                    <small key={idx} className="text-danger">{msg}</small>
                  ))}
                </div>

                <div className="d-flex justify-content-center">
                  <button
                    className="btn w-50 text-white shadow-sm"
                    style={{
                      backgroundColor: "#49266a",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                    type="submit"
                  >
                    {isSubmitting ? 'Submitting...' : 'Register HR'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

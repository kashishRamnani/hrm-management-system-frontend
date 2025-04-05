import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { validationSchema } from '../../context/ValidationSchema';
import { SelfHR } from '../../utils/SelfHR';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RegisterForm = () => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);  // Add state for password visibility

  const handleSubmit = async (values, { setSubmitting }) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      await SelfHR.register(token, values, setMessage);
    } catch (error) {
      setMessage('An error occurred during registration');
    } finally {
      setSubmitting(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (message) {
      if (message.toLowerCase().includes('error')) {
        toast.error(message);  
      } else {
        toast.success(message);  
      }

      const timer = setTimeout(() => setMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);  

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);  // Toggle password visibility
  };

  return (
    <div className="authentication-bg d-flex ">
      <div className="container my-5">
        <div className="row justify-content-center">
          <div className="col-lg-4 col-md-6 col-sm-6">
            <div
              className="card shadow-sm border-0"
              style={{ borderRadius: "50px" }}
            >
              <div className="card-body p-4">
                <div className="account-box">
                  <div className="account-logo-box text-center">
                    <a href="/">
                      <img src="/src/assets/images/Logo/Dark_logo.png" alt="logo" height="100" width="170" />
                    </a>
                    <h5 className="text-uppercase mb-1 mt-3" >
                      Register
                    </h5>
                    <p style={{ fontSize: "0.875rem" }}>Get access to your account</p>
                  </div>

                  <Formik
                    initialValues={{ name: '', email: '', password: '' }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                  >
                    {({ isSubmitting }) => (
                      <Form>
                        <div className="mb-3">
                          <label htmlFor="name" className="form-label fw-semibold" style={{ fontSize: "0.875rem" }}>
                            Full Name <span className="text-danger">*</span>
                          </label>
                          <Field
                            className="form-control form-control-sm py-2"
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Enter your Name"
                          />
                          <ErrorMessage name="name" component="div" className="text-danger" />
                        </div>

                        <div className="mb-3">
                          <label htmlFor="email" className="form-label fw-semibold" style={{ fontSize: "0.875rem" }}>
                            Email address <span className="text-danger">*</span>
                          </label>
                          <Field
                            className="form-control form-control-sm py-2"
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter your Email"
                          />
                          <ErrorMessage name="email" component="div" className="text-danger" />
                        </div>

                        <div className="mb-3">
                          <label htmlFor="password" className="form-label fw-semibold" style={{ fontSize: "0.875rem" }}>
                            Password <span className="text-danger">*</span>
                          </label>
                          <div className='position-relative w-100'>
                            <Field
                              className="form-control form-control-sm pe-5 py-2"
                              type={passwordVisible ? "text" : "password"}  // Toggle password visibility
                              id="password"
                              name="password"
                              placeholder="Enter your password"
                            />
                            <button
                              type="button"
                              className="btn position-absolute top-50 end-0 translate-middle-y pe-3"
                              onClick={togglePasswordVisibility}
                              style={{ border: "none", background: "transparent" }}
                            >
                              {passwordVisible ? (
                                <i className="far fa-eye-slash"></i>
                              ) : (
                                <i className="far fa-eye"></i>
                              )}
                            </button>
                          </div>
                          <ErrorMessage name="password" component="div" className="text-danger" />
                        </div>

                        <button
                          className="btn w-100 text-white btn-sm py-2"
                          style={{ backgroundColor: "#49266a", cursor: "pointer" }}
                          type="submit"
                          disabled={isSubmitting || isLoading}
                        >
                          {isLoading ? (
                            <>
                              <div className="spinner-border spinner-border-sm me-2" role="status">
                                <span className="visually-hidden">Loading...</span>
                              </div>
                              Signing Up...
                            </>
                          ) : (
                            'Sign Up'
                          )}
                        </button>
                      </Form>
                    )}
                  </Formik>

                  <div className="text-center mt-2">
                    <p className="text-muted mb-0" style={{ fontSize: "0.875rem" }}>
                      Already have an account?
                      <Link to="/signin" className="text-decoration-none ms-1">
                        <b>Sign In</b>
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default RegisterForm;

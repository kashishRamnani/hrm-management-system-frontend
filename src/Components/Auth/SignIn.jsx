import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext'; 
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, setAuth } = useAuth();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    const apiHost = import.meta.env.VITE_REACT_APP_API_HOST;
    if (!apiHost) {
      toast.error('API Host is not configured.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${apiHost}/auth/login`, formData);
      const { access_token, user } = response.data;

      if (access_token && user) {
        setAuth(user.role, access_token, user);

        // Redirect based on user role
        switch (user.role) {
          case 'admin':
            navigate('/admin-dashboard');
            break;
          case 'hr':
            navigate('/hr-dashboard');
            break;
          case 'employee':
            navigate('/employee-dashboard');
            break;
          default:
            toast.error('Access denied.');
            setMessage('Access denied.');
        }
      } else {
        toast.error('Invalid credentials or unexpected response.');
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || 'Something went wrong.');
      } else {
        toast.error('Network error. Please try again later.');
      }
    }

    setLoading(false);
    setTimeout(() => setFormData({ email: '', password: '' }), 5000);
  };

  // Auto-redirect if user is already logged in
  useEffect(() => {
    if (user?.role) {
      switch (user.role) {
        case 'admin':
          navigate('/admin-dashboard');
          break;
        case 'hr':
          navigate('/hr-dashboard');
          break;
        case 'employee':
          navigate('/employee-dashboard');
          break;
        default:
          break;
      }
    }
  }, [user, navigate]);

 
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="authentication-bg d-flex vh-100">
      <div className="container my-5">
        <div className="row justify-content-center">
          <div className="col-lg-4 col-md-6 col-sm-8">
            <div className="card shadow-sm border-0"
            style={{borderRadius: "50px"}}>
              <div className="card-body p-4">
                <div className="account-box text-center">
                  <div className="account-logo-box">
                    <a href="/">
                      <img
                        src="/src/assets/images/Logo/Dark_logo.png"
                        alt="logo"
                        height="100"
                        width="170"
                      />
                    </a>
                  </div>
                  <h6 className="text-uppercase mb-1 mt-3">
                    Welcome Back!
                  </h6>
                  <p className="text-muted mb-4" style={{ fontSize: '0.875rem' }}>
                    Login to Continue
                  </p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="emailaddress" className="form-label fw-semibold" style={{ fontSize: '0.875rem' }}>
                      Email address <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      type="email"
                      id="emailaddress"
                      name="email"
                      className="form-control form-control-sm py-2"
                      placeholder="Enter your Email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="password" className="form-label fw-semibold" style={{ fontSize: '0.875rem' }}>
                      Password <span style={{ color: 'red' }}>*</span>
                    </label>
                    <div className="position-relative w-100">
                      <input
                        type={passwordVisible ? 'text' : 'password'}
                        id="password"
                        name="password"
                        className="form-control form-control-sm pe-5 py-2"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                      <button
                        type="button"
                        className="btn position-absolute top-50 end-0 translate-middle-y pe-3"
                        onClick={togglePasswordVisibility}
                        style={{ border: 'none', background: 'transparent' }}
                      >
                        {passwordVisible ? <i className="far fa-eye-slash"></i> : <i className="far fa-eye"></i>}
                      </button>
                    </div>
                  </div>

                  <div className="mb-3 form-check" style={{ fontSize: '0.875rem' }}>
                    <input type="checkbox" className="form-check-input" id="remember" />
                    <label className="form-check-label" htmlFor="remember">
                      Remember me
                    </label>
                  </div>

                  <div className="d-grid mb-3">
                    <button
                      className="btn w-100 text-white btn-sm py-2"
                      style={{ backgroundColor: '#49266a', cursor: 'pointer' }}
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <div className="spinner-border spinner-border-sm me-2" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                          Signing In...
                        </>
                      ) : (
                        'Sign In'
                      )}
                    </button>
                  </div>
                </form>

                {message && (
                  <p className="mt-3 text-center" style={{ color: 'red' }}>
                    {message}
                  </p>
                )}

                {/* <div className="text-center mt-3">
                  <p className="text-muted" style={{ fontSize: '0.875rem' }}>
                    or Sign In with
                  </p>
                  <button className="btn btn-outline-info me-2 btn-sm">
                    <i className="fab fa-facebook-f"></i>
                  </button>
                  <button className="btn btn-outline-danger me-2 btn-sm">
                    <i className="fab fa-google"></i>
                  </button>
                  <button className="btn btn-outline-dark me-2 btn-sm">
                    <i className="fab fa-github"></i>
                  </button>
                </div> */}

                <div className="text-center mt-2">
                  <p className="mb-0" style={{ fontSize: '0.875rem' }}>
                    Don't have an account?{' '}
                    <Link to="/SignUp" className="text-decoration-none">
                      <b>Sign Up</b>
                    </Link>
                  </p>
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

export default Login;

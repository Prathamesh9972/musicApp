// // src/pages/auth/Register.jsx
// import React, { useState } from 'react';
// import { registerUser } from '../../services/api';

// export default function Register() {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [role, setRole] = useState('student'); // default role
//   const [message, setMessage] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const data = await registerUser({ name, email, password, role });

//     if (data._id) {
//       setMessage('Registration successful! Please login.');
//     } else {
//       setMessage(data.message || 'Registration failed');
//     }
//   };

//   return (
//     <div>
//       <h2>Register</h2>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           placeholder="Full Name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           required
//         /><br />
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         /><br />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         /><br />
//         <select value={role} onChange={(e) => setRole(e.target.value)}>
//           <option value="student">Student</option>
//           <option value="instructor">Instructor</option>
//         </select><br />
//         <button type="submit">Register</button>
//       </form>
//       {message && <p>{message}</p>}
//     </div>
//   );
// }

// src/pages/auth/Register.jsx

// src/pages/auth/Register.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../services/api';

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('student');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Password confirmation check
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const data = await registerUser({ name, email, password, role });
      if (data._id || data.success) {
        setMessage('Registration successful! Redirecting to login...');
        // Clear form on success
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setRole('student');
        // Redirect to login after showing success message
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        // Redirect to login on failure without showing error
        navigate('/login');
      }
    } catch (error) {
      console.error('Registration error:', error);
      // Redirect to login on error without showing error
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" 
         style={{
           background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
           fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
         }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6 col-xl-5">
            <div className="card shadow-lg border-0" 
                 style={{
                   borderRadius: '20px',
                   backdropFilter: 'blur(10px)',
                   background: 'rgba(255, 255, 255, 0.95)'
                 }}>
              <div className="card-body p-5">
                {/* Header */}
                <div className="text-center mb-4">
                  <div className="mb-3">
                    <div className="d-inline-flex align-items-center justify-content-center"
                         style={{
                           width: '60px',
                           height: '60px',
                           background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                           borderRadius: '16px',
                           marginBottom: '1rem'
                         }}>
                      <svg width="28" height="28" fill="white" viewBox="0 0 24 24">
                        <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 4L13.5 7H7V9H13.5L15 12L21 9ZM13.5 5.5C13.8 5.5 14 5.7 14 6S13.8 6.5 13.5 6.5 13 6.3 13 6 13.2 5.5 13.5 5.5M12 7.5C11.2 7.5 10.5 8.2 10.5 9S11.2 10.5 12 10.5 13.5 9.8 13.5 9 12.8 7.5 12 7.5M12 22C17.5 22 22 17.5 22 12S17.5 2 12 2C6.5 2 2 6.5 2 12S6.5 22 12 22Z"/>
                      </svg>
                    </div>
                  </div>
                  <h2 className="fw-bold mb-2" 
                      style={{
                        fontSize: '2rem',
                        color: '#1a202c',
                        letterSpacing: '-0.025em'
                      }}>
                    Create Account
                  </h2>
                  <p className="text-muted mb-0" style={{fontSize: '1.1rem'}}>
                    Join thousands of learners worldwide
                  </p>
                </div>

                <form onSubmit={handleSubmit}>
                  {/* Full Name */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold text-dark mb-2">
                      Full Name
                    </label>
                    <div className="position-relative">
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        placeholder="Enter your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        style={{
                          padding: '0.875rem 1rem 0.875rem 3rem',
                          borderRadius: '12px',
                          border: '2px solid #e2e8f0',
                          fontSize: '1rem',
                          transition: 'all 0.2s ease'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#667eea'}
                        onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                      />
                      <div className="position-absolute" 
                           style={{left: '1rem', top: '50%', transform: 'translateY(-50%)'}}>
                        <svg width="20" height="20" fill="#94a3b8" viewBox="0 0 24 24">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold text-dark mb-2">
                      Email Address
                    </label>
                    <div className="position-relative">
                      <input
                        type="email"
                        className="form-control form-control-lg"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{
                          padding: '0.875rem 1rem 0.875rem 3rem',
                          borderRadius: '12px',
                          border: '2px solid #e2e8f0',
                          fontSize: '1rem',
                          transition: 'all 0.2s ease'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#667eea'}
                        onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                      />
                      <div className="position-absolute" 
                           style={{left: '1rem', top: '50%', transform: 'translateY(-50%)'}}>
                        <svg width="20" height="20" fill="#94a3b8" viewBox="0 0 24 24">
                          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Password */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold text-dark mb-2">
                      Password
                    </label>
                    <div className="position-relative">
                      <input
                        type="password"
                        className="form-control form-control-lg"
                        placeholder="Create a strong password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength="6"
                        style={{
                          padding: '0.875rem 1rem 0.875rem 3rem',
                          borderRadius: '12px',
                          border: '2px solid #e2e8f0',
                          fontSize: '1rem',
                          transition: 'all 0.2s ease'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#667eea'}
                        onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                      />
                      <div className="position-absolute" 
                           style={{left: '1rem', top: '50%', transform: 'translateY(-50%)'}}>
                        <svg width="20" height="20" fill="#94a3b8" viewBox="0 0 24 24">
                          <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                        </svg>
                      </div>
                    </div>
                    <small className="text-muted">Minimum 6 characters</small>
                  </div>

                  {/* Confirm Password */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold text-dark mb-2">
                      Confirm Password
                    </label>
                    <div className="position-relative">
                      <input
                        type="password"
                        className="form-control form-control-lg"
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        style={{
                          padding: '0.875rem 1rem 0.875rem 3rem',
                          borderRadius: '12px',
                          border: '2px solid #e2e8f0',
                          fontSize: '1rem',
                          transition: 'all 0.2s ease'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#667eea'}
                        onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                      />
                      <div className="position-absolute" 
                           style={{left: '1rem', top: '50%', transform: 'translateY(-50%)'}}>
                        <svg width="20" height="20" fill="#94a3b8" viewBox="0 0 24 24">
                          <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Role Selection */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold text-dark mb-2">
                      Account Type
                    </label>
                    <select 
                      className="form-select form-select-lg"
                      value={role} 
                      onChange={(e) => setRole(e.target.value)}
                      style={{
                        padding: '0.875rem 1rem',
                        borderRadius: '12px',
                        border: '2px solid #e2e8f0',
                        fontSize: '1rem',
                        transition: 'all 0.2s ease'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#667eea'}
                      onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                    >
                      <option value="student">🎓 Student - Access courses and materials</option>
                      <option value="instructor">👨‍🏫 Instructor - Create and manage courses</option>
                    </select>
                  </div>

                  {/* Submit Button */}
                  <div className="d-grid mb-3">
                    <button 
                      type="submit" 
                      className="btn btn-lg"
                      disabled={loading}
                      style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '0.875rem',
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        color: 'white',
                        transition: 'all 0.3s ease',
                        transform: 'translateY(0)',
                        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.6)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
                      }}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Creating Account...
                        </>
                      ) : (
                        <>
                          <svg className="me-2" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                          </svg>
                          Create Account
                        </>
                      )}
                    </button>
                  </div>

                  {/* Message Display */}
                  {message && (
                    <div 
                      className={`alert ${
                        message.includes('successful') || message.includes('success') 
                          ? 'alert-success' 
                          : 'alert-danger'
                      } d-flex align-items-center`}
                      style={{
                        borderRadius: '12px',
                        border: 'none',
                        padding: '1rem'
                      }}
                    >
                      {message.includes('successful') || message.includes('success') ? (
                        <svg className="me-2" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                      ) : (
                        <svg className="me-2" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
                        </svg>
                      )}
                      {message}
                    </div>
                  )}
                </form>

                {/* Login Link */}
                <div className="text-center mt-4">
                  <p className="text-muted mb-0">
                    Already have an account?{' '}
                    <button
                      type="button"
                      className="btn btn-link p-0 fw-semibold"
                      onClick={() => navigate('/login')}
                      style={{
                        color: '#667eea',
                        textDecoration: 'none'
                      }}
                    >
                      Sign in here
                    </button>
                  </p>
                </div>

                {/* Terms */}
                <div className="text-center mt-4 pt-3" style={{borderTop: '1px solid #e2e8f0'}}>
                  <small className="text-muted" style={{lineHeight: '1.5'}}>
                    By creating an account, you agree to our{' '}
                    <a href="/terms" className="text-decoration-none" style={{color: '#667eea'}}>
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="/privacy" className="text-decoration-none" style={{color: '#667eea'}}>
                      Privacy Policy
                    </a>
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
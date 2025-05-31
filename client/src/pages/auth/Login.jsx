// // src/pages/auth/Login.jsx
// import React, { useState } from 'react';
// import { loginUser } from '../../services/api';

// export default function Login() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [message, setMessage] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const data = await loginUser({ email, password });

//     if (data.token) {
//       setMessage('Login successful!');
//       // Save token, redirect, etc.
//       localStorage.setItem('token', data.token);
//     } else {
//       setMessage(data.message || 'Login failed');
//     }
//   };

//   return (
//     <div>
//       <h2>Login</h2>
//       <form onSubmit={handleSubmit}>
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
//         <button type="submit">Login</button>
//       </form>
//       {message && <p>{message}</p>}
//     </div>
//   );
// }


// // src/pages/auth/Login.jsx
// import React, { useState } from 'react';
// import { loginUser } from '../../services/api';

// export default function Login() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [message, setMessage] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage('');
    
//     try {
//       const data = await loginUser({ email, password });
      
//       if (data.token) {
//         setMessage('Login successful!');
//         // Save token, redirect, etc.
//         localStorage.setItem('token', data.token);
//         // You might want to redirect here: window.location.href = '/dashboard';
//       } else {
//         setMessage(data.message || 'Login failed');
//       }
//     } catch (error) {
//       setMessage('An error occurred. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
//       <div className="row w-100">
//         <div className="col-md-6 col-lg-4 mx-auto">
//           <div className="card shadow-lg border-0">
//             <div className="card-body p-5">
//               <div className="text-center mb-4">
//                 <h2 className="card-title fw-bold text-primary">Welcome Back</h2>
//                 <p className="text-muted">Please sign in to your account</p>
//               </div>
              
//               <form onSubmit={handleSubmit}>
//                 <div className="mb-3">
//                   <label htmlFor="email" className="form-label">Email Address</label>
//                   <input
//                     type="email"
//                     className="form-control form-control-lg"
//                     id="email"
//                     placeholder="Enter your email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     required
//                   />
//                 </div>
                
//                 <div className="mb-4">
//                   <label htmlFor="password" className="form-label">Password</label>
//                   <input
//                     type="password"
//                     className="form-control form-control-lg"
//                     id="password"
//                     placeholder="Enter your password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                   />
//                 </div>
                
//                 <div className="d-grid mb-3">
//                   <button 
//                     type="submit" 
//                     className="btn btn-primary btn-lg"
//                     disabled={loading}
//                   >
//                     {loading ? (
//                       <>
//                         <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
//                         Signing in...
//                       </>
//                     ) : (
//                       'Sign In'
//                     )}
//                   </button>
//                 </div>
                
//                 {message && (
//                   <div className={`alert ${message.includes('successful') ? 'alert-success' : 'alert-danger'} text-center`} role="alert">
//                     {message}
//                   </div>
//                 )}
//               </form>
              
//               <div className="text-center mt-4">
//                 <p className="text-muted">
//                   Don't have an account? <a href="/register" className="text-primary text-decoration-none">Sign up here</a>
//                 </p>
//                 <p className="text-muted">
//                   <a href="/forgot-password" className="text-primary text-decoration-none">Forgot your password?</a>
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/api';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      const data = await loginUser({ email, password });
      
      if (data.token) {
        setMessage('Login successful! Redirecting...');
        
        // Save token and user data
        localStorage.setItem('token', data.token);
        
        // Save user data if available
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        
        // Show success message briefly before redirecting
        setTimeout(() => {
          // Check user role and redirect accordingly
          if (data.user && data.user.role === 'student') {
            navigate('/student-dashboard');
          } else if (data.user && data.user.role === 'instructor') {
            navigate('/instructor-dashboard');
          } else {
            // Default redirect for students if role is not specified
            navigate('/student-dashboard');
          }
        }, 1000); // 1 second delay to show success message
        
      } else {
        setMessage(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setMessage(error.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="row w-100">
        <div className="col-md-6 col-lg-4 mx-auto">
          <div className="card shadow-lg border-0" style={{borderRadius: '15px'}}>
            <div className="card-body p-5">
              <div className="text-center mb-4">
                <div className="mb-3">
                  <svg width="60" height="60" fill="#0d6efd" viewBox="0 0 24 24">
                    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                  </svg>
                </div>
                <h2 className="card-title fw-bold text-primary mb-2">Welcome Back</h2>
                <p className="text-muted">Please sign in to your account</p>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label fw-semibold">Email Address</label>
                  <input
                    type="email"
                    className="form-control form-control-lg"
                    id="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{borderRadius: '10px'}}
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="password" className="form-label fw-semibold">Password</label>
                  <input
                    type="password"
                    className="form-control form-control-lg"
                    id="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{borderRadius: '10px'}}
                    required
                  />
                </div>
                
                <div className="d-grid mb-3">
                  <button 
                    type="submit" 
                    className="btn btn-primary btn-lg fw-semibold"
                    disabled={loading}
                    style={{borderRadius: '10px', padding: '12px'}}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Signing in...
                      </>
                    ) : (
                      <>
                        <svg className="me-2" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v14z"/>
                        </svg>
                        Sign In
                      </>
                    )}
                  </button>
                </div>
                
                {message && (
                  <div className={`alert ${message.includes('successful') ? 'alert-success' : 'alert-danger'} text-center`} 
                       role="alert" 
                       style={{borderRadius: '10px'}}>
                    {message.includes('successful') && (
                      <svg className="me-2" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                    )}
                    {message}
                  </div>
                )}
              </form>
              
              <div className="text-center mt-4">
                <p className="text-muted mb-2">
                  Don't have an account? 
                  <button 
                    className="btn btn-link text-primary text-decoration-none p-0 ms-1"
                    onClick={() => navigate('/register')}
                  >
                    Sign up here
                  </button>
                </p>
                <p className="text-muted">
                  <button 
                    className="btn btn-link text-primary text-decoration-none p-0"
                    onClick={() => navigate('/forgot-password')}
                  >
                    Forgot your password?
                  </button>
                </p>
              </div>
              
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
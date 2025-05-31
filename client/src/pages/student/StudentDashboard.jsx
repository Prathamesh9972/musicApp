// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import { userService } from '../../services/userService';
// import CourseCard from '../../components/CourseCard';

// const StudentDashboard = () => {
//   const [enrolledCourses, setEnrolledCourses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [stats, setStats] = useState({
//     totalCourses: 0,
//     completedCourses: 0,
//     inProgressCourses: 0
//   });

//   useEffect(() => {
//     fetchEnrolledCourses();
//   }, []);

//   const fetchEnrolledCourses = async () => {
//     try {
//       const response = await userService.getMyCourses();
//       setEnrolledCourses(response.data.courses);
//       calculateStats(response.data.courses);
//     } catch (error) {
//       toast.error('Failed to fetch enrolled courses');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const calculateStats = (courses) => {
//     const total = courses.length;
//     const completed = courses.filter(course => course.progress >= 80).length;
//     const inProgress = total - completed;

//     setStats({
//       totalCourses: total,
//       completedCourses: completed,
//       inProgressCourses: inProgress
//     });
//   };

//   const containerStyle = {
//     padding: '2rem',
//     maxWidth: '1200px',
//     margin: '0 auto'
//   };

//   const titleStyle = {
//     fontSize: '2rem',
//     color: '#2c3e50',
//     marginBottom: '2rem'
//   };

//   const statsContainerStyle = {
//     display: 'grid',
//     gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
//     gap: '1rem',
//     marginBottom: '2rem'
//   };

//   const statCardStyle = {
//     backgroundColor: '#fff',
//     padding: '1.5rem',
//     borderRadius: '8px',
//     boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
//     textAlign: 'center'
//   };

//   const statNumberStyle = {
//     fontSize: '2rem',
//     fontWeight: 'bold',
//     color: '#3498db',
//     display: 'block'
//   };

//   const statLabelStyle = {
//     color: '#7f8c8d',
//     fontSize: '0.9rem'
//   };

//   const sectionTitleStyle = {
//     fontSize: '1.5rem',
//     color: '#2c3e50',
//     marginBottom: '1rem'
//   };

//   const coursesGridStyle = {
//     display: 'grid',
//     gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
//     gap: '1.5rem',
//     marginBottom: '2rem'
//   };

//   const noCoursesStyle = {
//     textAlign: 'center',
//     padding: '2rem',
//     color: '#7f8c8d'
//   };

//   const linkButtonStyle = {
//     display: 'inline-block',
//     padding: '0.75rem 1.5rem',
//     backgroundColor: '#3498db',
//     color: '#fff',
//     textDecoration: 'none',
//     borderRadius: '4px',
//     marginTop: '1rem'
//   };

//   if (loading) {
//     return (
//       <div style={containerStyle}>
//         <div style={{ textAlign: 'center', padding: '2rem' }}>
//           Loading your dashboard...
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div style={containerStyle}>
//       <h1 style={titleStyle}>Student Dashboard</h1>

//       {/* Stats Cards */}
//       <div style={statsContainerStyle}>
//         <div style={statCardStyle}>
//           <span style={statNumberStyle}>{stats.totalCourses}</span>
//           <span style={statLabelStyle}>Total Courses</span>
//         </div>
//         <div style={statCardStyle}>
//           <span style={statNumberStyle}>{stats.inProgressCourses}</span>
//           <span style={statLabelStyle}>In Progress</span>
//         </div>
//         <div style={statCardStyle}>
//           <span style={statNumberStyle}>{stats.completedCourses}</span>
//           <span style={statLabelStyle}>Completed</span>
//         </div>
//       </div>

//       {/* Enrolled Courses */}
//       <h2 style={sectionTitleStyle}>My Courses</h2>
      
//       {enrolledCourses.length > 0 ? (
//         <div style={coursesGridStyle}>
//           {enrolledCourses.map(course => (
//             <CourseCard
//               key={course._id}
//               course={course}
//               purchased={true}
//             />
//           ))}
//         </div>
//       ) : (
//         <div style={noCoursesStyle}>
//           <p>You haven't enrolled in any courses yet.</p>
//           <Link to="/courses" style={linkButtonStyle}>
//             Browse Courses
//           </Link>
//         </div>
//       )}
//     </div>
//   );
// };

// export default StudentDashboard;

 // -----------------------------------------------------------------------------------------------

 // src/pages/auth/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { userService } from '../../services/userService';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await userService.login({ email, password });

      // You might want to store the token/user data
      localStorage.setItem('token', response.data.token);

      toast.success('Login successful');

      // ✅ Redirect student to dashboard
      navigate('/student/dashboard');
    } catch (error) {
      toast.error('Login failed: ' + error.response?.data?.message || 'Try again');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Email:</label><br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Password:</label><br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}






 // ----------------------------------------------------------------------------------------------
// src/pages/student/StudentDashboard.jsx

// import React, { useState, useEffect, useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { AuthContext } from '../../context/AuthContext';
// import { getUserPurchases } from '../../services/courseService';

// const StudentDashboard = () => {
//   const navigate = useNavigate();
//   const { user } = useContext(AuthContext);
//   const [purchasedCourses, setPurchasedCourses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [stats, setStats] = useState({
//     totalCourses: 0,
//     completedModules: 0,
//     certificatesEarned: 0,
//     activeEnrollments: 0
//   });

//   useEffect(() => {
//     fetchUserCourses();
//   }, []);

//   const fetchUserCourses = async () => {
//     try {
//       const response = await getUserPurchases();
//       setPurchasedCourses(response.data || []);
      
//       // Calculate stats
//       const totalCourses = response.data?.length || 0;
//       const completedModules = response.data?.reduce((total, purchase) => 
//         total + (purchase.completedModules?.length || 0), 0) || 0;
//       const certificatesEarned = response.data?.filter(purchase => 
//         purchase.certificate?.isClaimed).length || 0;
//       const activeEnrollments = response.data?.filter(purchase => 
//         new Date(purchase.accessExpiresAt) > new Date()).length || 0;

//       setStats({
//         totalCourses,
//         completedModules,
//         certificatesEarned,
//         activeEnrollments
//       });
//     } catch (error) {
//       console.error('Error fetching courses:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const calculateProgress = (purchase) => {
//     if (!purchase.course?.modules?.length) return 0;
//     const completed = purchase.completedModules?.length || 0;
//     return Math.round((completed / purchase.course.modules.length) * 100);
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   if (loading) {
//     return (
//       <div className="min-vh-100 d-flex align-items-center justify-content-center">
//         <div className="text-center">
//           <div className="spinner-border text-primary mb-3" style={{width: '3rem', height: '3rem'}}></div>
//           <p className="text-muted">Loading your dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-vh-100" style={{backgroundColor: '#f8fafc'}}>
//       {/* Header */}
//       <div className="bg-white shadow-sm">
//         <div className="container py-4">
//           <div className="row align-items-center">
//             <div className="col-md-6">
//               <h1 className="h3 mb-1 fw-bold text-dark">
//                 Welcome back, {user?.name}! 👋
//               </h1>
//               <p className="text-muted mb-0">Continue your learning journey</p>
//             </div>
//             <div className="col-md-6 text-md-end">
//               <button 
//                 className="btn btn-primary me-2"
//                 onClick={() => navigate('/student/courses')}
//                 style={{borderRadius: '8px'}}
//               >
//                 <svg className="me-2" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
//                   <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
//                 </svg>
//                 Browse Courses
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="container py-5">
//         {/* Stats Cards */}
//         <div className="row g-4 mb-5">
//           <div className="col-md-3">
//             <div className="card h-100 border-0 shadow-sm" style={{borderRadius: '12px'}}>
//               <div className="card-body text-center">
//                 <div className="mb-3">
//                   <div className="d-inline-flex align-items-center justify-content-center"
//                        style={{
//                          width: '60px',
//                          height: '60px',
//                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//                          borderRadius: '12px'
//                        }}>
//                     <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
//                       <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
//                     </svg>
//                   </div>
//                 </div>
//                 <h3 className="h4 fw-bold text-dark mb-1">{stats.totalCourses}</h3>
//                 <p className="text-muted mb-0 small">Total Courses</p>
//               </div>
//             </div>
//           </div>

//           <div className="col-md-3">
//             <div className="card h-100 border-0 shadow-sm" style={{borderRadius: '12px'}}>
//               <div className="card-body text-center">
//                 <div className="mb-3">
//                   <div className="d-inline-flex align-items-center justify-content-center"
//                        style={{
//                          width: '60px',
//                          height: '60px',
//                          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
//                          borderRadius: '12px'
//                        }}>
//                     <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
//                       <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
//                     </svg>
//                   </div>
//                 </div>
//                 <h3 className="h4 fw-bold text-dark mb-1">{stats.completedModules}</h3>
//                 <p className="text-muted mb-0 small">Modules Completed</p>
//               </div>
//             </div>
//           </div>

//           <div className="col-md-3">
//             <div className="card h-100 border-0 shadow-sm" style={{borderRadius: '12px'}}>
//               <div className="card-body text-center">
//                 <div className="mb-3">
//                   <div className="d-inline-flex align-items-center justify-content-center"
//                        style={{
//                          width: '60px',
//                          height: '60px',
//                          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
//                          borderRadius: '12px'
//                        }}>
//                     <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
//                       <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10z"/>
//                     </svg>
//                   </div>
//                 </div>
//                 <h3 className="h4 fw-bold text-dark mb-1">{stats.certificatesEarned}</h3>
//                 <p className="text-muted mb-0 small">Certificates Earned</p>
//               </div>
//             </div>
//           </div>

//           <div className="col-md-3">
//             <div className="card h-100 border-0 shadow-sm" style={{borderRadius: '12px'}}>
//               <div className="card-body text-center">
//                 <div className="mb-3">
//                   <div className="d-inline-flex align-items-center justify-content-center"
//                        style={{
//                          width: '60px',
//                          height: '60px',
//                          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
//                          borderRadius: '12px'
//                        }}>
//                     <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
//                       <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
//                     </svg>
//                   </div>
//                 </div>
//                 <h3 className="h4 fw-bold text-dark mb-1">{stats.activeEnrollments}</h3>
//                 <p className="text-muted mb-0 small">Active Enrollments</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Course Progress */}
//         <div className="row">
//           <div className="col-12">
//             <div className="card border-0 shadow-sm" style={{borderRadius: '12px'}}>
//               <div className="card-header bg-white border-0 py-3">
//                 <div className="d-flex justify-content-between align-items-center">
//                   <h5 className="mb-0 fw-bold">My Courses</h5>
//                   <button 
//                     className="btn btn-outline-primary btn-sm"
//                     onClick={() => navigate('/student/courses')}
//                     style={{borderRadius: '6px'}}
//                   >
//                     View All
//                   </button>
//                 </div>
//               </div>
//               <div className="card-body">
//                 {purchasedCourses.length === 0 ? (
//                   <div className="text-center py-5">
//                     <svg className="mb-3" width="64" height="64" fill="#e2e8f0" viewBox="0 0 24 24">
//                       <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM5 19V5h14v14H5z"/>
//                       <path d="M14 17H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
//                     </svg>
//                     <h6 className="text-muted">No courses enrolled yet</h6>
//                     <p className="text-muted mb-3">Start your learning journey by browsing our courses</p>
//                     <button 
//                       className="btn btn-primary"
//                       onClick={() => navigate('/student/courses')}
//                       style={{borderRadius: '8px'}}
//                     >
//                       Browse Courses
//                     </button>
//                   </div>
//                 ) : (
//                   <div className="row g-4">
//                     {purchasedCourses.slice(0, 6).map((purchase, index) => {
//                       const progress = calculateProgress(purchase);
//                       const isExpired = new Date(purchase.accessExpiresAt) <= new Date();
                      
//                       return (
//                         <div key={index} className="col-md-6 col-lg-4">
//                           <div className="card h-100 border-0" 
//                                style={{
//                                  borderRadius: '12px',
//                                  border: '1px solid #e2e8f0',
//                                  transition: 'all 0.2s ease',
//                                  cursor: 'pointer'
//                                }}
//                                onClick={() => navigate(`/student/course/${purchase.course._id}`)}
//                                onMouseEnter={(e) => {
//                                  e.currentTarget.style.transform = 'translateY(-4px)';
//                                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
//                                }}
//                                onMouseLeave={(e) => {
//                                  e.currentTarget.style.transform = 'translateY(0)';
//                                  e.currentTarget.style.boxShadow = 'none';
//                                }}>
                            
//                             {purchase.course.courseImage && (
//                               <img 
//                                 src={purchase.course.courseImage} 
//                                 className="card-img-top"
//                                 alt={purchase.course.title}
//                                 style={{
//                                   height: '160px',
//                                   objectFit: 'cover',
//                                   borderTopLeftRadius: '12px',
//                                   borderTopRightRadius: '12px'
//                                 }}
//                               />
//                             )}
                            
//                             <div className="card-body">
//                               <div className="d-flex justify-content-between align-items-start mb-2">
//                                 <h6 className="card-title fw-bold mb-0" style={{fontSize: '1rem'}}>
//                                   {purchase.course.title}
//                                 </h6>
//                                 {isExpired && (
//                                   <span className="badge bg-warning text-dark small">
//                                     Expired
//                                   </span>
//                                 )}
//                               </div>
                              
//                               <p className="card-text text-muted small mb-3" style={{
//                                 display: '-webkit-box',
//                                 WebkitLineClamp: 2,
//                                 WebkitBoxOrient: 'vertical',
//                                 overflow: 'hidden'
//                               }}>
//                                 {purchase.course.description}
//                               </p>
                              
//                               <div className="mb-3">
//                                 <div className="d-flex justify-content-between align-items-center mb-1">
//                                   <small className="text-muted">Progress</small>
//                                   <small className="fw-semibold">{progress}%</small>
//                                 </div>
//                                 <div className="progress" style={{height: '6px', borderRadius: '3px'}}>
//                                   <div 
//                                     className="progress-bar"
//                                     style={{
//                                       width: `${progress}%`,
//                                       background: progress === 100 
//                                         ? 'linear-gradient(90deg, #00d2ff 0%, #3a7bd5 100%)'
//                                         : 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
//                                       borderRadius: '3px'
//                                     }}
//                                   ></div>
//                                 </div>
//                               </div>
                              
//                               <div className="d-flex justify-content-between align-items-center text-muted small">
//                                 <span>
//                                   {purchase.completedModules?.length || 0} / {purchase.course.modules?.length || 0} modules
//                                 </span>
//                                 <span>
//                                   Expires: {formatDate(purchase.accessExpiresAt)}
//                                 </span>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StudentDashboard;
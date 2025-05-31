// // src/pages/student/StudentDashboard.jsx

// import React, { useContext } from 'react';
// import { AuthContext } from '../../context/AuthContext';

// function StudentDashboard() {
//   const { user } = useContext(AuthContext);

//   if (!user) {
//     return <div>Loading user data...</div>;
//   }

//   return (
//     <div>
//       <h1>Welcome, {user.name}</h1>
//       {/* You can add more dashboard content here */}
//     </div>
//   );
// }

// export default StudentDashboard;


import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { studentAPI } from '../../services/studentAPI';

function StudentDashboard() {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('enrolled');
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      fetchStudentData();
    }
  }, [user]);

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      setError(''); // Clear previous errors
      
      // Fetch enrolled courses (purchases)
      const enrolledData = await studentAPI.getEnrolledCourses();
      // Extract courses from purchase data
      const courses = enrolledData.map(purchase => ({
        ...purchase.course,
        purchaseId: purchase._id,
        purchaseStatus: purchase.status,
        completedModules: purchase.completedModules || []
      }));
      setEnrolledCourses(courses);

      // Fetch available courses - this might be causing the 403 error
      // Let's add error handling specifically for this
      try {
        const availableData = await studentAPI.getPublishedCourses();
        setAvailableCourses(availableData);
      } catch (courseError) {
        console.error('Error fetching available courses:', courseError);
        // Set available courses to empty array if there's an auth issue
        setAvailableCourses([]);
        if (courseError.response?.status === 403) {
          setError('Unable to load available courses. Please check your permissions.');
        }
      }

    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnrollCourse = async (courseId) => {
    try {
      setError(''); // Clear previous errors
      await studentAPI.enrollInCourse(courseId);
      fetchStudentData(); // Refresh data
    } catch (err) {
      setError('Failed to enroll in course');
      console.error('Enrollment error:', err);
    }
  };

  const calculateProgress = (course) => {
    if (!course.modules || course.modules.length === 0) return 0;
    const completedCount = course.completedModules?.length || 0;
    return Math.round((completedCount / course.modules.length) * 100);
  };

  if (!user) {
    return (
      <div className="container-fluid d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted">Loading user data...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container-fluid d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      {/* Header Section */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="bg-primary text-white rounded p-4 mb-4">
            <div className="row align-items-center">
              <div className="col-md-8">
                <h1 className="display-6 mb-2">Welcome back, {user.name}!</h1>
                <p className="lead mb-0">Continue your learning journey</p>
              </div>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="row g-3">
            <div className="col-md-4">
              <div className="card bg-light">
                <div className="card-body text-center">
                  <h3 className="card-title text-primary display-6">{enrolledCourses.length}</h3>
                  <p className="card-text text-muted">Enrolled Courses</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card bg-light">
                <div className="card-body text-center">
                  <h3 className="card-title text-success display-6">
                    {enrolledCourses.filter(course => calculateProgress(course) === 100).length}
                  </h3>
                  <p className="card-text text-muted">Completed</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card bg-light">
                <div className="card-body text-center">
                  <h3 className="card-title text-warning display-6">
                    {enrolledCourses.filter(course => calculateProgress(course) > 0 && calculateProgress(course) < 100).length}
                  </h3>
                  <p className="card-text text-muted">In Progress</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="row mb-4">
          <div className="col-12">
            <div className="alert alert-warning alert-dismissible fade show" role="alert">
              {error}
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => setError('')}
                aria-label="Close"
              ></button>
            </div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="row mb-4">
        <div className="col-12">
          <ul className="nav nav-tabs" role="tablist">
            <li className="nav-item" role="presentation">
              <button 
                className={`nav-link ${activeTab === 'enrolled' ? 'active' : ''}`}
                type="button"
                onClick={() => setActiveTab('enrolled')}
                role="tab"
              >
                <i className="bi bi-book me-2"></i>My Courses
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button 
                className={`nav-link ${activeTab === 'browse' ? 'active' : ''}`}
                type="button"
                onClick={() => setActiveTab('browse')}
                role="tab"
              >
                <i className="bi bi-search me-2"></i>Browse Courses
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Tab Content */}
      <div className="row">
        <div className="col-12">
          {activeTab === 'enrolled' && (
            <div className="tab-pane fade show active">
              <h2 className="h4 mb-4">My Enrolled Courses</h2>
              {enrolledCourses.length === 0 ? (
                <div className="text-center py-5">
                  <div className="card border-0">
                    <div className="card-body">
                      <i className="bi bi-book display-1 text-muted mb-3"></i>
                      <h3 className="h5 text-muted mb-3">You haven't enrolled in any courses yet.</h3>
                      <button 
                        className="btn btn-primary btn-lg"
                        onClick={() => setActiveTab('browse')}
                      >
                        <i className="bi bi-search me-2"></i>Browse Courses
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="row g-4">
                  {enrolledCourses.map(course => (
                    <div key={course._id} className="col-lg-4 col-md-6">
                      <div className="card h-100 shadow-sm border-success">
                        {course.courseImage && (
                          <img 
                            src={course.courseImage} 
                            alt={course.title} 
                            className="card-img-top"
                            style={{ height: '200px', objectFit: 'cover' }}
                          />
                        )}
                        <div className="card-body d-flex flex-column">
                          <h5 className="card-title">{course.title}</h5>
                          <p className="card-text text-muted flex-grow-1">{course.description}</p>
                          
                          {/* Progress Section */}
                          <div className="mb-3">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <small className="text-muted">Progress</small>
                              <small className="fw-bold">{calculateProgress(course)}% Complete</small>
                            </div>
                            <div className="progress" style={{ height: '8px' }}>
                              <div 
                                className="progress-bar bg-success" 
                                role="progressbar"
                                style={{ width: `${calculateProgress(course)}%` }}
                                aria-valuenow={calculateProgress(course)}
                                aria-valuemin="0"
                                aria-valuemax="100"
                              ></div>
                            </div>
                          </div>
                          
                          <button className="btn btn-primary">
                            <i className="bi bi-play-circle me-2"></i>Continue Learning
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'browse' && (
            <div className="tab-pane fade show active">
              <h2 className="h4 mb-4">Available Courses</h2>
              {availableCourses.length === 0 ? (
                <div className="text-center py-5">
                  <div className="card border-0">
                    <div className="card-body">
                      <i className="bi bi-exclamation-triangle display-1 text-warning mb-3"></i>
                      <h3 className="h5 text-muted mb-3">No courses available at the moment.</h3>
                      <p className="text-muted">Please check back later or contact support if this seems incorrect.</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="row g-4">
                  {availableCourses.map(course => (
                    <div key={course._id} className="col-lg-4 col-md-6">
                      <div className="card h-100 shadow-sm">
                        {course.courseImage && (
                          <img 
                            src={course.courseImage} 
                            alt={course.title} 
                            className="card-img-top"
                            style={{ height: '200px', objectFit: 'cover' }}
                          />
                        )}
                        <div className="card-body d-flex flex-column">
                          <h5 className="card-title">{course.title}</h5>
                          <p className="card-text text-muted flex-grow-1">{course.description}</p>
                          
                          {/* Course Meta */}
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <span className="badge bg-secondary">
                              <i className="bi bi-collection me-1"></i>
                              {course.modules?.length || 0} modules
                            </span>
                            {course.isPaid && (
                              <span className="fw-bold text-success fs-5">${course.price}</span>
                            )}
                          </div>
                          
                          <button 
                            className={`btn ${course.isPaid ? 'btn-success' : 'btn-primary'} w-100`}
                            onClick={() => handleEnrollCourse(course._id)}
                          >
                            {course.isPaid ? (
                              <>
                                <i className="bi bi-credit-card me-2"></i>
                                Enroll - ${course.price}
                              </>
                            ) : (
                              <>
                                <i className="bi bi-plus-circle me-2"></i>
                                Enroll Free
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
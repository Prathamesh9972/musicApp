// src/pages/student/CourseList.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllCourses, purchaseCourse } from '../../services/courseService';

const CourseList = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, free, paid
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, price-low, price-high

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await getAllCourses();
      setCourses(response.data.filter(course => course.isPublished) || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (courseId) => {
    setPurchasing(courseId);
    try {
      const paymentDetails = {
        method: 'stripe', // This would be actual payment integration
        transactionId: `txn_${Date.now()}`
      };
      
      await purchaseCourse({ courseId, paymentDetails });
      alert('Course purchased successfully!');
      navigate('/student/dashboard');
    } catch (error) {
      console.error('Purchase error:', error);
      alert(error.response?.data?.message || 'Purchase failed. Please try again.');
    } finally {
      setPurchasing(null);
    }
  };

  const filteredCourses = courses
    .filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (filterType === 'free') return matchesSearch && !course.isPaid;
      if (filterType === 'paid') return matchesSearch && course.isPaid;
      return matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'price-low':
          return (a.price || 0) - (b.price || 0);
        case 'price-high':
          return (b.price || 0) - (a.price || 0);
        default: // newest
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" style={{width: '3rem', height: '3rem'}}></div>
          <p className="text-muted">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100" style={{backgroundColor: '#f8fafc'}}>
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container py-4">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h1 className="h3 mb-1 fw-bold text-dark">
                Discover Courses 🎵
              </h1>
              <p className="text-muted mb-0">
                Explore our collection of music and learning courses
              </p>
            </div>
            <div className="col-md-6 text-md-end">
              <button 
                className="btn btn-outline-primary"
                onClick={() => navigate('/student/dashboard')}
                style={{borderRadius: '8px'}}
              >
                <svg className="me-2" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                </svg>
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-5">
        {/* Filters */}
        <div className="card border-0 shadow-sm mb-4" style={{borderRadius: '12px'}}>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-4">
                <div className="position-relative">
                  <input
                    type="text"
                    className="form-control form-control-lg ps-5"
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      borderRadius: '10px',
                      border: '2px solid #e2e8f0',
                      fontSize: '1rem'
                    }}
                  />
                  <div className="position-absolute" style={{left: '1rem', top: '50%', transform: 'translateY(-50%)'}}>
                    <svg width="20" height="20" fill="#94a3b8" viewBox="0 0 24 24">
                      <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="col-md-3">
                <select 
                  className="form-select form-select-lg"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  style={{borderRadius: '10px', border: '2px solid #e2e8f0'}}
                >
                  <option value="all">All Courses</option>
                  <option value="free">Free Courses</option>
                  <option value="paid">Paid Courses</option>
                </select>
              </div>
              
              <div className="col-md-3">
                <select 
                  className="form-select form-select-lg"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{borderRadius: '10px', border: '2px solid #e2e8f0'}}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
              
              <div className="col-md-2">
                <div className="text-muted small text-center pt-2">
                  {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} found
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Course Grid */}
        {filteredCourses.length === 0 ? (
          <div className="text-center py-5">
            <svg className="mb-3" width="64" height="64" fill="#e2e8f0" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM5 19V5h14v14H5z"/>
            </svg>
            <h5 className="text-muted">No courses found</h5>
            <p className="text-muted">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="row g-4">
            {filteredCourses.map((course) => (
              <div key={course._id} className="col-md-6 col-lg-4">
                <div className="card h-100 border-0" 
                     style={{
                       borderRadius: '16px',
                       border: '1px solid #e2e8f0',
                       transition: 'all 0.3s ease',
                       overflow: 'hidden'
                     }}
                     onMouseEnter={(e) => {
                       e.currentTarget.style.transform = 'translateY(-8px)';
                       e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
                     }}
                     onMouseLeave={(e) => {
                       e.currentTarget.style.transform = 'translateY(0)';
                       e.currentTarget.style.boxShadow = 'none';
                     }}>
                  
                  {/* Course Image */}
                  <div className="position-relative">
                    {course.courseImage ? (
                      <img 
                        src={course.courseImage} 
                        className="card-img-top"
                        alt={course.title}
                        style={{height: '200px', objectFit: 'cover'}}
                      />
                    ) : (
                      <div className="d-flex align-items-center justify-content-center"
                           style={{
                             height: '200px',
                             background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                           }}>
                        <svg width="48" height="48" fill="white" viewBox="0 0 24 24">
                          <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                        </svg>
                      </div>
                    )}
                    
                    {/* Price Badge */}
                    <div className="position-absolute top-0 end-0 m-3">
                      <span className={`badge ${course.isPaid ? 'bg-success' : 'bg-primary'} px-3 py-2`}
                            style={{borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600'}}>
                        {course.isPaid ? `$${course.price}` : 'FREE'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title fw-bold mb-2" style={{fontSize: '1.1rem'}}>
                      {course.title}
                    </h5>
                    
                    <p className="card-text text-muted flex-grow-1 mb-3" style={{
                      fontSize: '0.9rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {course.description}
                    </p>
                    
                    {/* Course Stats */}
                    <div className="d-flex justify-content-between align-items-center mb-3 text-muted small">
                      <span>
                        <svg className="me-1" width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                        </svg>
                        {course.modules?.length || 0} modules
                      </span>
                      <span>
                        <svg className="me-1" width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
                          <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                        </svg>
                        {course.duration || 'Self-paced'}
                      </span>
                    </div>
                    
                    {/* Instructor Info */}
                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-light rounded-circle d-flex align-items-center justify-content-center me-2"
                           style={{width: '32px', height: '32px'}}>
                        <svg width="16" height="16" fill="#6b7280" viewBox="0 0 24 24">
                          <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21A2 2 0 0 0 5 23H19A2 2 0 0 0 21 21V9Z"/>
                        </svg>
                      </div>
                      <div>
                        <div className="small fw-medium text-dark">
                          {course.instructor?.name || 'Anonymous Instructor'}
                        </div>
                        <div className="small text-muted">
                          Instructor
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="mt-auto">
                      <div className="row g-2">
                        <div className="col-8">
                          <button
                            className="btn btn-primary w-100 fw-semibold"
                            onClick={() => handlePurchase(course._id)}
                            disabled={purchasing === course._id}
                            style={{
                              borderRadius: '8px',
                              padding: '0.75rem',
                              fontSize: '0.9rem'
                            }}
                          >
                            {purchasing === course._id ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Processing...
                              </>
                            ) : (
                              <>
                                {course.isPaid ? (
                                  <>
                                    <svg className="me-2" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M7 14c-1.66 0-3 1.34-3 3 0 1.31-1.16 2-2 2 .92 1.22 2.49 2 4 2 2.21 0 4-1.79 4-4 0-1.66-1.34-3-3-3zm13.71-9.37l-1.34-1.34c-.39-.39-1.02-.39-1.41 0L9 12.25 11.75 15l8.96-8.96c.39-.39.39-1.02 0-1.41z"/>
                                    </svg>
                                    Purchase ${course.price}
                                  </>
                                ) : (
                                  <>
                                    <svg className="me-2" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                                    </svg>
                                    Enroll Free
                                  </>
                                )}
                              </>
                            )}
                          </button>
                        </div>
                        <div className="col-4">
                          <button
                            className="btn btn-outline-secondary w-100"
                            onClick={() => navigate(`/student/course/${course._id}/preview`)}
                            style={{
                              borderRadius: '8px',
                              padding: '0.75rem'
                            }}
                          >
                            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseList;
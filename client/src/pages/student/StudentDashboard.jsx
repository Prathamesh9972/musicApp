import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { userService } from '../../services/userService';
import CourseCard from '../../components/CourseCard';

const StudentDashboard = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    inProgressCourses: 0
  });

  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  const fetchEnrolledCourses = async () => {
    try {
      const response = await userService.getMyCourses();
      setEnrolledCourses(response.data.courses);
      calculateStats(response.data.courses);
    } catch (error) {
      toast.error('Failed to fetch enrolled courses');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (courses) => {
    const total = courses.length;
    const completed = courses.filter(course => course.progress >= 80).length;
    const inProgress = total - completed;

    setStats({
      totalCourses: total,
      completedCourses: completed,
      inProgressCourses: inProgress
    });
  };

  const containerStyle = {
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto'
  };

  const titleStyle = {
    fontSize: '2rem',
    color: '#2c3e50',
    marginBottom: '2rem'
  };

  const statsContainerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem'
  };

  const statCardStyle = {
    backgroundColor: '#fff',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    textAlign: 'center'
  };

  const statNumberStyle = {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#3498db',
    display: 'block'
  };

  const statLabelStyle = {
    color: '#7f8c8d',
    fontSize: '0.9rem'
  };

  const sectionTitleStyle = {
    fontSize: '1.5rem',
    color: '#2c3e50',
    marginBottom: '1rem'
  };

  const coursesGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem'
  };

  const noCoursesStyle = {
    textAlign: 'center',
    padding: '2rem',
    color: '#7f8c8d'
  };

  const linkButtonStyle = {
    display: 'inline-block',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#3498db',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '4px',
    marginTop: '1rem'
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          Loading your dashboard...
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Student Dashboard</h1>

      {/* Stats Cards */}
      <div style={statsContainerStyle}>
        <div style={statCardStyle}>
          <span style={statNumberStyle}>{stats.totalCourses}</span>
          <span style={statLabelStyle}>Total Courses</span>
        </div>
        <div style={statCardStyle}>
          <span style={statNumberStyle}>{stats.inProgressCourses}</span>
          <span style={statLabelStyle}>In Progress</span>
        </div>
        <div style={statCardStyle}>
          <span style={statNumberStyle}>{stats.completedCourses}</span>
          <span style={statLabelStyle}>Completed</span>
        </div>
      </div>

      {/* Enrolled Courses */}
      <h2 style={sectionTitleStyle}>My Courses</h2>
      
      {enrolledCourses.length > 0 ? (
        <div style={coursesGridStyle}>
          {enrolledCourses.map(course => (
            <CourseCard
              key={course._id}
              course={course}
              purchased={true}
            />
          ))}
        </div>
      ) : (
        <div style={noCoursesStyle}>
          <p>You haven't enrolled in any courses yet.</p>
          <Link to="/courses" style={linkButtonStyle}>
            Browse Courses
          </Link>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
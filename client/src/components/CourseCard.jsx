import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CourseCard = ({ course, onPurchase, purchased = false, isInstructorView = false, onEdit, onDelete }) => {
  const { isInstructor } = useAuth();

  const cardStyle = {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '1.5rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer',
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  };

  const titleStyle = {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: '0.5rem'
  };

  const descriptionStyle = {
    color: '#7f8c8d',
    marginBottom: '1rem',
    flex: 1
  };

  const priceStyle = {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: course.price === 0 ? '#27ae60' : '#e74c3c',
    marginBottom: '1rem'
  };

  const buttonStyle = {
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    margin: '0.25rem',
    transition: 'background-color 0.3s'
  };

  const purchaseButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#3498db',
    color: '#fff'
  };

  const viewButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#27ae60',
    color: '#fff'
  };

  const editButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#f39c12',
    color: '#fff'
  };

  const deleteButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#e74c3c',
    color: '#fff'
  };

  const buttonContainerStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem'
  };

  return (
    <div style={cardStyle}>
      <h3 style={titleStyle}>{course.title}</h3>
      <p style={descriptionStyle}>{course.description}</p>
      <p style={priceStyle}>
        {course.price === 0 ? 'Free' : `$${course.price}`}
      </p>
      
      <div style={buttonContainerStyle}>
        {!isInstructorView && !purchased && (
          <button 
            onClick={() => onPurchase(course._id)}
            style={purchaseButtonStyle}
          >
            {course.price === 0 ? 'Enroll Free' : 'Purchase'}
          </button>
        )}
        
        {(purchased || isInstructorView) && (
          <Link 
            to={`/course/${course._id}`}
            style={{ textDecoration: 'none' }}
          >
            <button style={viewButtonStyle}>
              {purchased ? 'Continue Learning' : 'View Course'}
            </button>
          </Link>
        )}
        
        {isInstructorView && (
          <>
            <button 
              onClick={() => onEdit(course._id)}
              style={editButtonStyle}
            >
              Edit
            </button>
            <button 
              onClick={() => onDelete(course._id)}
              style={deleteButtonStyle}
            >
              Delete
            </button>
            <Link 
              to={`/instructor/students/${course._id}`}
              style={{ textDecoration: 'none' }}
            >
              <button style={viewButtonStyle}>
                View Students
              </button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default CourseCard;
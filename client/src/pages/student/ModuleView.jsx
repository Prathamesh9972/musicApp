import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { courseService } from '../../services/courseService';
import { userService } from '../../services/userService';

const ModuleView = () => {
  const { courseId, moduleId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [module, setModule] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourseAndModule();
    checkModuleCompletion();
  }, [courseId, moduleId]);

  const fetchCourseAndModule = async () => {
    try {
      const response = await courseService.getCourseById(courseId);
      const courseData = response.data.course;
      setCourse(courseData);
      
      const currentModule = courseData.modules.find(mod => mod._id === moduleId);
      setModule(currentModule);
      
      if (!currentModule) {
        toast.error('Module not found');
        navigate(`/course/${courseId}`);
      }
    } catch (error) {
      toast.error('Failed to fetch course details');
      navigate(`/course/${courseId}`);
    } finally {
      setLoading(false);
    }
  };

  const checkModuleCompletion = async () => {
    try {
      const response = await userService.getProgress(courseId);
      const progress = response.data.progress;
      setIsCompleted(progress.completedModules?.includes(moduleId) || false);
    } catch (error) {
      console.error('Failed to check module completion');
    }
  };

  const handleCompleteModule = async () => {
    try {
      await userService.updateProgress(courseId, moduleId);
      setIsCompleted(true);
      toast.success('Module completed successfully!');
    } catch (error) {
      toast.error('Failed to mark module as complete');
    }
  };

  const getNextModule = () => {
    if (!course || !course.modules) return null;
    
    const currentIndex = course.modules.findIndex(mod => mod._id === moduleId);
    if (currentIndex >= 0 && currentIndex < course.modules.length - 1) {
      return course.modules[currentIndex + 1];
    }
    return null;
  };

  const getPreviousModule = () => {
    if (!course || !course.modules) return null;
    
    const currentIndex = course.modules.findIndex(mod => mod._id === moduleId);
    if (currentIndex > 0) {
      return course.modules[currentIndex - 1];
    }
    return null;
  };

  const containerStyle = {
    padding: '2rem',
    maxWidth: '800px',
    margin: '0 auto'
  };

  const headerStyle = {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginBottom: '2rem'
  };

  const titleStyle = {
    fontSize: '2rem',
    color: '#2c3e50',
    marginBottom: '1rem'
  };

  const breadcrumbStyle = {
    color: '#7f8c8d',
    marginBottom: '1rem'
  };

  const contentStyle = {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginBottom: '2rem',
    lineHeight: '1.6'
  };

  const statusBadgeStyle = {
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    fontSize: '0.9rem',
    fontWeight: 'bold',
    display: 'inline-block',
    marginBottom: '1rem'
  };

  const completedBadgeStyle = {
    ...statusBadgeStyle,
    backgroundColor: '#d5f4e6',
    color: '#27ae60'
  };

  const incompleteBadgeStyle = {
    ...statusBadgeStyle,
    backgroundColor: '#fdeaea',
    color: '#e74c3c'
  };

  const actionButtonsStyle = {
    display: 'flex',
    gap: '1rem',
    marginTop: '2rem'
  };

  const buttonStyle = {
    padding: '0.75rem 1.5rem',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    textDecoration: 'none',
    display: 'inline-block',
    textAlign: 'center'
  };

  const primaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#3498db',
    color: '#fff'
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#95a5a6',
    color: '#fff'
  };

  const successButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#27ae60',
    color: '#fff'
  };

  const navigationStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: '1rem 2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          Loading module...
        </div>
      </div>
    );
  }

  if (!module) {
    return (
      <div style={containerStyle}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          Module not found.
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      {/* Module Header */}
      <div style={headerStyle}>
        <div style={breadcrumbStyle}>
          {course?.title} / Module {course?.modules.findIndex(m => m._id === moduleId) + 1}
        </div>
        <h1 style={titleStyle}>{module.title}</h1>
        
        <span style={isCompleted ? completedBadgeStyle : incompleteBadgeStyle}>
          {isCompleted ? 'Completed' : 'In Progress'}
        </span>
      </div>

      {/* Module Content */}
      <div style={contentStyle}>
        <h3 style={{ color: '#2c3e50', marginBottom: '1rem' }}>Module Description</h3>
        <p>{module.description}</p>
        
        {module.content && (
          <>
            <h3 style={{ color: '#2c3e50', marginTop: '2rem', marginBottom: '1rem' }}>Content</h3>
            <div dangerouslySetInnerHTML={{ __html: module.content }} />
          </>
        )}

        {module.videoUrl && (
          <>
            <h3 style={{ color: '#2c3e50', marginTop: '2rem', marginBottom: '1rem' }}>Video Lesson</h3>
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
              <iframe
                src={module.videoUrl}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  borderRadius: '4px'
                }}
                allowFullScreen
                title={module.title}
              />
            </div>
          </>
        )}

        {/* Action Buttons */}
        <div style={actionButtonsStyle}>
          {!isCompleted ? (
            <button onClick={handleCompleteModule} style={successButtonStyle}>
              Mark as Complete
            </button>
          ) : (
            <span style={successButtonStyle}>
              ✓ Completed
            </span>
          )}
          
          <button 
            onClick={() => navigate(`/course/${courseId}`)}
            style={secondaryButtonStyle}
          >
            Back to Course
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div style={navigationStyle}>
        <div>
          {getPreviousModule() && (
            <button
              onClick={() => navigate(`/course/${courseId}/module/${getPreviousModule()._id}`)}
              style={primaryButtonStyle}
            >
              ← Previous Module
            </button>
          )}
        </div>
        
        <div>
          {getNextModule() && (
            <button
              onClick={() => navigate(`/course/${courseId}/module/${getNextModule()._id}`)}
              style={primaryButtonStyle}
            >
              Next Module →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModuleView;
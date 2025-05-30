import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';

// Auth pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

// Student pages
import StudentDashboard from '../pages/student/StudentDashboard';
import CourseList from '../pages/student/CourseList';
import CourseDetail from '../pages/student/CourseDetail';
import ModuleView from '../pages/student/ModuleView';
import Certificate from '../pages/student/Certificate';

// Instructor pages
import InstructorDashboard from '../pages/instructor/InstructorDashboard';
import AddCourse from '../pages/instructor/AddCourse';
import EditCourse from '../pages/instructor/EditCourse';
import StudentsEnrolled from '../pages/instructor/StudentsEnrolled';

import NotFound from '../pages/NotFound';

const AppRoutes = () => {
  const { isAuthenticated, isStudent, isInstructor, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Default route based on authentication */}
      <Route 
        path="/" 
        element={
          isAuthenticated ? (
            isStudent ? <CourseList /> : <InstructorDashboard />
          ) : (
            <Login />
          )
        } 
      />

      {/* Student routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            {isStudent ? <StudentDashboard /> : <InstructorDashboard />}
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/courses" 
        element={
          <ProtectedRoute>
            <CourseList />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/course/:id" 
        element={
          <ProtectedRoute>
            <CourseDetail />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/course/:courseId/module/:moduleId" 
        element={
          <ProtectedRoute>
            <ModuleView />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/certificate/:courseId" 
        element={
          <ProtectedRoute>
            <Certificate />
          </ProtectedRoute>
        } 
      />

      {/* Instructor routes */}
      <Route 
        path="/instructor/add-course" 
        element={
          <ProtectedRoute requireRole="instructor">
            <AddCourse />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/instructor/edit-course/:id" 
        element={
          <ProtectedRoute requireRole="instructor">
            <EditCourse />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/instructor/students/:courseId" 
        element={
          <ProtectedRoute requireRole="instructor">
            <StudentsEnrolled />
          </ProtectedRoute>
        } 
      />

      {/* 404 route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
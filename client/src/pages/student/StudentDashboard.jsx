// src/pages/student/StudentDashboard.jsx

import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

function StudentDashboard() {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <div>Loading user data...</div>;
  }

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      {/* You can add more dashboard content here */}
    </div>
  );
}

export default StudentDashboard;

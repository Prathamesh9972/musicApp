// src/pages/student/CourseList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function CourseList() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    axios.get('/api/courses/published')
      .then((res) => setCourses(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h2>Available Courses</h2>
      <ul>
        {courses.map(course => (
          <li key={course._id}>
            <Link to={`/student/course/${course._id}`}>
              {course.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CourseList;

// src/pages/student/CourseDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function CourseDetails() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    axios.get(`/api/courses/${id}`)
      .then(res => setCourse(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!course) return <div>Loading...</div>;

  return (
    <div>
      <h2>{course.title}</h2>
      <p>{course.description}</p>
      <h3>Modules</h3>
      <ul>
        {course.modules.map((module, index) => (
          <li key={index}>
            <Link to={`/student/course/${id}/module/${index}`}>{module.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CourseDetails;

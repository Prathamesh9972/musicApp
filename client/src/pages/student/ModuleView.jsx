// src/pages/student/ModuleView.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function ModuleView() {
  const { id, moduleIndex } = useParams();
  const [module, setModule] = useState(null);

  useEffect(() => {
    axios.get(`/api/courses/${id}`)
      .then(res => {
        const selectedModule = res.data.modules[moduleIndex];
        setModule(selectedModule);
      })
      .catch(err => console.error(err));
  }, [id, moduleIndex]);

  if (!module) return <div>Loading Module...</div>;

  return (
    <div>
      <h2>{module.title}</h2>
      <p>{module.content}</p>
      {module.videoUrl && (
        <div>
          <video width="600" controls>
            <source src={module.videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </div>
  );
}

export default ModuleView;

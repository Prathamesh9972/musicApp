import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { courseService } from '../../services/courseService';
import { purchaseService } from '../../services/purchaseService';
import CourseCard from '../../components/CourseCard';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [purchasedCourses, setPurchasedCourses] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, free, paid

  useEffect(() => {
    fetchCourses();
    fetchPurchasedCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await courseService.getAllCourses();
      setCourses(response.data.courses);
    } catch (error) {
      toast.error('Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  const fetchPurchasedCourses = async () => {
    try {
      const response = await purchaseService.getPurchasedCourses();
      const purchasedIds = new Set(response.data.courses.map(course => course._id));
      setPurchasedCourses(purchasedIds);
    } catch (error) {
      console.error('Failed to fetch purchased courses');
    }
  };

  const handlePurchase = async (courseId) => {
    try {
      const course = courses.find(c => c._id === courseId);
      
      if (course.price === 0) {
        // Free enrollment
        await purchaseService.enrollFreeCourse(courseId);
        toast.success('Successfully enrolled in the course!');
      } else {
        // Paid course - simulate payment
        await purchaseService.purchaseCourse(courseId);
        toast.success('Course purchased successfully!');
      }
      
      // Update purchased courses
      setPurchasedCourses(prev => new Set([...prev, courseId]));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Purchase failed');
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'free') return matchesSearch && course.price === 0;
    if (filter === 'paid') return matchesSearch && course.price > 0;
    return matchesSearch;
  });

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

  const filtersStyle = {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem',
    flexWrap: 'wrap'
  };

  const searchInputStyle = {
    flex: 1,
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    minWidth: '250px'
  };

  const selectStyle = {
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer'
  };

  const coursesGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem'
  };

  const noCoursesStyle = {
    textAlign: 'center',
    padding: '2rem',
    color: '#7f8c8d'
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          Loading courses...
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Available Courses</h1>

      {/* Search and Filter */}
      <div style={filtersStyle}>
        <input
          type="text"
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={searchInputStyle}
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={selectStyle}
        >
          <option value="all">All Courses</option>
          <option value="free">Free Courses</option>
          <option value="paid">Paid Courses</option>
        </select>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length > 0 ? (
        <div style={coursesGridStyle}>
          {filteredCourses.map(course => (
            <CourseCard
              key={course._id}
              course={course}
              onPurchase={handlePurchase}
              purchased={purchasedCourses.has(course._id)}
            />
          ))}
        </div>
      ) : (
        <div style={noCoursesStyle}>
          <p>No courses found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default CourseList;
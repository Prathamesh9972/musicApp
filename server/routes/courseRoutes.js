const express = require('express');
const router = express.Router();

const {
  createCourse,
  getInstructorCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  addOrUpdateModule,
  deleteModule,
} = require('../controllers/courseController');

const { protect } = require('../middleware/authMiddleware');
const { instructorOnly } = require('../middleware/roleMiddleware');

// All routes protected and instructor-only
router.use(protect, instructorOnly);

router.post('/', createCourse);
router.get('/', getInstructorCourses);
router.get('/:id', getCourseById);
router.put('/:id', updateCourse);
router.delete('/:id', deleteCourse);

// Modules inside a course
router.post('/:courseId/modules', addOrUpdateModule);       // Add new module
router.put('/:courseId/modules/:moduleId', addOrUpdateModule);  // Update module
router.delete('/:courseId/modules/:moduleId', deleteModule);

module.exports = router;

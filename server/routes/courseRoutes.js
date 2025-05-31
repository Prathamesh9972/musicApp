const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');

const {
  createCourse,
  getInstructorCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  getAllModules,
  addOrUpdateModule,
  deleteModule,
} = require('../controllers/courseController');

const { protect } = require('../middleware/authMiddleware');
const { instructorOnly } = require('../middleware/roleMiddleware');

router.use(protect, instructorOnly);

// Course routes
router.post('/', upload.single('courseImage'), createCourse); // Handle image
router.put('/:id', upload.single('courseImage'), updateCourse); // Update image
router.get('/', getInstructorCourses);
router.get('/:id', getCourseById);
router.delete('/:id', deleteCourse);

// Module routes
router.get('/:courseId/modules', getAllModules);
router.post('/:courseId/modules', upload.single('video'), addOrUpdateModule); // Handle video
router.put('/:courseId/modules/:moduleId', upload.single('video'), addOrUpdateModule);
router.delete('/:courseId/modules/:moduleId', deleteModule);

module.exports = router;

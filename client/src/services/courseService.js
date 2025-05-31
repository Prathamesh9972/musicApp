const Course = require('../models/Course');

const createCourse = async (data, instructorId) => {
  const course = new Course({ ...data, instructor: instructorId });
  return await course.save();
};

const getAllCourses = async () => {
  return await Course.find().populate('instructor', 'name email');
};

const getCourseById = async (id) => {
  return await Course.findById(id).populate('instructor', 'name email');
};

const addModuleToCourse = async (courseId, moduleData) => {
  const course = await Course.findById(courseId);
  if (!course) throw new Error('Course not found');
  course.modules.push(moduleData);
  return await course.save();
};

module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  addModuleToCourse
};

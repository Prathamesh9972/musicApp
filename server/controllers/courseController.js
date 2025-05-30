const Course = require('../models/Course');

// Create a new course
async function createCourse(req, res) {
  try {
    const { title, description, isPaid, price, isPublished } = req.body;

    // Validation: if isPaid is true, price must be > 0
    if (isPaid && (!price || price <= 0)) {
      return res.status(400).json({ message: 'Paid courses must have a valid price' });
    }

    const course = new Course({
      title,
      description,
      isPaid,
      price: isPaid ? price : 0,
      isPublished,
      instructor: req.user._id,
      modules: [],
    });

    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Get all courses for instructor
async function getInstructorCourses(req, res) {
  try {
    const courses = await Course.find({ instructor: req.user._id });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Get single course by id
async function getCourseById(req, res) {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Update course info
async function updateCourse(req, res) {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { title, description, price, isPublished, isPaid } = req.body;

    if (title !== undefined) course.title = title;
    if (description !== undefined) course.description = description;
    if (isPaid !== undefined) course.isPaid = isPaid;
    if (isPublished !== undefined) course.isPublished = isPublished;

    if (price !== undefined) {
      if (course.isPaid && price <= 0) {
        return res.status(400).json({ message: 'Paid courses must have a valid price' });
      }
      course.price = course.isPaid ? price : 0;
    }

    await course.save();
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Delete course
async function deleteCourse(req, res) {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await course.remove();
    res.json({ message: 'Course deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Add or update a module in a course
async function addOrUpdateModule(req, res) {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { moduleId, title, content, order } = req.body;

    if (moduleId) {
      // Update existing module
      const module = course.modules.id(moduleId);
      if (!module) return res.status(404).json({ message: 'Module not found' });

      if (title !== undefined) module.title = title;
      if (content !== undefined) module.content = content;
      if (order !== undefined) module.order = order;
    } else {
      // Add new module
      course.modules.push({ title, content, order });
    }

    await course.save();
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Delete a module
async function deleteModule(req, res) {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const module = course.modules.id(req.params.moduleId);
    if (!module) return res.status(404).json({ message: 'Module not found' });

    module.remove();
    await course.save();
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  createCourse,
  getInstructorCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  addOrUpdateModule,
  deleteModule,
};

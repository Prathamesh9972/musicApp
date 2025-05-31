const Course = require('../models/Course');
const cloudinary = require('../utils/cloudinary'); // Assuming you have a cloudinary utility for image uploads

// Create a new course
async function createCourse(req, res) {
  try {
    const { title, description, isPaid, price, isPublished } = req.body;

    if (isPaid && (!price || price <= 0)) {
      return res.status(400).json({ message: 'Paid courses must have a valid price' });
    }

    let imageUrl = null;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'course_images',
      });
      imageUrl = result.secure_url;
    }

    const course = new Course({
      title,
      description,
      isPaid,
      price: isPaid ? price : 0,
      isPublished,
      instructor: req.user._id,
      courseImage: imageUrl,
      modules: [],
    });

    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Get all courses for the instructor
async function getInstructorCourses(req, res) {
  try {
    const courses = await Course.find({ instructor: req.user._id });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Get single course by ID
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

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'course_images',
      });
      course.courseImage = result.secure_url;
    }

    await course.save();
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


// Delete a course
async function deleteCourse(req, res) {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await course.deleteOne();
    res.json({ message: 'Course deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Get all modules for a course
async function getAllModules(req, res) {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(course.modules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Get a single module by ID
async function getSingleModule(req, res) {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const module = course.modules.id(req.params.moduleId);
    if (!module) return res.status(404).json({ message: 'Module not found' });

    res.json(module);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Add a new module or update an existing one
async function addOrUpdateModule(req, res) {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { moduleId, title, content, order } = req.body;

    let videoUrl = null;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        resource_type: 'video',
        folder: 'course_videos',
      });
      videoUrl = result.secure_url;
    }

    if (moduleId) {
      const module = course.modules.id(moduleId);
      if (!module) return res.status(404).json({ message: 'Module not found' });

      if (title !== undefined) module.title = title;
      if (content !== undefined) module.content = content;
      if (order !== undefined) module.order = order;
      if (videoUrl) module.video = videoUrl;
    } else {
      course.modules.push({
        title,
        content,
        order,
        video: videoUrl,
      });
    }

    await course.save();
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


// Delete a module from a course
async function deleteModule(req, res) {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const module = course.modules.id(req.params.moduleId);
    if (!module) return res.status(404).json({ message: 'Module not found' });

    course.modules.pull(module._id);
    await course.save();

    res.json({ message: 'Module deleted', course });
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
  getAllModules,
  getSingleModule,
  addOrUpdateModule,
  deleteModule,
};

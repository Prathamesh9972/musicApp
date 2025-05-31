const Purchase = require('../models/Purchase');
const Course = require('../models/Course');

// Purchase a course
async function purchaseCourse(req, res) {
  try {
    const userId = req.user._id;
    const { courseId, paymentDetails } = req.body;

    // Validate course existence
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    // Check if already purchased
    const existingPurchase = await Purchase.findOne({ user: userId, course: courseId, paymentStatus: 'completed' });
    if (existingPurchase) {
      return res.status(400).json({ message: 'Course already purchased' });
    }

    // Determine access expiry (6 months)
    const accessDurationMonths = 6;
    const accessExpiresAt = new Date();
    accessExpiresAt.setMonth(accessExpiresAt.getMonth() + accessDurationMonths);

    const purchase = new Purchase({
      user: userId,
      course: courseId,
      purchaseDate: new Date(),
      accessExpiresAt,
      paymentStatus: 'completed',
      paymentDetails,
    });

    await purchase.save();

    res.status(201).json({ message: 'Course purchased successfully', purchase });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Get user's purchased courses
async function getUserPurchases(req, res) {
  try {
    const userId = req.user._id;
    const purchases = await Purchase.find({ user: userId, paymentStatus: 'completed' })
      .populate('course')
      .exec();

    res.json(purchases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Check if user has access to a course (middleware)
async function checkCourseAccess(req, res, next) {
  try {
    const userId = req.user._id;
    const courseId = req.params.courseId;

    const purchase = await Purchase.findOne({
      user: userId,
      course: courseId,
      paymentStatus: 'completed',
      accessExpiresAt: { $gt: new Date() },
    });

    if (!purchase) {
      return res.status(403).json({ message: 'Access denied: purchase required or expired' });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Update a purchase (extend access, change status)
async function updatePurchase(req, res) {
  try {
    const purchase = await Purchase.findById(req.params.id);
    if (!purchase) {
      return res.status(404).json({ message: 'Purchase not found' });
    }

    if (purchase.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { status, accessExpires } = req.body;

    if (status !== undefined) purchase.paymentStatus = status;
    if (accessExpires !== undefined) purchase.accessExpiresAt = new Date(accessExpires);

    await purchase.save();

    res.json(purchase);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Mock: Track completed modules per purchase (You should ideally use a ModuleProgress model or embed it in Purchase)
const markModuleComplete = async (req, res) => {
  const { purchaseId, moduleId } = req.params;
  const userId = req.user._id;

  try {
    const purchase = await Purchase.findById(purchaseId);
    if (!purchase) return res.status(404).json({ message: 'Purchase not found' });

    if (purchase.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Optional: Add a `completedModules` array in the purchase model schema to track module completion
    if (!purchase.completedModules) purchase.completedModules = [];

    if (purchase.completedModules.includes(moduleId)) {
      return res.status(400).json({ message: 'Module already marked as completed' });
    }

    purchase.completedModules.push(moduleId);
    await purchase.save();

    res.json({ message: 'Module marked as completed', completedModules: purchase.completedModules });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  purchaseCourse,
  getUserPurchases,
  checkCourseAccess,
  updatePurchase,
  markModuleComplete,
};


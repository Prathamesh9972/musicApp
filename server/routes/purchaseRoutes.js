const express = require('express');
const router = express.Router();

const {
  purchaseCourse,
  getUserPurchases,
  checkCourseAccess,
  updatePurchase,
  markModuleComplete
} = require('../controllers/purchaseController');

const { protect } = require('../middleware/authMiddleware');  // ensure user logged in

// All purchase routes protected
router.use(protect);

router.post('/', purchaseCourse);           // Purchase a course
router.get('/', getUserPurchases);          // Get purchased courses for logged-in user
router.put('/:id', updatePurchase);         // Update purchase by purchase ID
router.post('/:purchaseId/modules/:moduleId/complete', markModuleComplete);


// Example middleware usage for course access check
// router.get('/course/:courseId/some-protected-route', checkCourseAccess, yourHandler);

module.exports = router;

const express = require('express');
const router = express.Router();

const {
  completeModule,
  certificateStatus,
  claimCertificate,
} = require('../controllers/certificateController');

const { protect } = require('../middleware/authMiddleware');

// Protect all routes
router.use(protect);

// Mark module completed
router.post('/purchases/:purchaseId/modules/:moduleId/complete', completeModule);

// Check eligibility
router.get('/purchases/:purchaseId/certificate-status', certificateStatus);

// Claim certificate
router.post('/purchases/:purchaseId/claim-certificate', claimCertificate);

module.exports = router;

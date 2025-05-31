const Purchase = require('../models/Purchase');
const Course = require('../models/Course');
const Certificate = require('../models/Certificate');

// Mark a module as completed
async function completeModule(req, res) {
  try {
    const { purchaseId, moduleId } = req.params;

    const purchase = await Purchase.findById(purchaseId);
    if (!purchase) return res.status(404).json({ message: 'Purchase not found' });
    if (purchase.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Access denied' });

    if (!purchase.completedModules.includes(moduleId)) {
      purchase.completedModules.push(moduleId);
      await purchase.save();
    }

    res.json({ message: 'Module marked as completed', completedModules: purchase.completedModules });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Check certificate eligibility
async function certificateStatus(req, res) {
  try {
    const { purchaseId } = req.params;
    const purchase = await Purchase.findById(purchaseId).populate('course');
    if (!purchase) return res.status(404).json({ message: 'Purchase not found' });
    if (purchase.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Access denied' });

    const totalModules = purchase.course.modules.length;
    const completedCount = purchase.completedModules.length;
    const percentage = totalModules === 0 ? 0 : (completedCount / totalModules) * 100;

    // Check if certificate already issued
    const certificate = await Certificate.findOne({ purchase: purchaseId });

    res.json({
      completionPercentage: percentage,
      eligible: percentage >= 80,
      certificateIssued: certificate ? true : false,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Claim certificate
async function claimCertificate(req, res) {
  try {
    const { purchaseId } = req.params;
    const purchase = await Purchase.findById(purchaseId).populate('course');
    if (!purchase) return res.status(404).json({ message: 'Purchase not found' });
    if (purchase.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Access denied' });

    const totalModules = purchase.course.modules.length;
    const completedCount = purchase.completedModules.length;
    const percentage = totalModules === 0 ? 0 : (completedCount / totalModules) * 100;

    if (percentage < 80) {
      return res.status(400).json({ message: 'Not eligible for certificate yet' });
    }

    let certificate = await Certificate.findOne({ purchase: purchaseId });
    if (certificate) {
      return res.status(400).json({ message: 'Certificate already claimed' });
    }

    certificate = new Certificate({
      user: req.user._id,
      course: purchase.course._id,
      purchase: purchaseId,
      completionPercentage: percentage,
      isClaimed: true,
    });

    await certificate.save();

    res.json({ message: 'Certificate claimed successfully', certificate });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  completeModule,
  certificateStatus,
  claimCertificate,
};

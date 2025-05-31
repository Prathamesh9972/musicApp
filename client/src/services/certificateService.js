const Certificate = require('../models/Certificate');

const issueCertificate = async ({ userId, courseId }) => {
  const existing = await Certificate.findOne({ user: userId, course: courseId });
  if (existing) return existing;

  const certificate = new Certificate({ user: userId, course: courseId });
  return await certificate.save();
};

const getUserCertificates = async (userId) => {
  return await Certificate.find({ user: userId }).populate('course', 'title');
};

module.exports = {
  issueCertificate,
  getUserCertificates
};

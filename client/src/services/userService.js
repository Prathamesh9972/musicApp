const User = require('../models/User');

const getUserById = async (id) => {
  return await User.findById(id).select('-password');
};

const getAllUsers = async () => {
  return await User.find().select('-password');
};

const updateUserProfile = async (userId, updateData) => {
  return await User.findByIdAndUpdate(userId, updateData, { new: true });
};

module.exports = {
  getUserById,
  getAllUsers,
  updateUserProfile
};

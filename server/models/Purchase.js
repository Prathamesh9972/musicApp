  const mongoose = require('mongoose');

  const purchaseSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    purchaseDate: { type: Date, default: Date.now },
    accessExpiresAt: { type: Date }, // optional expiry date (e.g., subscription or limited access)
    paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    paymentDetails: {
      paymentId: String,
      amount: Number,
      method: String,
    },
    completedModules: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Module' }],
  });

  module.exports = mongoose.model('Purchase', purchaseSchema);

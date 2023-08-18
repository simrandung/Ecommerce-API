const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  // Add more fields as needed
});

module.exports = mongoose.model('Category', categorySchema);

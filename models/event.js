const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
  title: { type: String, required: [true, 'Title is required'] },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Tech', 'Music', 'Art', 'Sports', 'Food', "Wellness", "Networking"]
  },
  startDateTime: { type: Date, required: [true, 'Start date and time is required'] },
  endDateTime: { type: Date, required: [true, 'End date and time is required'] },
  details: { type: String, required: [true, 'Details are required'] },
  image: { type: String, required: [true, 'Image is required'] },
  location: { type: String, required: [true, 'Location is required'] },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Author is required']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Event', eventSchema);
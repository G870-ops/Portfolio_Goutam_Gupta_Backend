import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Reviewer name is required'],
      trim: true,
      maxlength: [80, 'Name cannot exceed 80 characters'],
    },
    role: {
      type: String,
      default: 'Verified Client',
      trim: true,
      maxlength: [100, 'Role / Project cannot exceed 100 characters'],
    },
    avatar: {
      type: String,
      default: '',
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: 1,
      max: 5,
      default: 5,
    },
    review: {
      type: String,
      required: [true, 'Review text is required'],
      trim: true,
      maxlength: [2000, 'Review cannot exceed 2000 characters'],
    },
    reviewImage: {
      type: String,
      default: '',
    },
    tag: {
      type: String,
      default: 'Client Review',
      trim: true,
    },
    approved: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Review = mongoose.model('Review', reviewSchema);

export default Review;

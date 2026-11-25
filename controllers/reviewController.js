import Review from '../models/Review.js';

export const getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ approved: true }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

export const submitReview = async (req, res, next) => {
  try {
    const { name, role, rating, review, reviewImage, tag } = req.body;

    if (!name || !review) {
      return res.status(400).json({
        success: false,
        message: 'Name and review text are required fields',
      });
    }

    const safeRating = Number(rating) >= 1 && Number(rating) <= 5 ? Number(rating) : 5;
    const avatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name.trim())}&backgroundColor=050711`;

    const newReview = await Review.create({
      name: name.trim(),
      role: role && role.trim() ? role.trim() : 'Verified Client',
      avatar,
      rating: safeRating,
      review: review.trim(),
      reviewImage: reviewImage ? reviewImage.trim() : '',
      tag: tag && tag.trim() ? tag.trim() : 'Client Review',
      approved: true,
    });

    res.status(201).json({
      success: true,
      message: 'Review successfully recorded into MongoDB pipeline.',
      data: newReview,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    await review.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

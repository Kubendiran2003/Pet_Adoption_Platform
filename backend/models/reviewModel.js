import mongoose from 'mongoose';

const reviewSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required']
    },
    shelter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    pet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pet'
    },
    type: {
      type: String,
      enum: ['shelter', 'pet'],
      required: [true, 'Review type is required']
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: 1,
      max: 5
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters']
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      trim: true,
      maxlength: [1000, 'Content cannot be more than 1000 characters']
    },
    isVerifiedAdopter: {
      type: Boolean,
      default: false
    },
    isApproved: {
      type: Boolean,
      default: true
    },
    helpfulVotes: {
      count: {
        type: Number,
        default: 0
      },
      users: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        }
      ]
    },
    response: {
      content: String,
      respondedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      respondedAt: Date
    }
  },
  {
    timestamps: true
  }
);

// A user can only review a shelter or pet once
reviewSchema.index(
  { user: 1, shelter: 1, type: 1 },
  { unique: true, sparse: true }
);
reviewSchema.index({ user: 1, pet: 1, type: 1 }, { unique: true, sparse: true });

// Static method to get average rating
reviewSchema.statics.getAverageRating = async function (shelterOrPetId, type) {
  const field = type === 'shelter' ? 'shelter' : 'pet';
  
  const obj = await this.aggregate([
    {
      $match: {
        [field]: shelterOrPetId,
        type,
        isApproved: true
      }
    },
    {
      $group: {
        _id: `$${field}`,
        averageRating: { $avg: '$rating' },
        numReviews: { $sum: 1 }
      }
    }
  ]);

  return obj.length > 0
    ? { averageRating: obj[0].averageRating, numReviews: obj[0].numReviews }
    : { averageRating: 0, numReviews: 0 };
};

const Review = mongoose.model('Review', reviewSchema);

export default Review;
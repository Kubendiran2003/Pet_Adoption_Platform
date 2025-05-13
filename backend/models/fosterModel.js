import mongoose from 'mongoose';

const fosterApplicationSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required']
    },
    pet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pet',
      required: [true, 'Pet is required']
    },
    shelter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Shelter is required']
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected', 'Completed', 'Cancelled'],
      default: 'Pending'
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required']
    },
    endDate: {
      type: Date
    },
    notes: String,
    feedback: {
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      comments: String,
      submittedAt: Date
    },
    requirements: [String],
    homeCheckScheduled: {
      isScheduled: {
        type: Boolean,
        default: false
      },
      date: Date
    },
    homeCheckResults: {
      passed: Boolean,
      comments: String,
      completedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      completedAt: Date
    }
  },
  {
    timestamps: true
  }
);

// Prevent multiple foster applications from the same user for the same pet
fosterApplicationSchema.index({ user: 1, pet: 1 }, { unique: true });

const FosterApplication = mongoose.model(
  'FosterApplication',
  fosterApplicationSchema
);

export default FosterApplication;
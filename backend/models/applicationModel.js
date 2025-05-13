import mongoose from 'mongoose';

const applicationSchema = mongoose.Schema(
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
      enum: ['Submitted', 'Under Review', 'Approved', 'Denied', 'Withdrawn'],
      default: 'Submitted'
    },
    applicantInfo: {
      name: {
        type: String,
        required: [true, 'Name is required']
      },
      email: {
        type: String,
        required: [true, 'Email is required'],
        match: [
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
          'Please add a valid email'
        ]
      },
      phone: {
        type: String,
        required: [true, 'Phone number is required']
      },
      address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String
      }
    },
    housingInfo: {
      type: {
        type: String,
        enum: ['House', 'Apartment', 'Condo', 'Other'],
        required: [true, 'Housing type is required']
      },
      own: {
        type: Boolean,
        required: [true, 'Please specify if you own or rent']
      },
      landlordContact: {
        name: String,
        phone: String
      },
      hasYard: {
        type: Boolean,
        default: false
      },
      yardDescription: String,
      hasChildren: {
        type: Boolean,
        default: false
      },
      childrenAges: [Number],
      hasOtherPets: {
        type: Boolean,
        default: false
      },
      otherPetsDescription: String
    },
    lifestyle: {
      hoursAlone: {
        type: Number,
        required: [true, 'Hours alone per day is required']
      },
      activityLevel: {
        type: String,
        enum: ['Low', 'Moderate', 'High', 'Very High'],
        required: [true, 'Activity level is required']
      },
      primaryCaregiver: {
        type: String,
        required: [true, 'Primary caregiver is required']
      }
    },
    experience: {
      hasPetsHistory: {
        type: Boolean,
        default: false
      },
      petsHistory: String,
      vetInfo: {
        name: String,
        phone: String,
        clinic: String
      }
    },
    additionalQuestions: [
      {
        question: String,
        answer: String
      }
    ],
    references: [
      {
        name: String,
        relationship: String,
        phone: String,
        email: String
      }
    ],
    meetingScheduled: {
      isScheduled: {
        type: Boolean,
        default: false
      },
      date: Date,
      location: String,
      notes: String
    },
    notes: [
      {
        content: String,
        createdBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

// Prevent multiple applications from the same user for the same pet
applicationSchema.index({ user: 1, pet: 1 }, { unique: true });

const Application = mongoose.model('Application', applicationSchema);

export default Application;
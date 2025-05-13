import mongoose from 'mongoose';

const petSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a pet name'],
      trim: true
    },
    shelter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Shelter/organization is required']
    },
    species: {
      type: String,
      required: [true, 'Please specify the species'],
      enum: ['Dog', 'Cat', 'Bird', 'Rabbit', 'Small & Furry', 'Other'],
      default: 'Dog'
    },
    breed: {
      type: String,
      required: [true, 'Please specify the breed']
    },
    age: {
      value: {
        type: Number,
        required: [true, 'Please specify the age']
      },
      unit: {
        type: String,
        enum: ['days', 'weeks', 'months', 'years'],
        default: 'years'
      }
    },
    size: {
      type: String,
      enum: ['Small', 'Medium', 'Large', 'Extra Large'],
      required: [true, 'Please specify the size']
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Unknown'],
      required: [true, 'Please specify the gender']
    },
    color: {
      type: String,
      required: [true, 'Please specify the color']
    },
    coat: {
      type: String,
      enum: ['Short', 'Medium', 'Long', 'Hairless', 'Curly', 'Other'],
      default: 'Short'
    },
    description: {
      type: String,
      required: [true, 'Please add a description']
    },
    photos: [
      {
        url: {
          type: String,
          required: [true, 'Photo URL is required']
        },
        isMain: {
          type: Boolean,
          default: false
        }
      }
    ],
    videos: [
      {
        url: String,
        title: String
      }
    ],
    status: {
      type: String,
      enum: ['Available', 'Pending', 'Adopted', 'Fostered', 'Unavailable'],
      default: 'Available'
    },
    adoptionFee: {
      amount: {
        type: Number,
        default: 0
      },
      currency: {
        type: String,
        default: 'USD'
      }
    },
    medical: {
      vaccinated: {
        type: Boolean,
        default: false
      },
      spayedNeutered: {
        type: Boolean,
        default: false
      },
      microchipped: {
        type: Boolean,
        default: false
      },
      specialNeeds: {
        type: Boolean,
        default: false
      },
      specialNeedsDescription: String,
      medicalHistory: String
    },
    behavior: {
      goodWithChildren: {
        type: Boolean,
        default: true
      },
      goodWithDogs: {
        type: Boolean,
        default: true
      },
      goodWithCats: {
        type: Boolean,
        default: true
      },
      housetrained: {
        type: Boolean,
        default: false
      },
      energyLevel: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Very High'],
        default: 'Medium'
      },
      behaviorNotes: String
    },
    location: {
      city: {
        type: String,
        required: [true, 'City is required']
      },
      state: {
        type: String,
        required: [true, 'State is required']
      },
      country: {
        type: String,
        required: [true, 'Country is required']
      }
    },
    adoptionRequirements: [String],
    fosterInfo: {
      availableForFostering: {
        type: Boolean,
        default: false
      },
      currentFoster: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      fosterHistory: [
        {
          foster: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
          },
          startDate: Date,
          endDate: Date,
          notes: String
        }
      ]
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for applications
petSchema.virtual('applications', {
  ref: 'Application',
  localField: '_id',
  foreignField: 'pet',
  justOne: false
});

// Virtual for reviews
petSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'pet',
  justOne: false
});

// Index for search functionality
petSchema.index({
  name: 'text',
  breed: 'text',
  description: 'text',
  species: 'text',
  'location.city': 'text',
  'location.state': 'text'
});

const Pet = mongoose.model('Pet', petSchema);

export default Pet;
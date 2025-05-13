import mongoose from 'mongoose';

const conversationSchema = mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message'
    },
    subject: {
      type: String,
      default: 'No Subject'
    },
    relatedTo: {
      pet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pet'
      },
      application: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Application'
      }
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Ensure participants index for query optimizations
conversationSchema.index({ participants: 1 });

const Conversation = mongoose.model('Conversation', conversationSchema);

export default Conversation;
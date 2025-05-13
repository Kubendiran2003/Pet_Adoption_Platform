import mongoose from 'mongoose';

const messageSchema = mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: [true, 'Conversation is required']
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Sender is required']
    },
    content: {
      type: String,
      required: [true, 'Message content is required']
    },
    readBy: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        readAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    attachments: [
      {
        url: String,
        type: String, // image, document, etc.
        name: String
      }
    ]
  },
  {
    timestamps: true
  }
);

const Message = mongoose.model('Message', messageSchema);

export default Message;
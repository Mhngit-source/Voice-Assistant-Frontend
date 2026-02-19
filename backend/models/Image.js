import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  prompt: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  localPath: {
    type: String
  },
  aiModel: {
    type: String,
    default: 'pollinations'
  },
  size: {
    width: { type: Number, default: 512 },
    height: { type: Number, default: 512 }
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  isPublic: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Create index for faster queries
imageSchema.index({ userId: 1, createdAt: -1 });
imageSchema.index({ createdAt: -1 });

export default mongoose.model('Image', imageSchema);
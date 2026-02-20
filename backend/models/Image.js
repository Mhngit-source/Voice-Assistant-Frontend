import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  prompt: { type: String, required: true },
  imageUrl: { type: String, required: true },
  localPath: { type: String },
  aiModel: { type: String, default: 'pollinations' },
  size: {
    width: { type: Number, default: 512 },
    height: { type: Number, default: 512 }
  },
  createdAt: { type: Date, default: Date.now }
});

// Optional: add index for faster queries
imageSchema.index({ userId: 1, createdAt: -1 });

const Image = mongoose.model('Image', imageSchema);
export default Image;
import express from 'express';
import Image from '../models/Image.js';
import { authenticate } from './middleware.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Ensure images directory exists
const imagesDir = path.join(__dirname, '../../generated_images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Get all images for a user
router.get('/', authenticate, async (req, res) => {
  try {
    const images = await Image.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .lean();

    // Add full URLs
    const imagesWithUrls = images.map(img => ({
      id: img._id,
      prompt: img.prompt,
      imageUrl: img.imageUrl.startsWith('http') 
        ? img.imageUrl 
        : `${req.protocol}://${req.get('host')}${img.imageUrl}`,
      thumbnailUrl: img.imageUrl.startsWith('http')
        ? img.imageUrl
        : `${req.protocol}://${req.get('host')}${img.imageUrl}?thumbnail=true`,
      aiModel: img.aiModel,
      createdAt: img.createdAt,
      size: img.size
    }));

    res.json({
      success: true,
      images: imagesWithUrls,
      count: images.length
    });
  } catch (error) {
    console.error('Get images error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Get specific image
router.get('/:imageId', authenticate, async (req, res) => {
  try {
    const image = await Image.findOne({
      _id: req.params.imageId,
      userId: req.user.id
    }).lean();

    if (!image) {
      return res.status(404).json({ success: false, error: 'Image not found' });
    }

    // Check if it's a local file
    if (image.localPath && fs.existsSync(image.localPath)) {
      const imageBuffer = fs.readFileSync(image.localPath);
      const base64Image = imageBuffer.toString('base64');
      
      res.json({
        success: true,
        image: {
          id: image._id,
          prompt: image.prompt,
          imageData: `data:image/png;base64,${base64Image}`,
          aiModel: image.aiModel,
          createdAt: image.createdAt
        }
      });
    } else if (image.imageUrl) {
      res.json({
        success: true,
        image: {
          id: image._id,
          prompt: image.prompt,
          imageUrl: image.imageUrl,
          aiModel: image.aiModel,
          createdAt: image.createdAt
        }
      });
    } else {
      res.status(404).json({ success: false, error: 'Image file not found' });
    }
  } catch (error) {
    console.error('Get image error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Save image metadata
router.post('/', authenticate, async (req, res) => {
  try {
    const { prompt, imageUrl, localPath, aiModel = 'pollinations', size = { width: 512, height: 512 } } = req.body;

    const image = new Image({
      userId: req.user.id,
      prompt,
      imageUrl,
      localPath,
      aiModel,
      size
    });

    await image.save();

    res.status(201).json({
      success: true,
      image: {
        id: image._id,
        prompt: image.prompt,
        imageUrl: image.imageUrl,
        createdAt: image.createdAt
      }
    });
  } catch (error) {
    console.error('Save image error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Delete image
router.delete('/:imageId', authenticate, async (req, res) => {
  try {
    const image = await Image.findOne({
      _id: req.params.imageId,
      userId: req.user.id
    });

    if (!image) {
      return res.status(404).json({ success: false, error: 'Image not found' });
    }

    // Delete local file if exists
    if (image.localPath && fs.existsSync(image.localPath)) {
      try {
        fs.unlinkSync(image.localPath);
      } catch (fsError) {
        console.error('Error deleting file:', fsError);
      }
    }

    await Image.findByIdAndDelete(req.params.imageId);

    res.json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Serve image file
router.get('/file/:filename', async (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(imagesDir, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, error: 'File not found' });
    }

    // Check if thumbnail requested
    if (req.query.thumbnail === 'true') {
      // In a real app, you'd create/resize thumbnail here
      // For now, serve the original
      res.sendFile(filePath);
    } else {
      res.sendFile(filePath);
    }
  } catch (error) {
    console.error('Serve image error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

export default router;
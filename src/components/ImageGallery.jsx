import React, { useState, useEffect } from 'react';
import './ImageGallery.css';

const ImageGallery = ({ images, onRefresh }) => {
  const [loading, setLoading] = useState(false);
  const [localImages, setLocalImages] = useState(images || []);
  const [selectedImage, setSelectedImage] = useState(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    setLocalImages(images || []);
  }, [images]);

  useEffect(() => {
    if (onRefresh && (!images || images.length === 0)) {
      onRefresh();
    }
  }, []);

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const handleDownloadImage = async (image) => {
    setDownloading(true);
    try {
      const response = await fetch(image.imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = image.filename || `man-i-image-${image.id || Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download error:', error);
      if (image.dataUrl) {
        const a = document.createElement('a');
        a.href = image.dataUrl;
        a.download = image.filename || `man-i-image-${image.id || Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        alert('Failed to download image. Please try again.');
      }
    } finally {
      setDownloading(false);
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;

    try {
      const userData = localStorage.getItem('user');
      if (!userData) {
        alert('Please login to delete images');
        return;
      }

      const user = JSON.parse(userData);
      
      const response = await fetch(`http://localhost:5000/api/ai/delete-image/${imageId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setLocalImages(localImages.filter(img => img.id !== imageId));
        if (selectedImage && selectedImage.id === imageId) {
          setSelectedImage(null);
        }
        alert('Image deleted successfully!');
        if (onRefresh) onRefresh();
      } else {
        alert('Failed to delete image. Please try again.');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Error deleting image. Please try again.');
    }
  };

  return (
    <div className="image-gallery">
      {/* Gallery Header */}
      <div className="gallery-header">
        <h2>🎨 Image Gallery</h2>
        <div className="total-images-badge">
          <span className="total-label">Total Images</span>
          <span className="total-number">{localImages.length}</span>
        </div>
      </div>

      {/* Images Grid */}
      {localImages.length === 0 ? (
        <div className="empty-gallery">
          <div className="empty-icon">🖼️</div>
          <h3>No images yet</h3>
          <p>Generate images using the chat with commands like:</p>
          <div className="example-commands">
            <code>"generate image of a sunset"</code>
            <code>"create image of a cat"</code>
            <code>"draw a futuristic city"</code>
          </div>
          <button 
            className="go-to-chat-btn"
            onClick={() => window.location.href = '/dashboard'}
          >
            Go to Chat
          </button>
        </div>
      ) : (
        <div className="images-grid">
          {localImages.map((image) => (
            <div 
              key={image.id} 
              className="gallery-image-card"
              onClick={() => handleImageClick(image)}
            >
              <img 
                src={image.imageUrl} 
                alt={image.prompt || 'Generated image'} 
                loading="lazy"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300x300/e2e8f0/64748b?text=Image+Error';
                }}
              />
              <div className="image-overlay-enhanced">
                <span className="image-prompt">
                  {image.prompt?.length > 50 
                    ? image.prompt.substring(0, 50) + '...' 
                    : image.prompt || 'Generated image'
                  }
                </span>
                <div className="image-card-actions">
                  <button 
                    className="image-card-btn download-card-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownloadImage(image);
                    }}
                    title="Download"
                  >
                    ⬇️
                  </button>
                  <button 
                    className="image-card-btn delete-card-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteImage(image.id);
                    }}
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div className="image-modal" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Image Preview</h3>
              <button className="close-modal" onClick={handleCloseModal}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="modal-image-container">
                <img 
                  src={selectedImage.imageUrl} 
                  alt={selectedImage.prompt || 'Generated image'}
                />
              </div>
              
              <div className="modal-info">
                <p className="modal-prompt">
                  <strong>Prompt:</strong> {selectedImage.prompt || 'No prompt available'}
                </p>
                <p className="modal-date">
                  <strong>Created:</strong> {new Date(selectedImage.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                className="modal-btn download-btn"
                onClick={() => handleDownloadImage(selectedImage)}
                disabled={downloading}
              >
                {downloading ? '⏳ Downloading...' : '⬇️ Download'}
              </button>
              <button 
                className="modal-btn delete-btn"
                onClick={() => handleDeleteImage(selectedImage.id)}
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
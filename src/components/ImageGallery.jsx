import React, { useState, useEffect } from 'react';
import './ImageGallery.css';

const ImageGallery = ({ images }) => {
  const [localImages, setLocalImages] = useState(images || []);
  const [selectedImage, setSelectedImage] = useState(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    setLocalImages(images || []);
  }, [images]);

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

  return (
    <div className="image-gallery">
      <div className="gallery-header">
        <h2>🎨 Image Gallery</h2>
        <div className="total-images-badge">
          <span className="total-label">Total Images</span>
          <span className="total-number">{localImages.length}</span>
        </div>
      </div>

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
          <button className="go-to-chat-btn" onClick={() => window.location.href = '/dashboard'}>
            Go to Chat
          </button>
        </div>
      ) : (
        <div className="images-grid">
          {localImages.map((image) => (
            <div key={image.id} className="gallery-image-card" onClick={() => handleImageClick(image)}>
              <img src={image.imageUrl} alt={image.prompt || 'Generated image'} loading="lazy"
                onError={(e) => e.target.src = 'https://via.placeholder.com/300x300/e2e8f0/64748b?text=Image+Error'}
              />
              <div className="image-overlay-enhanced">
                <span className="image-prompt">
                  {image.prompt?.length > 50 ? image.prompt.substring(0, 50) + '...' : image.prompt || 'Generated image'}
                </span>
                <div className="image-card-actions">
                  <button className="download-btn" onClick={(e) => { e.stopPropagation(); handleDownloadImage(image); }} title="Download">
                    Download
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedImage && (
        <div className="image-modal" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Image Preview</h3>
              <button className="close-modal" onClick={handleCloseModal}>×</button>
            </div>
            <div className="modal-body">
              <div className="modal-image-container">
                <img src={selectedImage.imageUrl} alt={selectedImage.prompt || 'Generated image'} />
              </div>
              <div className="modal-info">
                <p className="modal-prompt"><strong>Prompt:</strong> {selectedImage.prompt || 'No prompt available'}</p>
                <p className="modal-date"><strong>Created:</strong> {new Date(selectedImage.timestamp).toLocaleString()}</p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="download-btn" onClick={() => handleDownloadImage(selectedImage)} disabled={downloading}>
                {downloading ? '⏳ Downloading...' : 'Download'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
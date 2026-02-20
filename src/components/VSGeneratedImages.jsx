import React, { useState, useEffect } from 'react';
import './VSGeneratedImages.css';

const VSGeneratedImages = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5001/api/images/list');
      const data = await response.json();
      if (data.success) {
        setImages(data.images);
      } else {
        setError('Failed to load images');
      }
    } catch (err) {
      console.error('Error fetching images:', err);
      setError('Could not connect to server');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (imageUrl, filename) => {
    setDownloading(true);
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download error:', error);
      alert('Download failed. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return <div className="vs-loading">Loading images...</div>;
  }

  if (error) {
    return <div className="vs-error">{error}</div>;
  }

  return (
    <div className="vs-explorer">
      <div className="vs-header">
        <h2>📁 GENERATED IMAGES</h2>
        <span className="vs-count">{images.length} file(s)</span>
      </div>

      {images.length === 0 ? (
        <div className="vs-empty">
          <p>No images yet. Generate one from the chat.</p>
        </div>
      ) : (
        <div className="vs-grid">
          {images.map((img) => (
            <div key={img.filename} className="vs-card">
              <div className="vs-thumb">
                <img 
                  src={img.url} 
                  alt={img.filename}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/150/2563eb/ffffff?text=Error';
                  }}
                />
              </div>
              <div className="vs-info">
                <span className="vs-filename" title={img.filename}>
                  {img.filename.length > 20 
                    ? img.filename.substring(0, 17) + '...' 
                    : img.filename}
                </span>
                <button 
                  className="vs-download-btn"
                  onClick={() => handleDownload(img.url, img.filename)}
                  disabled={downloading}
                >
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VSGeneratedImages;
import React, { useState, useRef,useEffect } from 'react';
import { Upload, X, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './ImageUpload.css';

function App() {
  const [images, setImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const [sparkles, setSparkles] = useState([]);

  useEffect(() => {
    const createSparkle = () => {
      const sparkle = {
        id: Math.random(),
        left: Math.random() * 100 + '%',
        top: Math.random() * 100 + '%',
        size: Math.random() * 4 + 2 + 'px',
      };
      setSparkles(prev => [...prev, sparkle]);
      setTimeout(() => {
        setSparkles(prev => prev.filter(s => s.id !== sparkle.id));
      }, 3000);
    };

    const interval = setInterval(createSparkle, 200);
    return () => clearInterval(interval);
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    );
    
    addNewImages(files);
  };

  const handleFileSelect = (e) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      addNewImages(files);
    }
  };

  const addNewImages = (files) => {
    const newImages = files.map(file => ({
      file,
      description: '',
      preview: URL.createObjectURL(file),
      status: 'pending'
    }));
    
    setImages(prev => [...prev, ...newImages]);
  };

  const handleDescriptionChange = (index, description) => {
    setImages(prev => prev.map((img, i) => 
      i === index ? { ...img, description } : img
    ));
  };

  const handleUpload = async (index) => {
    const image = images[index];
    if (!image.description) {
      alert('Please add a description before uploading');
      return;
    }

    setImages(prev => prev.map((img, i) => 
      i === index ? { ...img, status: 'uploading' } : img
    ));

    try {
      const formData = new FormData();
      formData.append('image', image.file);
      formData.append('description', image.description);

      await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      setImages(prev => prev.map((img, i) => 
        i === index ? { ...img, status: 'success' } : img
      ));
    } catch (error) {
      setImages(prev => prev.map((img, i) => 
        i === index ? { ...img, status: 'error' } : img
      ));
    }
  };

  const removeImage = (index) => {
    setImages(prev => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#E066FF] to-[#8A7CFF] p-8 pt-[6rem]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          Image Upload
        </h1>
        
        {/* Drop Zone */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            bg-white/10 backdrop-blur-lg border-2 border-dashed rounded-lg p-8 
            text-center cursor-pointer transition-colors duration-200 ease-in-out
            ${isDragging 
              ? 'border-white border-opacity-80' 
              : 'border-white/40 hover:border-white/60'
            }
          `}
        >
          <motion.div
            initial={{ scale: 1 }}
            animate={{ 
              scale: isDragging ? 1.1 : 1,
              rotate: isDragging ? [0, -5, 5, -5, 5, 0] : 0
            }}
            transition={{ duration: 0.3 }}
          >
            <Upload className="w-12 h-12 mx-auto text-white mb-4" />
            <p className="text-white text-opacity-90">
              Drag and drop images here, or click to browse
            </p>
          </motion.div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </motion.div>

        {/* Image List */}
        <motion.div 
          className="mt-8 space-y-4"
          layout
        >
          <AnimatePresence>
            {images.map((image, index) => (
              <motion.div
                key={image.preview}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                layout
                className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/20"
              >
                <div className="flex items-start gap-4">
                  <motion.div 
                    className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-black/20"
                    whileHover={{ scale: 1.05 }}
                  >
                    <img
                      src={image.preview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-white truncate">
                        {image.file.name}
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeImage(index)}
                        className="text-white/70 hover:text-white"
                      >
                        <X className="w-5 h-5" />
                      </motion.button>
                    </div>
                    
                    <input
                      type="text"
                      placeholder="Add a description..."
                      value={image.description}
                      onChange={(e) => handleDescriptionChange(index, e.target.value)}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-sm text-white placeholder-white/50 focus:outline-none focus:border-white/40"
                      disabled={image.status === 'success'}
                    />
                    
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-sm text-white/70">
                        {(image.file.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                      
                      {image.status === 'pending' && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleUpload(index)}
                          className="px-4 py-1 text-sm font-medium text-white bg-white/20 rounded-md hover:bg-white/30 transition-colors"
                        >
                          Upload
                        </motion.button>
                      )}
                      
                      {image.status === 'uploading' && (
                        <motion.span 
                          className="text-sm text-white/90"
                          animate={{ opacity: [1, 0.5, 1] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                        >
                          Uploading...
                        </motion.span>
                      )}
                      
                      {image.status === 'success' && (
                        <motion.span 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="text-sm text-green-400 flex items-center gap-1"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Uploaded
                        </motion.span>
                      )}
                      
                      {image.status === 'error' && (
                        <span className="text-sm text-red-400">Upload failed</span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default App;
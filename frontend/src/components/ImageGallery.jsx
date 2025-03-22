import React, { useState, useEffect,useRef } from 'react';
import { Calendar, Image as ImageIcon, X,Upload } from 'lucide-react';
// import ImageUpload2 from './ImageUpload2'
import image from '../assets/nurse-holding-hand.png';
const ImageGallery = () => {
  const [uploaded,setUploaded] = useState(false);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  ////////////////////////////////////////////// <----- yaha dekh bhai
  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('image', selectedFile);

      await fetch('http://127.0.0.1:5000/upload-image', {
        method: 'POST',
        body: formData,
      }).then((response) => {
        if(!response.ok) {
          throw new Error("")
        }
        return response.json()
      }).then((data) => {
        if(!data.matches) {
          // No matches found
        } else {
          setImages(data.matches)
        }
      }).catch((error) => {
        console.log(error)
      })

    } catch (error) {
      console.error('Upload failed:', error);
      setError(err.message);

    } finally {
      setIsUploading(false);
      setLoading(false);
      setUploaded(true);
      console.log('Upload successful');
    }
  };
  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  
  const handleRemove = () => {
    setPreview(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      const input = fileInputRef.current;
      if (input) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        input.files = dataTransfer.files;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
  };
  
  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const openPreview = (image) => {
    setSelectedImage(image);
    document.body.style.overflow = 'hidden';
  };

  const closePreview = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-[#E066FF] to-[#8A7CFF] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-[#E066FF] to-[#8A7CFF] flex items-center justify-center">
        <div className="text-white text-xl">Error: {error}</div>
      </div>
    );
  }
  if(uploaded){
  return (
    
    <div className="min-h-screen bg-gradient-to-r from-[#E066FF] to-[#8A7CFF] p-8  pt-[5rem]">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          Gallery
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl overflow-hidden shadow-lg transform transition-transform hover:scale-105 cursor-pointer"
              onClick={() => openPreview(item)}
            >
              <div className="relative h-48 overflow-hidden">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.description}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <ImageIcon className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="p-6">
                <p className="text-gray-800 text-lg mb-4">{item.description}</p>
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="text-sm">
                    {new Date(item.timestamp).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Preview */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 pt-[5rem]">
          <div className="relative max-w-4xl w-full bg-white rounded-xl overflow-hidden">
            <button
              onClick={closePreview}
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-opacity"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={selectedImage.image}
              alt={selectedImage.description}
              className="w-full h-[70vh] object-contain"
            />
            <div className="p-6 bg-white">
              <p className="text-gray-800 text-xl mb-4">{selectedImage.description}</p>
              <div className="flex items-center text-gray-600">
                <Calendar className="w-5 h-5 mr-2" />
                <span>
                  {new Date(selectedImage.uploadedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );}
  return (
    <div className="min-h-screen bg-gradient-to-r from-[#E066FF] to-[#8A7CFF] flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Image Upload</h1>
        
        <div className="w-full">
          {!preview ? (
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">
                  Drop your image here, or{' '}
                  <span className="text-blue-600 hover:text-blue-500">browse</span>
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  Supports PNG, JPG, GIF
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileSelect}
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <button
                  onClick={handleRemove}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  title="Remove image"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <button
                onClick={handleUpload}
                disabled={isUploading}
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? 'Uploading...' : 'Upload Image'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageGallery;
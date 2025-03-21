import React, { useState, useEffect } from 'react';
import { Calendar, Image as ImageIcon, X } from 'lucide-react';
import ImageUpload from './ImageUpload'
import image from '../assets/nurse-holding-hand.png';
const ImageGallery = () => {
  const [uploaded,setUploaded] = useState(false);
  const [images, setImages] = useState([{imageUrl: 'src/assets/nurse-holding-Hand.png' , description:"YO YO Honey Singh" , uploadedAt:"10/3/2025"},
    {imageUrl: 'https://i.imgur.com/DPWhTGX.jpeg' , description:"hvcytewvgwdgcvdgywvc" , uploadedAt:"10/3/2025"}
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    // try {
    //   endpoint dal do
    //   const response = await fetch('api/images');
    //   if (!response.ok) {
    //     throw new Error('Failed to fetch images');
    //   }
    //   const data = await response.json();
    //   setImages(data);
    // } catch (err) {
    //   setError(err.message);
    // } finally {
    //   setLoading(false);
    // }
    setLoading(false);
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
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
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
                    {new Date(item.uploadedAt).toLocaleDateString('en-US', {
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
              src={selectedImage.imageUrl}
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
    <ImageUpload />
  );
};

export default ImageGallery;
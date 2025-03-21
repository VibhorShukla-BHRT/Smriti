import React, { useState } from 'react';
import { MapPin, Plus, Navigation } from 'lucide-react';

function Locations() {
  const [locations, setLocations] = useState([]);
  const [formData, setFormData] = useState({
    longitude: '',
    latitude: '',
    description: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.longitude || !formData.latitude || !formData.description) return;

    setLocations([
      ...locations,
      {
        id: Date.now(),
        ...formData
      }
    ]);

    setFormData({
      longitude: '',
      latitude: '',
      description: ''
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 pt-[5rem]">
      <div className="min-h-screen backdrop-blur-sm bg-white/5 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-r from-white/40 to-white/30 backdrop-blur-xl rounded-3xl p-8 shadow-2xl ring-1 ring-white/20 mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-8 flex items-center gap-3">
              <Navigation className="w-10 h-10 rotate-45" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700">
                Location Explorer
              </span>
            </h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-gray-700 text-sm font-medium ml-1">Longitude</label>
                  <input
                    type="text"
                    placeholder="Enter longitude..."
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                    className="w-full bg-white/60 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-gray-700 text-sm font-medium ml-1">Latitude</label>
                  <input
                    type="text"
                    placeholder="Enter latitude..."
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                    className="w-full bg-white/60 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-gray-700 text-sm font-medium ml-1">Description</label>
                  <input
                    type="text"
                    placeholder="Enter description..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-white/60 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transform hover:scale-[1.02] transition-all duration-200 shadow-lg shadow-indigo-500/20"
              >
                <Plus className="w-5 h-5" />
                Add New Location
              </button>
            </form>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {locations.map((location) => (
              <div
                key={location.id}
                className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 shadow-xl ring-1 ring-white/20 transform hover:scale-105 hover:rotate-1 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors duration-200">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">Location Details</h3>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="bg-white/5 rounded-lg p-3 group-hover:bg-white/10 transition-colors duration-200">
                    <p className="text-white/80">
                      <span className="font-medium text-white">Longitude:</span> {location.longitude}
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 group-hover:bg-white/10 transition-colors duration-200">
                    <p className="text-white/80">
                      <span className="font-medium text-white">Latitude:</span> {location.latitude}
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 group-hover:bg-white/10 transition-colors duration-200">
                    <p className="text-white/80">
                      <span className="font-medium text-white">Description:</span>
                      <br />
                      {location.description}
                    </p>
                  </div>
                  <div className='pl-1 pr-1 pt-1 pb-1 '>
                    <button
                    onClick={() => {
                        const homeLat = 21.2514;   // Default Home Latitude
                        const homeLng = 81.6296;   // Default Home Longitude
                        const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${location.latitude},${location.longitude}&destination=${homeLat},${homeLng}`;
                        window.open(googleMapsUrl, '_blank');
                    }}
                    className="bg-white text-[#a39be8] text-xl font-semibold py-2 px-2 rounded-lg shadow hover:bg-gray-100 transition"
                    >
                    Open in Google Maps
                    </button>
                    </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Locations;

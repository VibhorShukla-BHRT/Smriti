import React from 'react';
import { Heart, Users, Calendar, Bell, Shield, Brain,MapPin, CalendarDays} from 'lucide-react';
import image from '../assets/nurse-holding-hand.png'
function FeatureCard({ title, description }) {
  return (
    <div className="bg-white/50 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:shadow-xl transition-all">
      <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
        {/* <Icon className="h-6 w-6 text-purple-600" /> */}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-[#E066FF] to-[#8A7CFF] pt-[4rem]">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        {/* comment */}

        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="lg:w-1/2">
            <h1 className="text-5xl font-bold text-white mb-6">
              Supporting Memory, Enriching Lives
            </h1>
            <p className="text-xl text-purple-50 mb-8">
              Smriti provides comprehensive support for individuals with Alzheimer's and memory disorders, helping them maintain independence and connection with loved ones.
            </p>
            <div className="flex space-x-4">
              <button className="bg-white text-purple-600 px-6 py-3 rounded-lg hover:bg-purple-50 transition-colors font-semibold">
                Start Your Journey
              </button>
              <button className="border-2 border-white text-white px-6 py-3 rounded-lg hover:bg-white/10 transition-colors font-semibold">
                Learn More
              </button>
            </div>
          </div>
          <div className="lg:w-1/2">
            <img
              src={image}
              alt="Elderly person with caregiver"
              className="rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className=" py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            How Smriti Helps
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={Calendar}
              title="Daily Reminders"
              description="Gentle reminders for medications, appointments, and daily activities to maintain routine and independence."
            />
            <FeatureCard
              icon={Users}
              title="Family Connection"
              description="Stay connected with loved ones through simplified communication tools and shared memories."
            />
            <FeatureCard
              icon={Bell}
              title="Smart Alerts"
              description="Intelligent monitoring system that alerts caregivers when assistance might be needed."
            />
            <FeatureCard
              icon={Heart}
              title="Emotional Support"
              description="Access to resources and community support for both patients and caregivers."
            />
            <FeatureCard
              icon={Shield}
              title="Safe Environment"
              description="Location tracking and home safety features for peace of mind."
            />
            <FeatureCard
              icon={Brain}
              title="Memory Exercises"
              description="Engaging cognitive activities designed to help maintain mental acuity."
            />
            <FeatureCard
              icon={MapPin}
              title="ReLocate"
              description="Map based support to get back home safely in case of wandering or getting lost."
            />
            <FeatureCard
              icon={CalendarDays}
              title="Event Management"
              description="Manage and remember events on the Calendar."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
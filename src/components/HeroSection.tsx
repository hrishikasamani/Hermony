import React from 'react';
import { CalendarIcon, Users2Icon, HeartHandshakeIcon } from 'lucide-react';

const HeroSection: React.FC = () => {

  return (
    <section className="w-full py-24 md:py-32 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div className="order-2 md:order-1">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight">
            Find Your Perfect <span className="text-purple-600">Balance</span>{' '}
            in Tech
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-600">
            Hermony helps women in tech harmonize their professional and
            personal lives through smart scheduling, mentorship, and community
            support.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full text-lg font-medium transition-colors">
              Get Started Free
            </button>
            <button className="border border-purple-600 text-purple-600 px-8 py-3 rounded-full text-lg font-medium hover:bg-purple-50 transition-colors">
              Watch Demo
            </button>
          </div>
          <div className="mt-12 flex items-center gap-4">
            <div className="flex -space-x-2">
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80" alt="User avatar" className="w-10 h-10 rounded-full border-2 border-white" />
              <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80" alt="User avatar" className="w-10 h-10 rounded-full border-2 border-white" />
              <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80" alt="User avatar" className="w-10 h-10 rounded-full border-2 border-white" />
            </div>
            <p className="text-gray-600">
              <span className="font-medium">3,000+</span> women already finding
              harmony
            </p>
          </div>
        </div>
        <div className="order-1 md:order-2 flex justify-center">
          <div className="relative p-8">
            <div className="absolute top-0 left-0 bg-purple-100 p-4 rounded-2xl shadow-md">
              <CalendarIcon className="h-8 w-8 text-purple-600" />
              <p className="font-medium mt-1">Smart Scheduling</p>
            </div>
            <div className="absolute bottom-0 right-0 bg-teal-100 p-4 rounded-2xl shadow-md">
              <Users2Icon className="h-8 w-8 text-teal-600" />
              <p className="font-medium mt-1">Mentorship</p>
            </div>
            <div className="absolute bottom-0 left-0 bg-amber-100 p-4 rounded-2xl shadow-md">
              <HeartHandshakeIcon className="h-8 w-8 text-amber-600" />
              <p className="font-medium mt-1">Community</p>
            </div>
            <img src="https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80" alt="Woman working on laptop" className="rounded-2xl shadow-xl w-[400px] h-auto object-cover z-10 relative" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
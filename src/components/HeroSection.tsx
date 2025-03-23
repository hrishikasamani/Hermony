import React from 'react';
import { CalendarIcon, Users2Icon, HeartHandshakeIcon } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <section className="w-full py-24 md:py-32 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div className="order-2 md:order-1">
          <h1 className="text-4xl playfair-display-custom md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight">
            Find Your Perfect <span className="text-purple-600 playfair-display-custom italic">Harmony</span>{' '}
            in Tech
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-500 playfair-display-custom">
            Hermony helps women in tech harmonize their professional and
            personal lives through smart scheduling, mentorship, and community
            support.
          </p>
        </div>
        <div className="order-1 md:order-2 flex justify-center">
          <div className="space-y-6">
            <img 
              src="https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80" 
              alt="Woman working on laptop" 
              className="rounded-2xl shadow-xl w-[400px] h-auto object-cover"
            />
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl shadow-md flex flex-col items-center text-center hover:bg-purple-100 transition-colors">
                <Users2Icon className="h-8 w-8" />
                <p className="font-medium mt-2 playfair-display-custom text-sm">Community</p>
              </div>
              <div className="p-4 rounded-2xl shadow-md flex flex-col items-center text-center hover:bg-purple-100 transition-colors">
                
                <HeartHandshakeIcon className="h-8 w-8" />
                <p className="font-medium mt-2 playfair-display-custom text-sm">Well-Being</p>
              </div>
              <div className="p-4 rounded-2xl shadow-md flex flex-col items-center text-center hover:bg-purple-100 transition-colors">
                <CalendarIcon className="h-8 w-8" />
                <p className="font-medium mt-2 playfair-display-custom text-sm">Smart Scheduling</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
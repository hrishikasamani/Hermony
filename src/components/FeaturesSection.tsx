import React from 'react';
import FeatureCard from './FeatureCard';
import { CalendarCheckIcon, UsersIcon, NetworkIcon, HeartPulseIcon, TrendingUpIcon } from 'lucide-react';

const FeaturesSection: React.FC = () => {

  const features = [{
    title: 'Smart Balance Scheduler',
    description: 'Integrate work calendars with personal priorities. Get boundary alerts and block off personal time with No-Zone feature.',
    icon: <CalendarCheckIcon className="h-8 w-8 text-purple-600" />,
    color: 'bg-purple-50',
    image: 'https://images.unsplash.com/photo-1506784365847-bbad939e9335?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
  }, {
    title: 'Peer-to-Peer Mentoring Hub',
    description: 'Get matched with mentors based on skills and life stage. Schedule quick micro-mentoring sessions and join peer circles.',
    icon: <UsersIcon className="h-8 w-8 text-teal-600" />,
    color: 'bg-teal-50',
    image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
  }, {
    title: 'Networking Made Simple',
    description: 'Browse curated opportunities, schedule bite-sized coffee chats, and connect in a safe community forum.',
    icon: <NetworkIcon className="h-8 w-8 text-amber-600" />,
    color: 'bg-amber-50',
    image: 'https://images.unsplash.com/photo-1573164574572-cb89e39749b4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
  }, {
    title: 'Well-Being Companion',
    description: 'Track burnout signs, access self-care resources, and get personalized nudges from Balance Buddy AI.',
    icon: <HeartPulseIcon className="h-8 w-8 text-rose-600" />,
    color: 'bg-rose-50',
    image: 'https://images.unsplash.com/photo-1552581234-26160f608093?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
  }, {
    title: 'Career Growth Dashboard',
    description: 'Track skills and goals with manageable steps that balance career advancement with well-being.',
    icon: <TrendingUpIcon className="h-8 w-8 text-blue-600" />,
    color: 'bg-blue-50',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
  }];
  return (
  <section id="features" className="w-full py-16 md:py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            Everything You Need to{' '}
            <span className="text-purple-600">Thrive</span>
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Hermony combines smart tools, community support, and mentorship to
            help you succeed professionally without sacrificing personal
            well-being.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => <FeatureCard key={index} title={feature.title} description={feature.description} icon={feature.icon} color={feature.color} image={feature.image} />)}
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;
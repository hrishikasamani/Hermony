// import React from 'react';
// import Header from './components/Header';
// import HeroSection from './components/HeroSection';
// import FeaturesSection from './components/FeaturesSection';
// import TestimonialsSection from './components/TestimonialsSection';
// import CTASection from './components/CTASection';
// import Footer from './components/Footer';
// import './index.css';  // Tailwind styles
// import './App.css';     // Custom styles

// const App: React.FC = () => {
//   return <div className="w-full min-h-screen bg-gradient-to-b from-purple-50 to-white">
//       <Header />
//       <main>
//         <HeroSection />
//         <FeaturesSection />
//         <TestimonialsSection />
//         <CTASection />
//       </main>
//       <Footer />
//     </div>;
// }

// export default App;


import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import TestimonialsSection from './components/TestimonialsSection';
import CTASection from './components/CTASection';
import Footer from './components/Footer';
import WellbeingChatbot from './components/WellbeingChatbot'; // Add this import
import './index.css';  // Tailwind styles
import './App.css';     // Custom styles
import SmartBalanceScheduler from './components/SmartBalanceScheduler';
import { NetworkingRoadmap } from './components/NetworkingRoadmap';
import CareerGrowthDashboard from './components/CareerGrowthDashboard';
import ScheduleAnalytics from './components/ScheduleStats';
import MentoringHub from './components/MentoringHub';

// Create a Home component that contains your existing layout
const Home = () => {
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Home />} />
        <Route path="/wellbeing" element={<WellbeingChatbot />} />
        <Route path="/scheduler" element={<SmartBalanceScheduler />} />
        <Route path="/networking" element={<NetworkingRoadmap />} />
        <Route path="/career" element={<CareerGrowthDashboard />} />
        <Route path="/analytics" element={<ScheduleAnalytics />} />
        <Route path="/mentoring" element={<MentoringHub />} />
      </Routes>
    </Router>
  );
};

export default App;
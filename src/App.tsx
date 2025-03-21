import React from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { FeaturesSection } from './components/FeaturesSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { CTASection } from './components/CTASection';
import { Footer } from './components/Footer';
import './index.css';  // Tailwind styles
import './app.css';     // Custom styles

const App: React.FC = () => {
  return <div className="w-full min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </div>;
}

export default App;
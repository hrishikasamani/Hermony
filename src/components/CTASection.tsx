import React from 'react';

const CTASection: React.FC = () => {

  return (
    <section className="w-full py-16 md:py-24 px-6">
      <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 playfair-display-custom">
            Women <span className="text-purple-600 playfair-display-custom italic playfair-display-custom">Thriving</span> Together
          </h2>
          <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto playfair-display-custom">
            Join thousands of women in tech who have found their perfect balance
            with Hermony.
          </p>
        </div>
      <div className="max-w-5xl mx-auto bg-gradient-to-r from-purple-600 to-teal-500 rounded-3xl overflow-hidden shadow-xl">
      
        <div className="p-8 md:p-12 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl playfair-display-custom font-bold text-white leading-tight">
              Ready to Find Your Harmony?
            </h2>
            <p className="mt-4 playfair-display-custom text-purple-100 text-lg">
              Join Hermony today and connect with a community of women who are
              harmonizing ambition with well-being.
            </p>
          </div>
          <div className="hidden md:block">
            <img src="https://images.unsplash.com/photo-1543269664-56d93c1b41a6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80" alt="Women collaborating" className="rounded-xl shadow-lg" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTASection;
import React from 'react';

const TestimonialsSection: React.FC = () => {

  const testimonials = [{
    quote: 'Hermony helped me find balance between my role as a tech lead and being a mom of two. The mentorship has been invaluable.',
    name: 'Hrishika Samani',
    title: 'Student at Northeastern University',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80'
  }, {
    quote: 'The smart scheduling feature alone saved my sanity. I finally have guilt-free personal time while still advancing my career.',
    name: 'Preksha Patil',
    title: 'Student at Northeastern University',
    image: 'https://images.unsplash.com/photo-157349701ls9940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80'
  }, {
    quote: 'I found my mentor through Hermony and she helped me navigate my first leadership role while maintaining work-life balance.',
    name: 'Dhanshree',
    title: 'Student at Northeastern University',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80'
  }];

  return (
    <section id="testimonials" className="w-full py-16 md:py-24 px-6 bg-purple-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 playfair-display-custom">
            Women <span className="text-purple-600 playfair-display-custom italic playfair-display-custom">Thriving</span> Together
          </h2>
          <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto playfair-display-custom">
            Join thousands of women in tech who have found their perfect balance
            with Hermony.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => <div key={index} className="bg-white p-6 rounded-2xl shadow-md">
              <div className="flex items-center mb-4">
                <div className="text-purple-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>
              </div>
              <p className="text-gray-600 mb-6 italic playfair-display-custom">"{testimonial.quote}"</p>
              <div className="flex items-center">
                {/* <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full mr-4 object-cover" /> */}
                <div>
                  <p className="font-medium text-gray-800 text-left playfair-display-custom">
                    {testimonial.name}
                  </p>
                  <p className="text-gray-500 text-sm playfair-display-custom">{testimonial.title}</p>
                </div>
              </div>
            </div>)}
        </div>
      </div>
    </section>
  );
}

export default TestimonialsSection;
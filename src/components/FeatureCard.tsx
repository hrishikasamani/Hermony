import React from 'react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  image: string;
}

const FeatureCard = ({
  title,
  description,
  icon,
  color,
  image
}: FeatureCardProps) => {

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow overflow-hidden flex flex-col h-full">
      <div className="h-48 overflow-hidden">
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </div>
      <div className="p-6 flex-grow">
        <div className={`${color} p-3 inline-flex rounded-xl mb-4`}>{icon}</div>
        <h3 className="playfair-display-custom text-xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
      <div className="p-6 pt-0">
        <button className="text-purple-600 font-medium hover:text-purple-800 transition-colors flex items-center">
          Learn more
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default FeatureCard;
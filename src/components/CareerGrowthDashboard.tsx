import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface Skill {
  id: number;
  name: string;
  level: number; // 0 to 100
  icon: string; // Add icon URL
}

interface Certification {
  id: number;
  name: string;
  completed: boolean;
  icon: string; // Add icon URL
}

interface Goal {
  id: number;
  description: string;
  completed: boolean;
  icon: string; // Add icon URL
}

interface Recommendation {
  id: number;
  type: 'resource' | 'step';
  title: string;
  description: string;
  icon: string; // Add icon URL
}

const CareerGrowthDashboard: React.FC = () => {
  // State for Skills
  const [skills, setSkills] = useState<Skill[]>([
    { id: 1, name: 'Python', level: 60, icon: 'https://img.icons8.com/color/48/000000/python.png' },
    { id: 2, name: 'SQL', level: 40, icon: 'https://img.icons8.com/color/48/000000/sql.png' },
    { id: 3, name: 'JavaScript', level: 75, icon: 'https://img.icons8.com/color/48/000000/javascript.png' },
  ]);

  // State for Certifications
  const [certifications, setCertifications] = useState<Certification[]>([
    { id: 1, name: 'AWS Certified Developer', completed: false, icon: 'https://img.icons8.com/color/48/000000/amazon-web-services.png' },
    { id: 2, name: 'Google UX Design Certificate', completed: true, icon: 'https://img.icons8.com/color/48/000000/google-logo.png' },
    { id: 3, name: 'Microsoft Azure Fundamentals', completed: false, icon: 'https://img.icons8.com/color/48/000000/microsoft.png' },
  ]);

  // State for Goals
  const [goals, setGoals] = useState<Goal[]>([
    { id: 1, description: 'Complete a Python project by end of month', completed: false, icon: 'https://img.icons8.com/color/48/000000/checklist.png' },
    { id: 2, description: 'Learn React basics in 2 weeks', completed: true, icon: 'https://img.icons8.com/color/48/000000/react-native.png' },
    { id: 3, description: 'Attend a tech conference this quarter', completed: false, icon: 'https://img.icons8.com/color/48/000000/conference-call.png' },
  ]);

  // State for Recommendations
  const [recommendations] = useState<Recommendation[]>([
    {
      id: 1,
      type: 'resource',
      title: 'Complete this Python course to level up',
      description: 'A 4-week course on Coursera to improve your Python skills.',
      icon: 'https://img.icons8.com/color/48/000000/online-class.png',
    },
    {
      id: 2,
      type: 'step',
      title: 'Learn SQL in 30-minute chunks this week',
      description: 'Break down SQL learning into daily 30-minute sessions.',
      icon: 'https://img.icons8.com/color/48/000000/clock.png',
    },
    {
      id: 3,
      type: 'resource',
      title: 'Enroll in a JavaScript advanced course',
      description: 'Deep dive into JavaScript with this Udemy course.',
      icon: 'https://img.icons8.com/color/48/000000/online-class.png',
    },
  ]);

  // Handlers
  const handleSkillLevelChange = (id: number, newLevel: number) => {
    setSkills(skills.map((skill) => (skill.id === id ? { ...skill, level: newLevel } : skill)));
  };

  const handleToggleCertification = (id: number) => {
    setCertifications(certifications.map((cert) => (cert.id === id ? { ...cert, completed: !cert.completed } : cert)));
  };

  const handleToggleGoal = (id: number) => {
    setGoals(goals.map((goal) => (goal.id === id ? { ...goal, completed: !goal.completed } : goal)));
  };

  return (
    <div className="py-16 bg-gradient-to-b from-purple-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back to Home Link */}
        <div className="mb-8">
          <Link
            to="/"
            className="text-purple-600 font-medium hover:text-purple-800 transition-colors flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Home
          </Link>
        </div>

        {/* Page Header */}
        <h2 className="text-4xl font-bold text-gray-900 text-center">
          Career Growth Dashboard
        </h2>
        <p className="mt-4 text-lg text-gray-600 text-center max-w-2xl mx-auto">
          Track your skills, certifications, and goals while balancing career growth with well-being.
        </p>

        {/* Skills Section */}
        <div className="mt-12">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">Your Skills</h3>
          <p className="text-gray-600 mb-6">Track your progress in key skills.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {skills.map((skill) => (
              <div key={skill.id} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
                <div className="flex items-center mb-4">
                  <img src={skill.icon} alt={skill.name} className="w-8 h-8 mr-3" />
                  <h4 className="text-lg font-semibold text-gray-800">{skill.name}</h4>
                </div>
                <p className="text-gray-600 mb-3">Level: {skill.level}%</p>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={skill.level}
                  onChange={(e) => handleSkillLevelChange(skill.id, parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #8b5cf6 ${skill.level}%, #e5e7eb ${skill.level}%)`,
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Certifications Section */}
        <div className="mt-16">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">Certifications</h3>
          <p className="text-gray-600 mb-6">Track your certifications and mark them as completed.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {certifications.map((cert) => (
              <div key={cert.id} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
                <div className="flex items-center mb-4">
                  <img src={cert.icon} alt={cert.name} className="w-8 h-8 mr-3" />
                  <h4 className="text-lg font-semibold text-gray-800">{cert.name}</h4>
                </div>
                <p className={`text-sm mb-4 ${cert.completed ? 'text-green-600' : 'text-yellow-600'}`}>
                  {cert.completed ? 'Completed' : 'In Progress'}
                </p>
                <button
                  onClick={() => handleToggleCertification(cert.id)}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    cert.completed
                      ? 'bg-purple-200 text-purple-800 hover:bg-purple-300'
                      : 'bg-purple-600 text-white hover:bg-purple-700'
                  }`}
                >
                  {cert.completed ? 'Mark as Incomplete' : 'Mark as Completed'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Goals Section */}
        <div className="mt-16">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">Goals</h3>
          <p className="text-gray-600 mb-6">Set and track your career goals.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {goals.map((goal) => (
              <div key={goal.id} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
                <div className="flex items-center mb-4">
                  <img src={goal.icon} alt="Goal" className="w-8 h-8 mr-3" />
                  <h4 className="text-lg font-semibold text-gray-800">{goal.description}</h4>
                </div>
                <p className={`text-sm mb-4 ${goal.completed ? 'text-green-600' : 'text-yellow-600'}`}>
                  {goal.completed ? 'Completed' : 'In Progress'}
                </p>
                <button
                  onClick={() => handleToggleGoal(goal.id)}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    goal.completed
                      ? 'bg-purple-200 text-purple-800 hover:bg-purple-300'
                      : 'bg-purple-600 text-white hover:bg-purple-700'
                  }`}
                >
                  {goal.completed ? 'Mark as Incomplete' : 'Mark as Completed'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations Section */}
        <div className="mt-16">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">Recommendations</h3>
          <p className="text-gray-600 mb-6">
            Personalized resources and steps to help you grow while maintaining well-being.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendations.map((rec) => (
              <div key={rec.id} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
                <div className="flex items-center mb-4">
                  <img src={rec.icon} alt={rec.type} className="w-8 h-8 mr-3" />
                  <h4 className="text-lg font-semibold text-gray-800">{rec.title}</h4>
                </div>
                <p className="text-gray-600 mb-4">{rec.description}</p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    rec.type === 'resource' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                  }`}
                >
                  {rec.type === 'resource' ? 'Resource' : 'Well-Being Step'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Custom CSS for Slider */}
      <style>
        {`
          input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 16px;
            height: 16px;
            background: #8b5cf6;
            border-radius: 50%;
            cursor: pointer;
            border: 2px solid #ffffff;
            box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
          }

          input[type="range"]::-moz-range-thumb {
            width: 16px;
            height: 16px;
            background: #8b5cf6;
            border-radius: 50%;
            cursor: pointer;
            border: 2px solid #ffffff;
            box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
          }
        `}
      </style>
    </div>
  );
};

export default CareerGrowthDashboard;
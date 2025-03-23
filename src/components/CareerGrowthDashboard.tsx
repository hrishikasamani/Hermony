import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';
import { ArrowLeftIcon, HeartPulseIcon } from 'lucide-react';

interface Skill {
  id: string;
  name: string;
  level: number; // 0 to 100
  icon: string;
}

interface Certification {
  id: string;
  name: string;
  completed: boolean;
  icon: string;
}

interface Goal {
  id: string;
  description: string;
  completed: boolean;
  icon: string;
}

interface Recommendation {
  id: number;
  type: 'resource' | 'step';
  title: string;
  description: string;
  icon: string;
}

const CareerGrowthDashboard: React.FC = () => {
  // State for Skills
  const [skills, setSkills] = useState<Skill[]>([
    { id: 'skill-1', name: 'Python', level: 60, icon: 'https://img.icons8.com/color/48/000000/python.png' },
    { id: 'skill-2', name: 'SQL', level: 40, icon: 'https://img.icons8.com/color/48/000000/sql.png' },
    { id: 'skill-3', name: 'JavaScript', level: 75, icon: 'https://img.icons8.com/color/48/000000/javascript.png' },
  ]);

  // State for Certifications
  const [certifications, setCertifications] = useState<Certification[]>([
    { id: 'cert-1', name: 'AWS Certified Developer', completed: false, icon: 'https://img.icons8.com/color/48/000000/amazon-web-services.png' },
    { id: 'cert-2', name: 'Google UX Design Certificate', completed: true, icon: 'https://img.icons8.com/color/48/000000/google-logo.png' },
    { id: 'cert-3', name: 'Microsoft Azure Fundamentals', completed: false, icon: 'https://img.icons8.com/color/48/000000/microsoft.png' },
  ]);

  // State for Goals
  const [goals, setGoals] = useState<Goal[]>([
    { id: 'goal-1', description: 'Complete a Python project by end of month', completed: false, icon: 'https://img.icons8.com/color/48/000000/checklist.png' },
    { id: 'goal-2', description: 'Learn React basics in 2 weeks', completed: true, icon: 'https://img.icons8.com/color/48/000000/react-native.png' },
    { id: 'goal-3', description: 'Attend a tech conference this quarter', completed: false, icon: 'https://img.icons8.com/color/48/000000/conference-call.png' },
  ]);

  // State for Recommendations
  const [recommendations] = useState<Recommendation[]>([
    {
      id: 1,
      type: 'resource',
      title: 'Complete this Python course to level up',
      description: 'A 4-week course on Coursera to improve your Python skills.',
      icon: 'https://img.icons8.com/color/48/e-learning.png',
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
      icon: 'https://img.icons8.com/color/48/e-learning.png',
    },
  ]);

  // State for Modal (Add/Edit)
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [modalType, setModalType] = useState<'skill' | 'certification' | 'goal' | null>(null);
  const [modalItemId, setModalItemId] = useState<string | null>(null);
  const [modalItemName, setModalItemName] = useState('');
  const [modalItemLevel, setModalItemLevel] = useState<number>(0);
  const navigate = useNavigate();

  // State for Confetti Animation
  const [showConfetti, setShowConfetti] = useState(false);

  // State for Dropdown Menu
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Handlers
  const handleSkillLevelChange = (id: string, newLevel: number) => {
    setSkills(skills.map((skill) => (skill.id === id ? { ...skill, level: newLevel } : skill)));
  };

  const handleToggleCertification = (id: string) => {
    const updatedCertifications = certifications.map((cert) =>
      cert.id === id ? { ...cert, completed: !cert.completed } : cert
    );
    setCertifications(updatedCertifications);
    if (updatedCertifications.find((cert) => cert.id === id)?.completed) {
      setShowConfetti(true);
    }
  };

  const handleToggleGoal = (id: string) => {
    const updatedGoals = goals.map((goal) =>
      goal.id === id ? { ...goal, completed: !goal.completed } : goal
    );
    setGoals(updatedGoals);
    if (updatedGoals.find((goal) => goal.id === id)?.completed) {
      setShowConfetti(true);
    }
  };

  const handleAddOrEditItem = () => {
    if (!modalItemName.trim()) return;

    if (modalMode === 'add') {
      if (modalType === 'skill') {
        const newId = `skill-${skills.length + 1}`;
        setSkills([
          ...skills,
          {
            id: newId,
            name: modalItemName,
            level: modalItemLevel,
            icon: 'https://img.icons8.com/color/48/000000/code.png',
          },
        ]);
      } else if (modalType === 'certification') {
        const newId = `cert-${certifications.length + 1}`;
        setCertifications([
          ...certifications,
          {
            id: newId,
            name: modalItemName,
            completed: false,
            icon: 'https://img.icons8.com/color/48/000000/certificate.png',
          },
        ]);
      } else if (modalType === 'goal') {
        const newId = `goal-${goals.length + 1}`;
        setGoals([
          ...goals,
          {
            id: newId,
            description: modalItemName,
            completed: false,
            icon: 'https://img.icons8.com/color/48/000000/checklist.png',
          },
        ]);
      }
    } else if (modalMode === 'edit' && modalItemId !== null) {
      if (modalType === 'skill') {
        setSkills(
          skills.map((skill) =>
            skill.id === modalItemId
              ? { ...skill, name: modalItemName, level: modalItemLevel }
              : skill
          )
        );
      } else if (modalType === 'certification') {
        setCertifications(
          certifications.map((cert) =>
            cert.id === modalItemId ? { ...cert, name: modalItemName } : cert
          )
        );
      } else if (modalType === 'goal') {
        setGoals(
          goals.map((goal) =>
            goal.id === modalItemId ? { ...goal, description: modalItemName } : goal
          )
        );
      }
    }

    setShowModal(false);
    setModalItemName('');
    setModalItemLevel(0);
    setModalType(null);
    setModalItemId(null);
    setModalMode('add');
  };

  const handleDeleteItem = (type: 'skill' | 'certification' | 'goal', id: string) => {
    if (type === 'skill') {
      setSkills(skills.filter((skill) => skill.id !== id));
    } else if (type === 'certification') {
      setCertifications(certifications.filter((cert) => cert.id !== id));
    } else if (type === 'goal') {
      setGoals(goals.filter((goal) => goal.id !== id));
    }
    setOpenMenuId(null); // Close the menu after deleting
  };

  const handleEditItem = (
    type: 'skill' | 'certification' | 'goal',
    id: string,
    name: string,
    level?: number
  ) => {
    setModalMode('edit');
    setModalType(type);
    setModalItemId(id);
    setModalItemName(name);
    setModalItemLevel(level !== undefined ? level : 0);
    setShowModal(true);
    setOpenMenuId(null); // Close the menu after clicking Edit
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openMenuId !== null && menuRefs.current[openMenuId]) {
        const menuElement = menuRefs.current[openMenuId];
        if (menuElement && !menuElement.contains(event.target as Node)) {
          setOpenMenuId(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openMenuId]);

  // Calculate Progress Overview
  const averageSkillLevel = skills.length
    ? Math.round(skills.reduce((sum, skill) => sum + skill.level, 0) / skills.length)
    : 0;
  const completedCertifications = certifications.filter((cert) => cert.completed).length;
  const completedGoals = goals.filter((goal) => goal.completed).length;

  // Reset Confetti after 3 seconds
  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  return (
    <div className="pb-10 bg-gradient-to-b from-purple-50 to-white min-h-screen">
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
        />
      )}
      <div className="">
        <header className="bg-purple-100 shadow-sm py-4 px-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <button onClick={() => navigate('/')} className="flex items-center playfair-display-custom text-purple-700 hover:text-purple-900">
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              <span>Back to Home</span>
            </button>
            <div className="flex items-center">
              <HeartPulseIcon className="h-6 w-6 text-rose-600 mr-2" />
              <h1 className="text-xl font-bold text-purple-800 playfair-display-custom">Career Growth Dashboard</h1>
            </div>
            <div className="w-24"></div>
          </div>
        </header>

        {/* Page Header */}
        {/* <h2 className="text-4xl playfair-display-custom font-bold text-gray-900 text-center">
          Career Growth Dashboard
        </h2> */}
        <p className="mt-4 text-lg playfair-display-custom text-gray-600 text-center max-w-2xl mx-auto">
          Track your skills, certifications, and goals while balancing career growth with well-being.
        </p>

        <div className='px-8'>
        {/* Progress Overview Section */}
        <div className="mt-12 bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h3 className="text-2xl font-semibold playfair-display-custom text-gray-900 mb-4">Progress Overview</h3>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Circular Progress for Average Skill Level */}
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    className="text-gray-200"
                    strokeWidth="10"
                    stroke="currentColor"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                  />
                  <circle
                    className="playfair-display-custom text-purple-600"
                    strokeWidth="10"
                    strokeDasharray={`${(averageSkillLevel / 100) * 251.2}, 251.2`}
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl playfair-display-custom font-bold text-gray-800">{averageSkillLevel}%</span>
                </div>
              </div>
              <p className="mt-2 playfair-display-custom text-gray-600">Average Skill Level</p>
            </div>
            {/* Completed Certifications */}
            <div className="flex flex-col items-center">
              <p className="text-3xl playfair-display-custom font-bold text-gray-800">{completedCertifications}</p>
              <p className="mt-2 playfair-display-custom text-gray-600">Certifications Completed</p>
            </div>
            {/* Completed Goals */}
            <div className="flex flex-col items-center">
              <p className="text-3xl playfair-display-custom font-bold text-gray-800">{completedGoals}</p>
              <p className="mt-2 playfair-display-custom text-gray-600">Goals Achieved</p>
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="mt-12">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl playfair-display-custom font-semibold text-gray-900">Your Skills</h3>
            <button
              onClick={() => {
                setModalMode('add');
                setModalType('skill');
                setShowModal(true);
              }}
              className="px-4 py-2 bg-purple-600 playfair-display-custom text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              Add New Skill
            </button>
          </div>
          <p className="text-gray-600 playfair-display-custom mb-6">Track your progress in key skills.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {skills.map((skill) => (
              <div key={skill.id} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 relative">
                {/* Three-Dot Menu */}
                <div className="absolute top-4 right-4">
                  <button
                    onClick={() => setOpenMenuId(openMenuId === skill.id ? null : skill.id)}
                    className="text-gray-600 playfair-display-custom hover:text-gray-800"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                  {openMenuId === skill.id && (
                    <div
                      ref={(el) => {
                        menuRefs.current[skill.id] = el;
                      }}
                      className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg z-10 border border-gray-100"
                    >
                      <button
                        onClick={() => handleEditItem('skill', skill.id, skill.name, skill.level)}
                        className="block w-full playfair-display-custom text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteItem('skill', skill.id)}
                        className="block w-full playfair-display-custom text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
                <div className="flex items-center mb-4">
                  <img src={skill.icon} alt={skill.name} className="w-8 h-8 mr-3" />
                  <h4 className="text-lg playfair-display-custom font-semibold text-gray-800">{skill.name}</h4>
                </div>
                <p className="text-gray-600 playfair-display-custom mb-3">Level: {skill.level}%</p>
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
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl playfair-display-custom font-semibold text-gray-900">Certifications</h3>
            <button
              onClick={() => {
                setModalMode('add');
                setModalType('certification');
                setShowModal(true);
              }}
              className="px-4 py-2 bg-purple-600 playfair-display-custom text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              Add New Certification
            </button>
          </div>
          <p className="text-gray-600 playfair-display-custom mb-6">Track your certifications and mark them as completed.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {certifications.map((cert) => (
              <div key={cert.id} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 relative">
                {/* Three-Dot Menu */}
                <div className="absolute top-4 right-4">
                  <button
                    onClick={() => setOpenMenuId(openMenuId === cert.id ? null : cert.id)}
                    className="text-gray-600 hover:text-gray-800 playfair-display-custom"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                  {openMenuId === cert.id && (
                    <div
                      ref={(el) => {
                        menuRefs.current[cert.id] = el;
                      }}
                      className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg z-10 border border-gray-100"
                    >
                      <button
                        onClick={() => handleEditItem('certification', cert.id, cert.name)}
                        className="block w-full playfair-display-custom text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteItem('certification', cert.id)}
                        className="block w-full playfair-display-custom text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
                <div className="flex items-center mb-4">
                  <img src={cert.icon} alt={cert.name} className="w-8 h-8 mr-3" />
                  <h4 className="text-lg font-semibold text-gray-800 playfair-display-custom">{cert.name}</h4>
                </div>
                <p className={`text-sm playfair-display-custom mb-4 ${cert.completed ? 'text-green-600' : 'text-yellow-600'}`}>
                  {cert.completed ? 'Completed' : 'In Progress'}
                </p>
                <button
                  onClick={() => handleToggleCertification(cert.id)}

                  className={`px-4 py-2 rounded-md transition-colors playfair-display-custom ${
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
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-semibold text-gray-900 playfair-display-custom">Goals</h3>
            <button
              onClick={() => {
                setModalMode('add');
                setModalType('goal');
                setShowModal(true);
              }}
              className="px-4 py-2 bg-purple-600 playfair-display-custom text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              Add New Goal
            </button>
          </div>
          <p className="text-gray-600 mb-6 playfair-display-custom">Set and track your career goals.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {goals.map((goal) => (
              <div key={goal.id} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 relative">
                {/* Three-Dot Menu */}
                <div className="absolute top-4 right-4">
                  <button
                    onClick={() => setOpenMenuId(openMenuId === goal.id ? null : goal.id)}
                    className="text-gray-600 hover:text-gray-800 playfair-display-custom"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                  {openMenuId === goal.id && (
                    <div
                      ref={(el) => {
                        menuRefs.current[goal.id] = el;
                      }}
                      className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg z-10 border border-gray-100"
                    >
                      <button
                        onClick={() => handleEditItem('goal', goal.id, goal.description)}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-800 playfair-display-custom"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteItem('goal', goal.id)}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-800 playfair-display-custom"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
                <div className="flex items-center mb-4">
                  <img src={goal.icon} alt="Goal" className="w-8 h-8 mr-3" />
                  <h4 className="text-lg font-semibold text-gray-800 playfair-display-custom">{goal.description}</h4>
                </div>
                <p className={`text-sm mb-4 playfair-display-custom ${goal.completed ? 'text-green-600' : 'text-yellow-600'}`}>
                  {goal.completed ? 'Completed' : 'In Progress'}
                </p>
                <button
                  onClick={() => handleToggleGoal(goal.id)}
                  className={`px-4 py-2 rounded-md transition-colors playfair-display-custom ${
                    goal.completed
                      ? 'bg-purple-200 text-purple-800 hover:bg-purple-300 '
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
          <h3 className="text-2xl font-semibold text-gray-900 mb-4 playfair-display-custom">Recommendations</h3>
          <p className="text-gray-600 mb-6 playfair-display-custom">
            Personalized resources and steps to help you grow while maintaining well-being.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendations.map((rec) => (
              <div key={rec.id} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
                <div className="flex items-center mb-4">
                  <img src={rec.icon} alt={rec.type} className="w-8 h-8 mr-3" />
                  <h4 className="text-lg font-semibold text-gray-800 playfair-display-custom">{rec.title}</h4>
                </div>
                <p className="text-gray-600 mb-4 playfair-display-custom">{rec.description}</p>
                <span
                  className={`inline-block px-3 py-1 rounded-full playfair-display-custom text-sm font-medium ${
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

      </div>

      {/* Add/Edit Item Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-gray-900 playfair-display-custom">
                {modalMode === 'add' ? 'Add New' : 'Edit'}{' '}
                {modalType === 'skill' ? 'Skill' : modalType === 'certification' ? 'Certification' : 'Goal'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-600 hover:text-gray-800 playfair-display-custom"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <input
              type="text"
              value={modalItemName}
              onChange={(e) => setModalItemName(e.target.value)}
              placeholder={`Enter ${modalType === 'skill' ? 'skill name' : modalType === 'certification' ? 'certification name' : 'goal description'}`}
              className="w-full playfair-display-custom p-2 border rounded-md text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-600 mb-4"
            />
            {modalType === 'skill' && (
              <div className="mb-4">
                <label className="block text-gray-600 mb-2 playfair-display-custom">Skill Level: {modalItemLevel}%</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={modalItemLevel}
                  onChange={(e) => setModalItemLevel(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #8b5cf6 ${modalItemLevel}%, #e5e7eb ${modalItemLevel}%)`,
                  }}
                />
              </div>
            )}
            <button
              onClick={handleAddOrEditItem}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors playfair-display-custom"
            >
              {modalMode === 'add' ? 'Add' : 'Update'}
            </button>
          </div>
        </div>
      )}

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
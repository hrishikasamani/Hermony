import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface UserProfile {
  id: string;
  name: string;
  role: 'mentor' | 'mentee';
  skills: string[];
  goals: string[];
  lifeStage: string;
  availability: { day: string; time: string }[];
  avatar: string;
}

interface Match {
  mentor: UserProfile;
  mentee: UserProfile;
  compatibilityScore: number;
}

const MentoringHub: React.FC = () => {
  // Sample user data (in a real app, this would come from a backend)
  const [users, setUsers] = useState<UserProfile[]>([
    {
      id: 'user-1',
      name: 'Alice Johnson',
      role: 'mentor',
      skills: ['Python', 'Javascript', 'Leadership'],
      goals: ['Work-life balance', 'Mentoring others'],
      lifeStage: 'Senior dev mom',
      availability: [
        { day: 'Monday', time: '10:00 AM - 12:00 PM' },
        { day: 'Wednesday', time: '2:00 PM - 4:00 PM' },
      ],
      avatar: 'https://img.icons8.com/color/96/000000/user-female-circle.png',
    },
    {
      id: 'user-2',
      name: 'Bob Smith',
      role: 'mentee',
      skills: ['Python', 'Sql'],
      goals: ['Work-life balance', 'Career growth'],
      lifeStage: 'Junior developer seeking work-life tips',
      availability: [
        { day: 'Monday', time: '11:00 AM - 1:00 PM' },
        { day: 'Thursday', time: '3:00 PM - 5:00 PM' },
      ],
      avatar: 'https://img.icons8.com/color/96/000000/user-male-circle.png',
    },
    {
      id: 'user-3',
      name: 'Clara Davis',
      role: 'mentor',
      skills: ['Javascript', 'React', 'Project management'],
      goals: ['Career growth', 'Mentoring others'],
      lifeStage: 'Mid-level dev',
      availability: [
        { day: 'Tuesday', time: '9:00 AM - 11:00 AM' },
        { day: 'Friday', time: '1:00 PM - 3:00 PM' },
      ],
      avatar: 'https://img.icons8.com/color/96/000000/user-female-circle.png',
    },
    {
      id: 'user-4',
      name: 'David Lee',
      role: 'mentor',
      skills: ['Python', 'Data science', 'Leadership'],
      goals: ['Work-life balance', 'Career growth'],
      lifeStage: 'Senior data scientist',
      availability: [
        { day: 'Monday', time: '1:00 PM - 3:00 PM' },
        { day: 'Thursday', time: '10:00 AM - 12:00 PM' },
      ],
      avatar: 'https://img.icons8.com/color/96/000000/user-male-circle.png',
    },
    {
      id: 'user-5',
      name: 'Emma Brown',
      role: 'mentor',
      skills: ['Sql', 'Database management', 'Mentoring'],
      goals: ['Mentoring others', 'Career growth'],
      lifeStage: 'Senior database admin',
      availability: [
        { day: 'Wednesday', time: '11:00 AM - 1:00 PM' },
        { day: 'Friday', time: '2:00 PM - 4:00 PM' },
      ],
      avatar: 'https://img.icons8.com/color/96/000000/user-female-circle.png',
    },
  ]);

  // State for the current user's profile
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [skillsInput, setSkillsInput] = useState('');
  const [goalsInput, setGoalsInput] = useState('');
  const [lifeStageInput, setLifeStageInput] = useState('');
  const [availabilityInput, setAvailabilityInput] = useState<{ day: string; time: string }[]>([]);
  const [roleInput, setRoleInput] = useState<'mentor' | 'mentee'>('mentee');
  const [showMatchedMessage, setShowMatchedMessage] = useState(false);
  // State for the connect confirmation modal
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [selectedMentorName, setSelectedMentorName] = useState('');

  // AI-driven matching algorithm (simplified for the hackathon)
  const calculateCompatibility = (mentee: UserProfile, mentor: UserProfile): number => {
    let score = 0;

    // Skill overlap (30% of score) - Case-insensitive comparison
    const commonSkills = mentee.skills.filter((skill) =>
      mentor.skills.some((mentorSkill) => mentorSkill.toLowerCase() === skill.toLowerCase())
    );
    score += (commonSkills.length / Math.max(mentee.skills.length, mentor.skills.length)) * 30;

    // Goal overlap (30% of score) - Case-insensitive comparison
    const commonGoals = mentee.goals.filter((goal) =>
      mentor.goals.some((mentorGoal) => mentorGoal.toLowerCase() === goal.toLowerCase())
    );
    score += (commonGoals.length / Math.max(mentee.goals.length, mentor.goals.length)) * 30;

    // Life stage compatibility (40% of score) - Relaxed criteria
    const isJunior = mentee.lifeStage.toLowerCase().includes('junior');
    const isSeniorOrMidLevel =
      mentor.lifeStage.toLowerCase().includes('senior') ||
      mentor.lifeStage.toLowerCase().includes('mid-level');
    const lifeStageMatch = isJunior && isSeniorOrMidLevel ? 1 : 0;
    score += lifeStageMatch * 40;

    return Math.round(score);
  };

  // Find matches for the current user
  const findMatches = () => {
    if (!currentUser) return;

    const potentialMatches: Match[] = [];
    const mentors = users.filter((user) => user.role === 'mentor' && user.id !== currentUser.id);

    if (currentUser.role === 'mentee') {
      mentors.forEach((mentor) => {
        const score = calculateCompatibility(currentUser, mentor);
        if (score > 0) {
          potentialMatches.push({ mentor, mentee: currentUser, compatibilityScore: score });
        }
      });
    }

    // Sort matches by compatibility score and take top 3-4
    potentialMatches.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
    setMatches(potentialMatches.slice(0, 4)); // Limit to 4 matches

    // Only show "Matched!" if there are matches
    setShowMatchedMessage(potentialMatches.length > 0);
  };

  // Handle profile form submission
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillsInput || !goalsInput || !lifeStageInput || availabilityInput.length === 0) {
      alert('Please fill out all fields.');
      return;
    }

    const newUser: UserProfile = {
      id: `user-${users.length + 1}`,
      name: 'Current User', // In a real app, this would be the logged-in user's name
      role: roleInput,
      skills: skillsInput
        .split(',')
        .map((s) => s.trim())
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()), // Capitalize first letter
      goals: goalsInput
        .split(',')
        .map((g) => g.trim())
        .map((g) => g.charAt(0).toUpperCase() + g.slice(1).toLowerCase()), // Capitalize first letter
      lifeStage: lifeStageInput,
      availability: availabilityInput,
      avatar: 'https://img.icons8.com/color/96/000000/user-male-circle.png',
    };

    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    setShowProfileForm(false);
    setSkillsInput('');
    setGoalsInput('');
    setLifeStageInput('');
    setAvailabilityInput([]);
  };

  // Add availability slot
  const addAvailability = () => {
    setAvailabilityInput([...availabilityInput, { day: '', time: '' }]);
  };

  // Update availability slot
  const updateAvailability = (index: number, field: 'day' | 'time', value: string) => {
    const updatedAvailability = [...availabilityInput];
    updatedAvailability[index][field] = value;
    setAvailabilityInput(updatedAvailability);
  };

  // Handle connecting with a mentor - Show the modal instead of an alert
  const handleConnect = (mentor: UserProfile) => {
    setSelectedMentorName(mentor.name);
    setShowConnectModal(true);
  };

  // Run matching when the current user is set
  useEffect(() => {
    if (currentUser) {
      findMatches();
    }
  }, [currentUser]);

  return (
    <div className="py-16 bg-gradient-to-b from-purple-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back to Home Link */}
        <div className="mb-8">
          <Link
            to="/"
            className="text-purple-600 playfair-display-custom font-medium hover:text-purple-800 transition-colors flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back to Home
          </Link>
        </div>

        {/* Page Header */}
        <h2 className="text-4xl font-bold text-gray-900 text-center playfair-display-custom">
          Peer-to-Peer Mentoring Hub
        </h2>
        <p className="mt-4 text-lg text-gray-600 text-center max-w-2xl mx-auto playfair-display-custom">
          Connect with mentors or mentees for quick 15-minute virtual chats, matched by skills, goals, and life stage.
        </p>

        {/* Profile Setup Section */}
        {!currentUser ? (
          <div className="mt-12 bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4 playfair-display-custom">
              Set Up Your Mentoring Profile
            </h3>
            <button
              onClick={() => setShowProfileForm(true)}
              className="px-4 py-2 bg-purple-600 playfair-display-custom text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              Create Profile
            </button>
          </div>
        ) : (
          <div className="mt-12">
            {/* Matched! Message - Only shown if there are matches */}
            {showMatchedMessage && matches.length > 0 && (
              <div className="text-center mb-6 animate-bounce">
                <h3 className="text-3xl font-bold text-purple-600 playfair-display-custom">Matched!</h3>
                <p className="text-gray-600 playfair-display-custom">Here are your mentor suggestions.</p>
              </div>
            )}

            {/* Mentor Suggestion Cards */}
            <h3 className="text-2xl font-semibold text-gray-900 mb-4 playfair-display-custom">Suggested Mentors</h3>
            {matches.length === 0 ? (
              <div className="text-center">
                <p className="text-gray-600 mb-4 playfair-display-custom">No matches found. Try updating your profile!</p>
                <button
                  onClick={() => setShowProfileForm(true)}
                  className="px-4 py-2 bg-purple-600 playfair-display-custom text-white rounded-md hover:bg-purple-700 transition-colors"
                >
                  Update Profile
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {matches.map((match, index) => (
                  <div
                    key={`${match.mentor.id}-${match.mentee.id}`}
                    className={`bg-gradient-to-br from-purple-50 to-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 border border-gray-100 animate-fade-in delay-${index}`}
                  >
                    <div className="flex items-center mb-4">
                      <img
                        src={match.mentor.avatar}
                        alt={match.mentor.name}
                        className="w-12 h-12 rounded-full mr-4"
                      />
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800 playfair-display-custom">
                          {match.mentor.name}
                        </h4>
                        <p className="text-sm text-gray-500 playfair-display-custom">{match.mentor.lifeStage}</p>
                      </div>
                    </div>
                    <div className="mb-4">
                      <p className="text-gray-600 mb-2 playfair-display-custom">
                        <span className="font-medium">Compatibility:</span>{' '}
                        <span className="text-purple-600 playfair-display-custom">{match.compatibilityScore}%</span>
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-purple-600 h-2.5 rounded-full"
                          style={{ width: `${match.compatibilityScore}%` }}
                        ></div>
                      </div>
                      <p className="text-gray-600 mt-2 playfair-display-custom">
                        <span className="font-medium">Skills:</span> {match.mentor.skills.join(', ')}
                      </p>
                      <p className="text-gray-600 playfair-display-custom">
                        <span className="font-medium">Goals:</span> {match.mentor.goals.join(', ')}
                      </p>
                    </div>
                    <button
                      onClick={() => handleConnect(match.mentor)}
                      className="w-full px-4 py-2 bg-purple-600 playfair-display-custom text-white rounded-md hover:bg-purple-700 transition-colors flex items-center justify-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                      Connect
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Profile Form Modal */}
        {showProfileForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 animate-fade-in">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-gray-900 playfair-display-custom">Create Your Profile</h3>
                <button
                  onClick={() => setShowProfileForm(false)}
                  className="text-gray-600 hover:text-gray-800 playfair-display-custom"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleProfileSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-600 mb-2 playfair-display-custom">Role</label>
                  <select
                    value={roleInput}
                    onChange={(e) => setRoleInput(e.target.value as 'mentor' | 'mentee')}
                    className="w-full p-2 border rounded-md playfair-display-custom text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  >
                    <option value="mentee">Mentee</option>
                    <option value="mentor">Mentor</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-600 mb-2 playfair-display-custom">Skills (comma-separated)</label>
                  <input
                    type="text"
                    value={skillsInput}
                    onChange={(e) => setSkillsInput(e.target.value)}
                    placeholder="e.g., Python, JavaScript"
                    className="w-full p-2 border rounded-md playfair-display-custom text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-600 mb-2 playfair-display-custom">Goals (comma-separated)</label>
                  <input
                    type="text"
                    value={goalsInput}
                    onChange={(e) => setGoalsInput(e.target.value)}
                    placeholder="e.g., Work-life balance, Career growth"
                    className="w-full p-2 border rounded-md playfair-display-custom text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-600 mb-2 playfair-display-custom">Life Stage</label>
                  <input
                    type="text"
                    value={lifeStageInput}
                    onChange={(e) => setLifeStageInput(e.target.value)}
                    placeholder="e.g., Junior developer seeking work-life tips"
                    className="w-full p-2 border rounded-md playfair-display-custom text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-600 mb-2 playfair-display-custom">Availability</label>
                  {availabilityInput.map((slot, index) => (
                    <div key={index} className="flex space-x-2 mb-2">
                      <input
                        type="text"
                        value={slot.day}
                        onChange={(e) => updateAvailability(index, 'day', e.target.value)}
                        placeholder="Day (e.g., Monday)"
                        className="w-1/2 p-2 border rounded-md playfair-display-custom text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-600"
                      />
                      <input
                        type="text"
                        value={slot.time}
                        onChange={(e) => updateAvailability(index, 'time', e.target.value)}
                        placeholder="Time (e.g., 10:00 AM - 12:00 PM)"
                        className="w-1/2 p-2 border rounded-md playfair-display-custom text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-600"
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addAvailability}
                    className="text-purple-600 hover:text-purple-800 playfair-display-custom"
                  >
                    + Add Availability
                  </button>
                </div>
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-purple-600 playfair-display-custom text-white rounded-md hover:bg-purple-700 transition-colors"
                >
                  Save Profile
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Connect Confirmation Modal */}
        {showConnectModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 animate-fade-in">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-gray-900 playfair-display-custom">Connection Confirmed!</h3>
                <button
                  onClick={() => setShowConnectModal(false)}
                  className="text-gray-600 hover:text-gray-800 playfair-display-custom"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="text-center">
                <p className="text-gray-600 mb-4 playfair-display-custom">
                  You’ve connected with <span className="font-semibold text-purple-600 playfair-display-custom">{selectedMentorName}</span>!
                </p>
                <p className="text-gray-600 mb-6 playfair-display-custom">
                  A 15-minute virtual chat has been scheduled.
                </p>
                <button
                  onClick={() => setShowConnectModal(false)}
                  className="px-4 py-2 bg-purple-600 playfair-display-custom text-white rounded-md hover:bg-purple-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Custom CSS for Animations */}
      <style>
        {`
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fade-in 0.5s ease-out;
          }
          .delay-0 {
            animation-delay: 0s;
          }
          .delay-1 {
            animation-delay: 0.2s;
          }
          .delay-2 {
            animation-delay: 0.4s;
          }
          .delay-3 {
            animation-delay: 0.6s;
          }
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-10px); }
            60% { transform: translateY(-5px); }
          }
          .animate-bounce {
            animation: bounce 1s;
          }
        `}
      </style>
    </div>
  );
};

export default MentoringHub;
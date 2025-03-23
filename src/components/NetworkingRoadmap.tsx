import { ArrowLeftIcon, HeartPulseIcon } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Opportunity {
  id: number;
  title: string;
  details: string;
  time: string;
  category: string;
  image: string;
}

interface Chat {
  id: number;
  title: string;
  details: string;
  time: string;
  userImage: string;
}

interface Post {
  id: number;
  title: string;
  details: string;
  author: string;
  authorImage: string;
  replies: { id: number; author: string; authorImage: string; text: string; likes: number }[];
}

export const NetworkingRoadmap: React.FC = () => {
  // State for Opportunity Feed
  const [opportunities] = useState<Opportunity[]>([
    {
      id: 1,
      title: 'UX Workshop',
      details: 'Lead a virtual UX workshop for a startup looking to improve their app’s user experience.',
      time: '2 hours • Remote',
      category: 'Workshop',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    },
    {
      id: 2,
      title: 'Part-Time Data Analyst',
      details: 'Join a fintech company to analyze user data and provide actionable insights.',
      time: '10 hours/week • Remote',
      category: 'Part-Time',
      image: 'https://images.unsplash.com/photo-1551288049-b1f3a99a90c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    },
    {
      id: 3,
      title: 'Tech Conference Speaker',
      details: 'Speak at a virtual conference about your experience in AI development.',
      time: '1 hour • Virtual',
      category: 'Speaking',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    },
  ]);
  const [appliedOpportunities, setAppliedOpportunities] = useState<number[]>([]);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const navigate = useNavigate();

  // State for Coffee Chats
  const [chats] = useState<Chat[]>([
    {
      id: 1,
      title: 'Chat with Priya, AI Dev',
      details: 'Discuss transitioning into AI roles and balancing work with personal projects.',
      time: 'Tomorrow, 10 AM • 15 mins',
      userImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
    },
    {
      id: 2,
      title: 'Chat with Aisha, UX Designer',
      details: 'Share tips on user research methods and discuss work-life balance in design.',
      time: 'Next Wed, 2 PM • 15 mins',
      userImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
    },
    {
      id: 3,
      title: 'Chat with Lena, Product Manager',
      details: 'Talk about managing cross-functional teams and handling burnout.',
      time: 'Next Fri, 11 AM • 15 mins',
      userImage: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
    },
  ]);
  const [scheduledChats, setScheduledChats] = useState<number[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

  // State for Community Forum
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      title: '“How do you handle crunch time with kids?”',
      details: 'I’m struggling to manage deadlines while being present for my kids. Any tips?',
      author: 'Sarah',
      authorImage: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
      replies: [
        { id: 1, author: 'Maya', authorImage: 'https://images.unsplash.com/photo-1517841903200-7b9627f9f7f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80', text: 'I set strict boundaries and communicate them clearly with my team!', likes: 3 },
        { id: 2, author: 'Lena', authorImage: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80', text: 'Try batching tasks—I do this while the kids are at school.', likes: 2 },
      ],
    },
    {
      id: 2,
      title: '“Just landed my first tech role!”',
      details: 'I’m so excited to start as a junior developer! Any advice for the first 90 days?',
      author: 'Maya',
      authorImage: 'https://images.unsplash.com/photo-1517841903200-7b9627f9f7f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
      replies: [
        { id: 1, author: 'Aisha', authorImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80', text: 'Congrats! Ask lots of questions and find a mentor.', likes: 5 },
        { id: 2, author: 'Priya', authorImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80', text: 'Focus on building relationships with your team.', likes: 4 },
      ],
    },
    {
      id: 3,
      title: '“Need advice on negotiating salary”',
      details: 'I’ve been offered a role but the salary is lower than expected. How do I negotiate?',
      author: 'Fatima',
      authorImage: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
      replies: [
        { id: 1, author: 'Sarah', authorImage: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80', text: 'Research market rates and be confident in your value!', likes: 6 },
        { id: 2, author: 'Lena', authorImage: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80', text: 'I always ask for 10% more than their offer.', likes: 3 },
      ],
    },
  ]);
  const [replyText, setReplyText] = useState<string>('');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [selectedUser, setSelectedUser] = useState<{ name: string; image: string; bio: string } | null>(null);

  // Handlers for Opportunity Feed
  const handleApply = (id: number) => {
    setAppliedOpportunities([...appliedOpportunities, id]);
  };

  const handleViewDetails = (opp: Opportunity) => {
    setSelectedOpportunity(opp);
  };

  // Handlers for Coffee Chats
  const handleSchedule = (id: number) => {
    setScheduledChats([...scheduledChats, id]);
    setSelectedChat(null);
  };

  const handleCancel = (id: number) => {
    setScheduledChats(scheduledChats.filter((chatId) => chatId !== id));
  };

  const handleScheduleClick = (chat: Chat) => {
    setSelectedChat(chat);
  };

  // Handlers for Community Forum
  const handleJoin = (post: Post) => {
    setSelectedPost(post);
  };

  const handleReplySubmit = (postId: number) => {
    if (replyText.trim() === '') return;

    // Update the posts array
    const updatedPosts = posts.map((post) =>
      post.id === postId
        ? {
          ...post,
          replies: [...post.replies, { id: post.replies.length + 1, author: 'You', authorImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80', text: replyText, likes: 0 }],
        }
        : post
    );
    setPosts(updatedPosts);

    // Update the selectedPost state to reflect the new reply
    const updatedPost = updatedPosts.find((post) => post.id === postId);
    if (updatedPost) {
      setSelectedPost(updatedPost);
    }

    // Clear the reply text
    setReplyText('');
  };

  const handleLikeReply = (postId: number, replyId: number) => {
    const updatedPosts = posts.map((post) =>
      post.id === postId
        ? {
          ...post,
          replies: post.replies.map((reply) =>
            reply.id === replyId ? { ...reply, likes: reply.likes + 1 } : reply
          ),
        }
        : post
    );
    setPosts(updatedPosts);

    // Update selectedPost to reflect the updated likes
    const updatedPost = updatedPosts.find((post) => post.id === postId);
    if (updatedPost && selectedPost && selectedPost.id === postId) {
      setSelectedPost(updatedPost);
    }
  };

  const handleUserClick = (name: string, image: string) => {
    setSelectedUser({ name, image, bio: `${name} is a passionate tech professional with 5+ years of experience. She loves mentoring and sharing insights on work-life balance.` });
  };

  return (
    <div className="py-12 bg-gray-100 min-h-screen">
      <header className="bg-purple-100 shadow-sm py-4 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center playfair-display-custom text-purple-700 hover:text-purple-900">
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            <span>Back to Home</span>
          </button>
          <div className="flex items-center">
            <HeartPulseIcon className="h-6 w-6 text-rose-600 mr-2" />
            <h1 className="text-xl font-bold text-purple-800 playfair-display-custom">Networking</h1>
          </div>
          <div className="w-24"></div>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">


        {/* Page Header */}
        <h2 className="text-3xl font-bold text-gray-900 text-center playfair-display-custom">
          Networking Made Simple
        </h2>
        <p className="mt-4 text-lg text-gray-600 text-center playfair-display-custom">
          Connect with a vibrant community of women in tech through opportunities, chats, and forums.
        </p>

        {/* Opportunity Feed Section */}
        <div className="mt-10">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4 playfair-display-custom">Opportunity Feed</h3>
          <p className="text-gray-600 mb-6 playfair-display-custom">
            Curated remote gigs, part-time roles, or speaking opportunities tagged with time commitments.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {opportunities.map((opp) => (
              <div key={opp.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <img src={opp.image} alt={opp.title} className="w-12 h-12 rounded-full mr-3 object-cover" />
                  <div>
                    <h4 className="text-xl font-medium text-gray-800 playfair-display-custom">{opp.title}</h4>
                    <p className="text-gray-600 text-sm playfair-display-custom">{opp.time}</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4 playfair-display-custom">{opp.details}</p>
                <div className="flex space-x-3">
                  {appliedOpportunities.includes(opp.id) ? (
                    <p className="text-green-600 font-medium playfair-display-custom">Applied Successfully!</p>
                  ) : (
                    <button
                      onClick={() => handleApply(opp.id)}
                      className="px-4 py-2 bg-purple-600 text-white rounded-md playfair-display-custom hover:bg-purple-700 transition-colors"
                    >
                      Apply
                    </button>
                  )}
                  <button
                    onClick={() => handleViewDetails(opp)}
                    className="px-4 py-2 bg-gray-200 playfair-display-custom text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Coffee Chats Section */}
        <div className="mt-12">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4 playfair-display-custom">Coffee Chats</h3>
          <p className="text-gray-600 mb-6 playfair-display-custom">
            Bite-sized, calendar-synced networking with other women in tech—connect over shared interests or challenges.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {chats.map((chat) => (
              <div key={chat.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <img src={chat.userImage} alt={chat.title} className="w-12 h-12 rounded-full mr-3 object-cover" />
                  <div>
                    <h4 className="text-xl font-medium text-gray-800 playfair-display-custom">{chat.title}</h4>
                    <p className="text-gray-600 text-sm playfair-display-custom">{chat.time}</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4 playfair-display-custom">{chat.details}</p>
                {scheduledChats.includes(chat.id) ? (
                  <div className="flex space-x-3">
                    <p className="text-green-600 font-medium playfair-display-custom">Scheduled!</p>
                    <button
                      onClick={() => handleCancel(chat.id)}
                      className="px-4 py-2 bg-red-600 playfair-display-custom text-white rounded-md hover:bg-red-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleScheduleClick(chat)}
                    className="px-4 py-2 bg-purple-600 playfair-display-custom text-white rounded-md hover:bg-purple-700 transition-colors"
                  >
                    Schedule
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Community Forum Section */}
        <div className="mt-12">
          <h3 className="text-2xl font-semibold playfair-display-custom text-gray-900 mb-4">Community Forum</h3>
          <p className="text-gray-600 mb-6 playfair-display-custom">
            A safe space to ask questions, share wins, or vent.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.map((post) => (
              <div key={post.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <img src={post.authorImage} alt={post.author} className="w-10 h-10 rounded-full mr-3 object-cover cursor-pointer" onClick={() => handleUserClick(post.author, post.authorImage)} />
                  <div>
                    <h4 className="text-xl font-medium text-gray-800 playfair-display-custom">{post.title}</h4>
                    <p className="text-gray-600 text-sm playfair-display-custom">Posted by {post.author} • {post.replies.length} replies</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4 playfair-display-custom">{post.details}</p>
                <button
                  onClick={() => handleJoin(post)}
                  className="px-4 py-2 bg-purple-600 playfair-display-custom text-white rounded-md hover:bg-purple-700 transition-colors"
                >
                  Join Conversation
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Opportunity Details Modal */}
      {selectedOpportunity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-gray-900 playfair-display-custom">{selectedOpportunity.title}</h3>
              <button
                onClick={() => setSelectedOpportunity(null)}
                className="text-gray-600 hover:text-gray-800 playfair-display-custom"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <img src={selectedOpportunity.image} alt={selectedOpportunity.title} className="w-full h-40 object-cover rounded-md mb-4" />
            <p className="text-gray-600 mb-2 playfair-display-custom"><strong>Category:</strong> {selectedOpportunity.category}</p>
            <p className="text-gray-600 mb-2 playfair-display-custom"><strong>Time Commitment:</strong> {selectedOpportunity.time}</p>
            <p className="text-gray-600 playfair-display-custom">{selectedOpportunity.details}</p>
            {appliedOpportunities.includes(selectedOpportunity.id) ? (
              <p className="mt-4 text-green-600 font-medium playfair-display-custom">Applied Successfully!</p>
            ) : (
              <button
                onClick={() => handleApply(selectedOpportunity.id)}
                className="mt-4 px-4 py-2 bg-purple-600 playfair-display-custom text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                Apply Now
              </button>
            )}
          </div>
        </div>
      )}

      {/* Coffee Chat Schedule Modal */}
      {selectedChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-gray-900 playfair-display-custom">Schedule {selectedChat.title}</h3>
              <button
                onClick={() => setSelectedChat(null)}
                className="text-gray-600 hover:text-gray-800 playfair-display-custom"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex items-center mb-4">
              <img src={selectedChat.userImage} alt={selectedChat.title} className="w-16 h-16 rounded-full mr-4 object-cover" />
              <div>
                <p className="text-gray-600 mb-2 playfair-display-custom"><strong>Time:</strong> {selectedChat.time}</p>
                <p className="text-gray-600 playfair-display-custom">{selectedChat.details}</p>
              </div>
            </div>
            <div className="bg-gray-100 p-4 rounded-md">
              <h4 className="text-lg font-medium text-gray-800 mb-2 playfair-display-custom">Mock Calendar Preview</h4>
              <p className="text-gray-600 playfair-display-custom">Event: {selectedChat.title}</p>
              <p className="text-gray-600 playfair-display-custom">Date: {selectedChat.time.split(' • ')[0]}</p>
              <p className="text-gray-600 playfair-display-custom">Duration: {selectedChat.time.split(' • ')[1]}</p>
            </div>
            <button
              onClick={() => handleSchedule(selectedChat.id)}
              className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors playfair-display-custom"
            >
              Confirm Schedule
            </button>
          </div>
        </div>
      )}

      {/* Community Forum Post Modal */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-gray-900 playfair-display-custom">{selectedPost.title}</h3>
              <button
                onClick={() => setSelectedPost(null)}
                className="text-gray-600 hover:text-gray-800 playfair-display-custom"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex items-center mb-4">
              <img src={selectedPost.authorImage} alt={selectedPost.author} className="w-10 h-10 rounded-full mr-3 object-cover cursor-pointer" onClick={() => handleUserClick(selectedPost.author, selectedPost.authorImage)} />
              <div>
                <p className="text-gray-600 text-sm playfair-display-custom">Posted by {selectedPost.author}</p>
              </div>
            </div>
            <p className="text-gray-600 mb-6 playfair-display-custom">{selectedPost.details}</p>
            <h5 className="text-lg font-medium text-gray-800 mb-2 playfair-display-custom">Replies ({selectedPost.replies.length})</h5>
            {selectedPost.replies.length === 0 ? (
              <p className="text-gray-600 playfair-display-custom">No replies yet. Be the first to respond!</p>
            ) : (
              selectedPost.replies.map((reply) => (
                <div key={reply.id} className="border-t pt-2 mt-2 flex justify-between items-start">
                  <div className="flex items-start">
                    <img src={reply.authorImage} alt={reply.author} className="w-8 h-8 rounded-full mr-2 object-cover cursor-pointer" onClick={() => handleUserClick(reply.author, reply.authorImage)} />
                    <div>
                      <p className="text-sm text-gray-600 playfair-display-custom">
                        <span
                          className="font-medium cursor-pointer hover:underline"
                          onClick={() => handleUserClick(reply.author, reply.authorImage)}
                        >
                          {reply.author}:
                        </span>{' '}
                        {reply.text}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleLikeReply(selectedPost.id, reply.id)}
                    className="flex items-center text-gray-600 playfair-display-custom hover:text-purple-600 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    {reply.likes}
                  </button>
                </div>
              ))
            )}
            <div className="mt-6">
              <h5 className="text-lg font-medium text-gray-800 mb-2 playfair-display-custom">Add Your Reply</h5>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Share your thoughts..."
                className="w-full p-2 border rounded-md playfair-display-custom text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-600"
                rows={3}
              />
              <button
                onClick={() => handleReplySubmit(selectedPost.id)}
                className="mt-2 px-4 py-2 bg-purple-600 text-white playfair-display-custom rounded-md hover:bg-purple-700 transition-colors"
              >
                Submit Reply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Profile Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-gray-900 playfair-display-custom">{selectedUser.name}</h3>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-gray-600 hover:text-gray-800 playfair-display-custom"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <img src={selectedUser.image} alt={selectedUser.name} className="w-24 h-24 rounded-full mx-auto mb-4 object-cover" />
            <p className="text-gray-600 text-center playfair-display-custom">{selectedUser.bio}</p>
          </div>
        </div>
      )}
    </div>
  );
};
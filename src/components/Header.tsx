import React, { useState, useEffect } from 'react';
import { Menu, X, User, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, User as FirebaseUser, updateProfile } from '@firebase/auth';

interface UserProfile {
  firstName: string;
  lastName: string;
}

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [_email, setEmail] = useState('');
  const [_password, setPassword] = useState('');
  const [_error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // Parse displayName to get firstName and lastName
        const displayName = currentUser.displayName || '';
        const nameParts = displayName.split(' ');
        setUserProfile({
          firstName: nameParts[0] || '',
          lastName: nameParts.slice(1).join(' ') || ''
        });
      } else {
        setUserProfile(null);
      }
    });
    
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Validate password
  const validatePassword = (value: string) => {
    if (value.length < 6) {
      return false;
    }
    return true;
  };

  // Handle Login
  const handleLogin = async (formEmail: string, formPassword: string) => {
    if (!validatePassword(formPassword)) {
      return false;
    }
    
    try {
      await signInWithEmailAndPassword(auth, formEmail, formPassword);
      resetForm();
      // Reload the page to ensure user data is properly displayed
      window.location.reload();
      return true;
    } catch (err: any) {
      return false;
    }
  };

  // Handle Signup
  const handleSignup = async (formEmail: string, formPassword: string, firstName: string, lastName: string) => {
    if (!validatePassword(formPassword)) {
      return false;
    }
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formEmail, formPassword);
      
      // Update user profile with first and last name
      await updateProfile(userCredential.user, {
        displayName: `${firstName} ${lastName}`
      });
      
      resetForm();
      // Reload the page to ensure user data is properly displayed
      window.location.reload();
      return true;
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        return { error: 'email-in-use' };
      }
      return false;
    }
  };

  // Handle Sign Out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setIsDropdownOpen(false);
      // Reload the page after sign out
      window.location.reload();
    } catch (err) {
      console.error('Error signing out', err);
    }
  };

  // Navigate to account page
  const handleNavigateToAccount = () => {
    navigate('/account');
    setIsDropdownOpen(false);
  };

  // Reset form state
  const resetForm = () => {
    setIsLoginOpen(false);
    setIsSignupOpen(false);
    setEmail('');
    setPassword('');
    setError(null);
  };

  // Toggle between login and signup
  const toggleAuthModals = () => {
    if (isLoginOpen) {
      setIsLoginOpen(false);
      setIsSignupOpen(true);
    } else if (isSignupOpen) {
      setIsSignupOpen(false);
      setIsLoginOpen(true);
    }
  };

  // Login Modal Component
  const LoginModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    toggleToSignup: () => void;
  }> = ({ isOpen, onClose, toggleToSignup }) => {
    const [localEmail, setLocalEmail] = useState('');
    const [localPassword, setLocalPassword] = useState('');
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [localError, setLocalError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
      if (isOpen) {
        setLocalEmail('');
        setLocalPassword('');
        setPasswordError(null);
        setLocalError(null);
        setIsSubmitting(false);
      }
    }, [isOpen]);

    const validateLocalPassword = (value: string) => {
      if (value.length < 6) {
        setPasswordError('Password must be at least 6 characters');
        return false;
      }
      setPasswordError(null);
      return true;
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      
      if (!validateLocalPassword(localPassword)) {
        return;
      }
      
      setIsSubmitting(true);
      
      try {
        const success = await handleLogin(localEmail, localPassword);
        
        if (!success) {
          setLocalError('Invalid email or password. Please try again.');
        }
      } catch (error) {
        setLocalError('An unexpected error occurred. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="absolute inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm"
          onClick={onClose}
        />
        <div className="relative bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
          <button
            className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            onClick={onClose}
            disabled={isSubmitting}
          >
            <X size={24} />
          </button>
          <h2 className="text-2xl font-bold text-purple-700 mb-4">Log In</h2>
          <form onSubmit={handleFormSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={localEmail}
                onChange={(e) => setLocalEmail(e.target.value)}
                className="w-full p-2 border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your email"
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={localPassword}
                onChange={(e) => {
                  setLocalPassword(e.target.value);
                  if (e.target.value.length > 0) {
                    validateLocalPassword(e.target.value);
                  } else {
                    setPasswordError(null);
                  }
                }}
                className={`w-full p-2 border ${
                  passwordError ? 'border-red-500' : 'border-purple-300'
                } rounded focus:outline-none focus:ring-2 focus:ring-purple-500`}
                placeholder="Enter your password"
                required
                disabled={isSubmitting}
              />
              {passwordError && (
                <p className="text-red-500 text-sm mt-1">{passwordError}</p>
              )}
            </div>
            {localError && <p className="text-red-500 text-sm mb-4">{localError}</p>}
            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-full transition-colors mb-4"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : 'Log In'}
            </button>
            <p className="text-center text-gray-600 text-sm">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={toggleToSignup}
                className="text-purple-600 hover:underline focus:outline-none"
                disabled={isSubmitting}
              >
                Sign Up
              </button>
            </p>
          </form>
        </div>
      </div>
    );
  };

  // Signup Modal Component
  const SignupModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    toggleToLogin: () => void;
  }> = ({ isOpen, onClose, toggleToLogin }) => {
    const [localFirstName, setLocalFirstName] = useState('');
    const [localLastName, setLocalLastName] = useState('');
    const [localEmail, setLocalEmail] = useState('');
    const [localPassword, setLocalPassword] = useState('');
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [localError, setLocalError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
      if (isOpen) {
        setLocalFirstName('');
        setLocalLastName('');
        setLocalEmail('');
        setLocalPassword('');
        setPasswordError(null);
        setLocalError(null);
        setIsSubmitting(false);
      }
    }, [isOpen]);

    const validateLocalPassword = (value: string) => {
      if (value.length < 6) {
        setPasswordError('Password must be at least 6 characters');
        return false;
      }
      setPasswordError(null);
      return true;
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      
      if (!validateLocalPassword(localPassword)) {
        return;
      }
      
      setIsSubmitting(true);
      
      try {
        const result = await handleSignup(localEmail, localPassword, localFirstName, localLastName);
        
        if (result === false) {
          setLocalError('Failed to create account. Please try again.');
        } else if (result && typeof result === 'object' && result.error === 'email-in-use') {
          setLocalError('Email is already in use. Sign in?');
        }
      } catch (error) {
        setLocalError('An unexpected error occurred. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="absolute inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm"
          onClick={onClose}
        />
        <div className="relative bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
          <button
            className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            onClick={onClose}
            disabled={isSubmitting}
          >
            <X size={24} />
          </button>
          <h2 className="text-2xl font-bold text-purple-700 mb-4">Sign Up</h2>
          <form onSubmit={handleFormSubmit}>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  value={localFirstName}
                  onChange={(e) => setLocalFirstName(e.target.value)}
                  className="w-full p-2 border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="First name"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  value={localLastName}
                  onChange={(e) => setLocalLastName(e.target.value)}
                  className="w-full p-2 border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Last name"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={localEmail}
                onChange={(e) => setLocalEmail(e.target.value)}
                className="w-full p-2 border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your email"
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={localPassword}
                onChange={(e) => {
                  setLocalPassword(e.target.value);
                  if (e.target.value.length > 0) {
                    validateLocalPassword(e.target.value);
                  } else {
                    setPasswordError(null);
                  }
                }}
                className={`w-full p-2 border ${
                  passwordError ? 'border-red-500' : 'border-purple-300'
                } rounded focus:outline-none focus:ring-2 focus:ring-purple-500`}
                placeholder="Enter your password"
                required
                disabled={isSubmitting}
              />
              {passwordError && (
                <p className="text-red-500 text-sm mt-1">{passwordError}</p>
              )}
            </div>
            {localError && (
              <div className="text-red-500 text-sm mb-4">
                {localError}
                {localError.includes('Email is already in use') && (
                  <button
                    type="button"
                    onClick={toggleToLogin}
                    className="ml-1 text-purple-600 hover:underline focus:outline-none"
                    disabled={isSubmitting}
                  >
                    Sign in
                  </button>
                )}
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-full transition-colors mb-4"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : 'Sign Up'}
            </button>
            <p className="text-center text-gray-600 text-sm">
              Already have an account?{' '}
              <button
                type="button"
                onClick={toggleToLogin}
                className="text-purple-600 hover:underline focus:outline-none"
                disabled={isSubmitting}
              >
                Log In
              </button>
            </p>
          </form>
        </div>
      </div>
    );
  };

  return (
    <header className="w-full bg-white py-4 px-6 md:px-10 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <button onClick={() => navigate('/')}>
            <img src={logo} alt="Hermony logo" className="h-12 ml-2" />
          </button>
        </div>
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-gray-700 hover:text-purple-600 transition-colors">
            Features
          </a>
          <a href="#testimonials" className="text-gray-700 hover:text-purple-600 transition-colors">
            Community
          </a>
          
          {user ? (
            <div className="relative flex items-center space-x-4">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 text-gray-800 hover:text-purple-600"
              >
                <span>Hi, {userProfile?.firstName || ''}</span>
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                  <User size={20} />
                </div>
                <ChevronDown size={16} />
              </button>
              
              {/* User dropdown menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                  <div className="py-1">
                    <button
                      onClick={handleNavigateToAccount}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                    >
                      Account
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <button
                onClick={() => setIsSignupOpen(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full transition-colors"
              >
                Sign Up
              </button>
              <button
                onClick={() => setIsLoginOpen(true)}
                className="border border-purple-600 text-purple-600 px-6 py-2 rounded-full hover:bg-purple-50 transition-colors"
              >
                Log In
              </button>
            </>
          )}
        </nav>
        {/* Mobile Menu Button */}
        <button className="md:hidden text-gray-700" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-md py-4 px-6">
          <div className="flex flex-col space-y-4">
            <a href="#features" className="text-gray-700 hover:text-purple-600 transition-colors">
              Features
            </a>
            <a href="#testimonials" className="text-gray-700 hover:text-purple-600 transition-colors">
              Community
            </a>
            
            {user ? (
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2 text-gray-800">
                  <span>Hi, {userProfile?.firstName || ''}</span>
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                    <User size={20} />
                  </div>
                </div>
                <button
                  onClick={handleNavigateToAccount}
                  className="text-left text-gray-700 hover:text-purple-600 transition-colors"
                >
                  Account
                </button>
                <button
                  onClick={handleSignOut}
                  className="text-left text-gray-700 hover:text-purple-600 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => setIsSignupOpen(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full transition-colors"
                >
                  Sign Up
                </button>
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="border border-purple-600 text-purple-600 px-6 py-2 rounded-full hover:bg-purple-50 transition-colors"
                >
                  Log In
                </button>
              </>
            )}
          </div>
        </div>
      )}
      {/* Auth Modals */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={resetForm}
        toggleToSignup={toggleAuthModals}
      />
      <SignupModal
        isOpen={isSignupOpen}
        onClose={resetForm}
        toggleToLogin={toggleAuthModals}
      />
    </header>
  );
};

export default Header;
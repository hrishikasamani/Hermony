import React, { useState, useEffect } from 'react';
import { Menu, X, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, User as FirebaseUser } from '@firebase/auth';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [_email, setEmail] = useState('');
  const [_password, setPassword] = useState('');
  const [_error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const navigate = useNavigate();

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
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
      navigate('/');
      return true;
    } catch (err: any) {
      return false;
    }
  };

  // Handle Signup
  const handleSignup = async (formEmail: string, formPassword: string) => {
    if (!validatePassword(formPassword)) {
      return false;
    }
    
    try {
      await createUserWithEmailAndPassword(auth, formEmail, formPassword);
      resetForm();
      // Open login modal after successful signup
      setIsLoginOpen(true);
      navigate('/');
      return true;
    } catch (err: any) {
      return false;
    }
  };

  // Handle Sign Out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Error signing out', err);
    }
  };

  // Reset form state
  const resetForm = () => {
    setIsLoginOpen(false);
    setIsSignupOpen(false);
    setEmail('');
    setPassword('');
    setError(null);
  };

  // Modal with its own local state to prevent parent re-renders
  const Modal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    title: string;
    onSubmit: (email: string, password: string) => Promise<boolean>;
  }> = ({ isOpen, onClose, title, onSubmit }) => {
    // Local state for the modal - independent from parent component
    const [localEmail, setLocalEmail] = useState('');
    const [localPassword, setLocalPassword] = useState('');
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [localError, setLocalError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Reset local state when modal opens/closes
    useEffect(() => {
      if (isOpen) {
        setLocalEmail('');
        setLocalPassword('');
        setPasswordError(null);
        setLocalError(null);
        setIsSubmitting(false);
      }
    }, [isOpen]);

    // Local password validation
    const validateLocalPassword = (value: string) => {
      if (value.length < 6) {
        setPasswordError('Password must be at least 6 characters');
        return false;
      }
      setPasswordError(null);
      return true;
    };

    // Handle form submission
    const handleFormSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      
      if (!validateLocalPassword(localPassword)) {
        return;
      }
      
      setIsSubmitting(true);
      
      try {
        const success = await onSubmit(localEmail, localPassword);
        
        if (!success) {
          if (title === "Log In") {
            setLocalError('Invalid email or password. Please try again.');
          } else {
            setLocalError('Failed to create account. Email may already be in use.');
          }
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
        {/* Backdrop with blur */}
        <div
          className="absolute inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm"
          onClick={onClose}
        />
        {/* Modal */}
        <div className="relative bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
          <button
            className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            onClick={onClose}
            disabled={isSubmitting}
          >
            <X size={24} />
          </button>
          <h2 className="text-2xl font-bold text-purple-700 mb-4">{title}</h2>
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
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-full transition-colors"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : title}
            </button>
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
            <div className="flex items-center space-x-4">
              <button
                onClick={handleSignOut}
                className="border border-purple-600 text-purple-600 px-6 py-2 rounded-full hover:bg-purple-50 transition-colors"
              >
                Sign Out
              </button>
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                <User size={20} />
              </div>
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
              <div className="flex items-center justify-between">
                <button
                  onClick={handleSignOut}
                  className="border border-purple-600 text-purple-600 px-6 py-2 rounded-full hover:bg-purple-50 transition-colors"
                >
                  Sign Out
                </button>
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                  <User size={20} />
                </div>
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
      {/* Modals */}
      <Modal
        isOpen={isLoginOpen}
        onClose={resetForm}
        title="Log In"
        onSubmit={handleLogin}
      />
      <Modal
        isOpen={isSignupOpen}
        onClose={resetForm}
        title="Sign Up"
        onSubmit={handleSignup}
      />
    </header>
  );
};

export default Header;
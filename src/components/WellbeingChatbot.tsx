import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeftIcon, ArrowUpIcon, HeartPulseIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Import sound files from src/assets/sounds/
import rainSound from '../assets/sounds/rain.mp3';
import wavesSound from '../assets/sounds/waves.mp3';
import forestSound from '../assets/sounds/forest.mp3';

const WellbeingChatbot: React.FC = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hey there! I'm your Balance Buddy AI. How’s your day going so far? What’s on your mind?",
      sender: 'bot'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [modalType, setModalType] = useState<'stress' | 'sleep' | 'mindfulness' | 'worklife' | null>(null);
  const [timer, setTimer] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [selectedSound, setSelectedSound] = useState<string | null>(null);
  const [mindfulnessProgress, setMindfulnessProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Map sound names to imported audio files
  const soundFiles: { [key: string]: string } = {
    Rain: rainSound,
    Waves: wavesSound,
    Forest: forestSound
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => {
            const newTimer = prev - 1;
            if (modalType === 'stress') {
              const seconds = newTimer % 12;
              if (seconds >= 8) setBreathingPhase('Inhale');
              else if (seconds >= 4) setBreathingPhase('Hold');
              else setBreathingPhase('Exhale');
            } else if (modalType === 'mindfulness') {
              setMindfulnessProgress((60 - newTimer) * (100 / 60));
            }
            return newTimer;
          });
        }, 1000);
    } else if (timer === 0) {
      setIsTimerRunning(false);
      setIsCompleted(true);
      setBreathingPhase('');
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timer, modalType]);

  useEffect(() => {
    // Cleanup audio on unmount or modal close
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const userMessage = { id: messages.length + 1, text: input, sender: 'user' as const };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      setTimeout(() => {
        const userText = input.toLowerCase();
        let botResponse = "";
        const nudges = [
          "By the way, have you had a glass of water recently? Staying hydrated can really lift your mood!",
          "Quick nudge: a 5-minute stretch could do wonders if you’ve been sitting for a while!",
          "Hey, just a thought—taking a moment to step outside for fresh air might feel refreshing."
        ];
        const randomNudge = nudges[Math.floor(Math.random() * nudges.length)];

        if (userText.includes('stress') || userText.includes('anxious') || userText.includes('overwhelmed')) {
          botResponse = "It sounds like things are feeling a bit heavy right now—totally get that. When I’m stressed, I find it helps to step back and breathe: try inhaling for 4 seconds, holding for 4, and exhaling for 4. Want to give it a go? Or maybe tell me what’s stressing you out so we can tackle it together? " + randomNudge;
        } else if (userText.includes('tired') || userText.includes('exhausted') || userText.includes('burnout')) {
          botResponse = "Oh, I feel you—being tired can really weigh you down. Have you tried a quick power nap lately, like 10-20 minutes? It’s a game-changer. Or maybe a snack with some protein could give you a boost. What’s been draining your energy? " + randomNudge;
        } else if (userText.includes('happy') || userText.includes('good') || userText.includes('great')) {
          botResponse = "Love hearing that you’re doing well! What’s sparking that good vibe today? Let’s keep that energy flowing—maybe share it with someone or jot it down to look back on later? " + randomNudge;
        } else if (userText.includes('sad') || userText.includes('down') || userText.includes('depressed')) {
          botResponse = "I’m really sorry you’re feeling that way—it’s tough, and you’re not alone in this. Sometimes it helps to do something small, like listening to a favorite song or wrapping up in a cozy blanket. Want to talk about what’s been going on? I’m here for you. " + randomNudge;
        } else if (userText.includes('balance') || userText.includes('work life') || userText.includes('work-life')) {
          botResponse = "Work-life balance can be tricky to nail down, huh? One thing that works is setting a hard stop—like no work emails after 7 PM. What’s throwing your balance off lately? Let’s figure out a small step to ease things up. " + randomNudge;
        } else if (userText.includes('sleep') || userText.includes('insomnia') || userText.includes('rest')) {
          botResponse = "Sleep can be elusive sometimes, right? A little trick is to dim the lights and skip screens 30 minutes before bed—helps your brain wind down. What’s been keeping you up? " + randomNudge;
        } else if (userText.includes('angry') || userText.includes('mad') || userText.includes('frustrated')) {
          botResponse = "Ugh, frustration’s the worst—I get it. Want to blow off some steam? Try squeezing a stress ball or writing down what’s ticking you off, then shredding it. What happened to get you fired up? " + randomNudge;
        } else if (userText.includes('lonely') || userText.includes('alone') || userText.includes('isolated')) {
          botResponse = "Feeling lonely can sneak up on anyone—it’s okay to feel that way. How about reaching out to someone, even just a quick text? Or we could chat more if you’d like—I’m here. " + randomNudge;
        } else if (userText.includes('bored') || userText.includes('nothing to do')) {
          botResponse = "Boredom’s a drag, isn’t it? How about picking up something small to shake things up—like doodling or trying a new recipe? What’s something you’ve been curious about lately? " + randomNudge;
        } else if (userText.includes('thanks') || userText.includes('thank you')) {
          botResponse = "You’re welcome! I’m just happy to chat with you. How’s everything else going today? " + randomNudge;
        } else {
          botResponse = "Hmm, I’m picking up on what you’re saying—thanks for sharing! Want to dive deeper into something specific? I’m all ears, and I’ve got some ideas if you need them. " + randomNudge;
        }
        
        const response = { id: messages.length + 2, text: botResponse, sender: 'bot' as const };
        setMessages(prev => [...prev, response]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = { id: messages.length + 2, text: "Oops, I hit a little glitch—sorry about that! Let’s keep the good vibes going. How can I support you right now?", sender: 'bot' as const };
      setMessages(prev => [...prev, errorMessage]);
      setIsLoading(false);
    }
  };

  const startTimer = () => {
    setIsTimerRunning(true);
    setIsCompleted(false);
    setTimer(60);
    if (modalType === 'stress') setBreathingPhase('Inhale');
    if (modalType === 'mindfulness') setMindfulnessProgress(0);
  };

  const closeModal = () => {
    setModalType(null);
    setIsTimerRunning(false);
    setTimer(60);
    setIsCompleted(false);
    setBreathingPhase('');
    setSelectedSound(null);
    setMindfulnessProgress(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  };

  const playSound = (sound: string) => {
    if (audioRef.current) {
      audioRef.current.pause(); // Stop any currently playing sound
    }
    audioRef.current = new Audio(soundFiles[sound]); // Use imported sound file
    setSelectedSound(sound);
    audioRef.current.play();
    audioRef.current.onended = () => setSelectedSound(null); // Reset when sound ends
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Header */}
      <header className="bg-purple-100 shadow-sm py-4 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center text-purple-700 hover:text-purple-900">
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            <span>Back to Home</span>
          </button>
          <div className="flex items-center">
            <HeartPulseIcon className="h-6 w-6 text-rose-600 mr-2" />
            <h1 className="text-xl font-bold text-purple-800 playfair-display-custom">Balance Buddy AI</h1>
          </div>
          <div className="w-24"></div>
        </div>
      </header>

      {/* Chat container */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 border border-purple-200">
            <div className="space-y-4 mb-4 max-h-[60vh] overflow-y-auto">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs md:max-w-md p-3 rounded-lg text-justify playfair-display-custom ${message.sender === 'user' ? 'bg-purple-600  text-white rounded-br-none' : 'bg-purple-50 text-gray-800 rounded-bl-none'}`}>
                    {message.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-purple-50 text-gray-800 max-w-xs md:max-w-md p-3 rounded-lg rounded-bl-none playfair-display-custom">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce"></div>
                      <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSubmit} className="mt-4">
              <div className="flex items-center border border-purple-200 rounded-lg bg-purple-50 px-3 py-2">
                <input
                  type="text"
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Type your message..."
                  className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-500 playfair-display-custom"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className={`ml-2 p-2 rounded-full playfair-display-custom ${isLoading || !input.trim() ? 'bg-purple-200 text-purple-400' : 'bg-purple-600 text-white hover:bg-purple-700'} transition-colors`}
                >
                  <ArrowUpIcon className="h-5 w-5" />
                </button>
              </div>
            </form>
          </div>

          <div className="mt-8 bg-white rounded-lg shadow-md p-6 border border-purple-200">
            <h2 className="text-xl font-bold text-purple-800 mb-4 playfair-display-custom">Wellbeing Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div onClick={() => setModalType('stress')} className="p-4 border border-purple-200 rounded-lg hover:bg-purple-50 cursor-pointer transition-colors">
                <h3 className="font-medium text-purple-800 playfair-display-custom">Stress Management</h3>
                <p className="text-sm text-gray-600 mt-1 playfair-display-custom">Quick breathing exercises and grounding techniques</p>
              </div>
              <div onClick={() => setModalType('sleep')} className="p-4 border border-purple-200 rounded-lg hover:bg-purple-50 cursor-pointer transition-colors">
                <h3 className="font-medium text-purple-800 playfair-display-custom">Sleep Better</h3>
                <p className="text-sm text-gray-600 mt-1 playfair-display-custom">Wind-down routines for better rest</p>
              </div>
              <div onClick={() => setModalType('mindfulness')} className="p-4 border border-purple-200 rounded-lg hover:bg-purple-50 cursor-pointer transition-colors">
                <h3 className="font-medium text-purple-800 playfair-display-custom">Mindfulness Practices</h3>
                <p className="text-sm text-gray-600 mt-1 playfair-display-custom">Short meditations to stay present</p>
              </div>
              <div onClick={() => setModalType('worklife')} className="p-4 border border-purple-200 rounded-lg hover:bg-purple-50 cursor-pointer transition-colors">
                <h3 className="font-medium text-purple-800 playfair-display-custom">Work-Life Balance</h3>
                <p className="text-sm text-gray-600 mt-1 playfair-display-custom">Tips to reclaim your personal time</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalType && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 border border-purple-200">
            {modalType === 'stress' && (
              <>
                <h2 className="text-xl font-bold text-purple-800 mb-4 playfair-display-custom">Stress Management</h2>
                <p className="text-gray-700 mb-4 playfair-display-custom">
                  Feeling stressed? Try this simple breathing exercise: Inhale deeply for 4 seconds, hold for 4 seconds, and exhale for 4 seconds.
                </p>
                <div className="text-center">
                  {!isCompleted ? (
                    <>
                      <p className="text-2xl font-semibold text-purple-600 mb-2 playfair-display-custom">{isTimerRunning ? breathingPhase : 'Ready?'}</p>
                      <p className="text-gray-700 mb-4 playfair-display-custom">{timer} seconds left</p>
                      <button
                        onClick={startTimer}
                        disabled={isTimerRunning}
                        className={`px-4 py-2 rounded-lg playfair-display-custom ${isTimerRunning ? 'bg-purple-200 text-purple-400' : 'bg-purple-600 text-white hover:bg-purple-700'} transition-colors`}
                      >
                        {isTimerRunning ? 'Running...' : 'Start 1-Minute Breathing'}
                      </button>
                    </>
                  ) : (
                    <p className="text-xl font-bold text-purple-800 mb-4 playfair-display-custom">Hooray! You completed a minute towards reducing your stress!</p>
                  )}
                </div>
              </>
            )}

            {modalType === 'sleep' && (
              <>
                <h2 className="text-xl font-bold text-purple-800 mb-4 playfair-display-custom">Sleep Better</h2>
                <p className="text-gray-700 mb-4 playfair-display-custom">Struggling to sleep? Preview these calming sounds to help you unwind.</p>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {['Rain', 'Waves', 'Forest'].map(sound => (
                    <button
                      key={sound}
                      onClick={() => playSound(sound)}
                      disabled={selectedSound === sound}
                      className={`p-3 rounded-lg text-sm playfair-display-custom font-medium ${selectedSound === sound ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-700 hover:bg-purple-200'} transition-colors`}
                    >
                      {selectedSound === sound ? 'Playing...' : sound}
                    </button>
                  ))}
                </div>
                <p className="text-gray-600 text-sm italic playfair-display-custom">
                  {selectedSound ? `Now playing: ${selectedSound}` : 'Click a sound to preview...'}
                </p>
              </>
            )}

            {modalType === 'mindfulness' && (
              <>
                <h2 className="text-xl font-bold text-purple-800 mb-4 playfair-display-custom">Mindfulness Practices</h2>
                <p className="text-gray-700 mb-4 playfair-display-custom">Let’s do a 1-minute body scan meditation. Focus on each part as guided below.</p>
                <div className="text-center">
                  {!isCompleted ? (
                    <>
                      <p className="text-lg text-purple-600 mb-2 playfair-display-custom">
                        {isTimerRunning ? (timer > 40 ? 'Focus on your feet...' : timer > 20 ? 'Move to your shoulders...' : 'Now your head...') : 'Ready?'}
                      </p>
                      <div className="w-full bg-purple-200 rounded-full h-2 mb-4">
                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${mindfulnessProgress}%` }}></div>
                      </div>
                      <p className="text-gray-700 mb-4 playfair-display-custom">{timer} seconds left</p>
                      <button
                        onClick={startTimer}
                        disabled={isTimerRunning}
                        className={`px-4 py-2 playfair-display-custom rounded-lg ${isTimerRunning ? 'bg-purple-200 text-purple-400' : 'bg-purple-600 text-white hover:bg-purple-700'} transition-colors`}
                      >
                        {isTimerRunning ? 'Running...' : 'Start 1-Minute Meditation'}
                      </button>
                    </>
                  ) : (
                    <p className="text-xl font-bold text-purple-800 mb-4 playfair-display-custom">Well done! You completed a mindful minute!</p>
                  )}
                </div>
              </>
            )}

            {modalType === 'worklife' && (
              <>
                <h2 className="text-xl font-bold text-purple-800 mb-4 playfair-display-custom">Work-Life Balance Tips</h2>
                <div className="max-h-96 overflow-y-auto">
                  <p className="text-gray-700 mb-4 playfair-display-custom">Struggling to separate work from life? Here’s a quick guide:</p>
                  <div className="space-y-4">
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-purple-800 playfair-display-custom">Set Boundaries</h3>
                      <p className="text-gray-600 text-sm playfair-display-custom">Decide on a cut-off time for work (e.g., 6 PM) and stick to it.</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-purple-800 playfair-display-custom">Prioritize Tasks</h3>
                      <p className="text-gray-600 text-sm playfair-display-custom">Use the Eisenhower Matrix to focus on what’s urgent and important.</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-purple-800 playfair-display-custom">Schedule “Me” Time</h3>
                      <p className="text-gray-600 text-sm playfair-display-custom">Block 30 minutes daily for something you love—reading, walking, or relaxing.</p>
                    </div>
                  </div>
                </div>
              </>
            )}

            <button
              onClick={closeModal}
              className="mt-4 w-full px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors playfair-display-custom"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WellbeingChatbot;
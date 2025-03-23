import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer, View } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { ToastContainer, ToastOptions, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: 'work' | 'personal' | 'no-zone';
  isNoZone?: boolean;
}

interface UserPreferences {
  workHours: { start: string; end: string };
  noZoneTimes: Array<{
    id: string;
    dayOfWeek: number;
    start: string;
    end: string;
    recurring: boolean;
  }>;
  maxConsecutiveMeetingHours: number;
  maxMeetingsPerDay: number;
  minBreakDuration: number;
}

const defaultPreferences: UserPreferences = {
  workHours: { start: "09:00", end: "17:00" },
  noZoneTimes: [
    { id: "1", dayOfWeek: 1, start: "12:00", end: "13:00", recurring: true },
    { id: "2", dayOfWeek: 5, start: "16:00", end: "23:59", recurring: true },
  ],
  maxConsecutiveMeetingHours: 3,
  maxMeetingsPerDay: 5,
  minBreakDuration: 15,
};

const SmartBalanceScheduler: React.FC = () => {
  const localizer = momentLocalizer(moment);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [isFirstTimeSetup, setIsFirstTimeSetup] = useState<boolean>(true);
  const [isCalendarConnected, setIsCalendarConnected] = useState<boolean>(false);
  const [isLearningPeriod, setIsLearningPeriod] = useState<boolean>(false);
  const [learningDaysLeft, setLearningDaysLeft] = useState<number>(14);
  const [showNoZoneForm, setShowNoZoneForm] = useState(false);
  const [currentView, setCurrentView] = useState<'day' | 'week' | 'month'>('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [newNoZoneTime, setNewNoZoneTime] = useState({
    dayOfWeek: new Date().getDay(),
    start: "18:00",
    end: "21:00",
    recurring: true,
  });
  const [showEventForm, setShowEventForm] = useState(false);
  
  const [newEvent, setNewEvent] = useState<{
    title: string;
    type: 'work' | 'personal' | 'no-zone';
    start: Date;
    end: Date;
  }>({
    title: '',
    type: 'work', // Remove 'as const' and let it be part of the union type
    start: moment().set({ hour: 10, minute: 0 }).toDate(),
    end: moment().set({ hour: 11, minute: 0 }).toDate(),
  });

  const customToast = (message: string, type: 'default' | 'success' | 'error' | 'warning' = 'default') => {
    const options: ToastOptions = {
      style: { background: '#f9f5ff', color: '#5e35b1', borderLeft: '4px solid #7e57c2' },
      icon: () => (
        <span className={type === 'success' ? 'text-green-500' : type === 'error' ? 'text-red-500' : type === 'warning' ? 'text-yellow-500' : 'text-blue-500'}>
          {type === 'success' ? '✓' : type === 'error' ? '✗' : type === 'warning' ? '⚠' : 'ℹ'}
        </span>
      ),
      progressClassName: 'bg-purple-600',
    };
    toast(message, options);
  };

  const fetchEvents = async () => {
    const mockEvents: CalendarEvent[] = [
      { id: '1', title: 'Team Meeting', start: moment().set({ hour: 10, minute: 0 }).toDate(), end: moment().set({ hour: 11, minute: 0 }).toDate(), type: 'work' },
      { id: '2', title: 'Client Call', start: moment().set({ hour: 11, minute: 30 }).toDate(), end: moment().set({ hour: 12, minute: 30 }).toDate(), type: 'work' },
      { id: '3', title: 'Project Planning', start: moment().set({ hour: 14, minute: 0 }).toDate(), end: moment().set({ hour: 16, minute: 0 }).toDate(), type: 'work' },
      { id: '4', title: 'Family Time', start: moment().set({ hour: 18, minute: 0 }).toDate(), end: moment().set({ hour: 20, minute: 0 }).toDate(), type: 'personal' },
    ];
    const noZoneEvents = generateNoZoneEvents(preferences.noZoneTimes);
    setEvents([...mockEvents, ...noZoneEvents]);
  };

  const generateNoZoneEvents = (noZoneTimes: UserPreferences['noZoneTimes']): CalendarEvent[] => {
    const events: CalendarEvent[] = [];
    const startOfCurrentWeek = moment().startOf('week');
    const weeksToGenerate = 8;

    noZoneTimes.forEach(zone => {
      for (let weekOffset = 0; weekOffset < weeksToGenerate; weekOffset++) {
        if (weekOffset === 0 || zone.recurring) {
          const eventDate = moment(startOfCurrentWeek).add(weekOffset, 'weeks').add(zone.dayOfWeek, 'days');
          const [startHour, startMinute] = zone.start.split(':').map(Number);
          const [endHour, endMinute] = zone.end.split(':').map(Number);
          const start = moment(eventDate).set({ hour: startHour, minute: startMinute }).toDate();
          const end = moment(eventDate).set({ hour: endHour, minute: endMinute }).toDate();
          events.push({
            id: `no-zone-${zone.id}-week-${weekOffset}`,
            title: 'No-Zone Time (Protected)',
            start,
            end,
            type: 'no-zone',
            isNoZone: true,
          });
        }
      }
    });
    return events;
  };

  const checkScheduleHealth = () => {
    let consecutiveMeetingHours = 0;
    let meetingCount = 0;
    const sortedEvents = [...events].filter(event => event.type === 'work').sort((a, b) => a.start.getTime() - b.start.getTime());

    for (let i = 0; i < sortedEvents.length; i++) {
      meetingCount++;
      const duration = (sortedEvents[i].end.getTime() - sortedEvents[i].start.getTime()) / (1000 * 60 * 60);
      consecutiveMeetingHours += duration;

      if (i < sortedEvents.length - 1) {
        const breakDuration = (sortedEvents[i + 1].start.getTime() - sortedEvents[i].end.getTime()) / (1000 * 60);
        if (breakDuration >= preferences.minBreakDuration) consecutiveMeetingHours = 0;
      }

      if (consecutiveMeetingHours >= preferences.maxConsecutiveMeetingHours) {
        customToast(`You've been in meetings for ${Math.round(consecutiveMeetingHours)} hours straight. Consider taking a break!`, 'warning');
        break;
      }
    }

    if (meetingCount > preferences.maxMeetingsPerDay) {
      customToast(`You've scheduled ${meetingCount} meetings today—that's more than your preferred maximum of ${preferences.maxMeetingsPerDay}.`, 'warning');
    }
    checkNoZoneViolations();
  };

  const checkNoZoneViolations = () => {
    const workEvents = events.filter(event => event.type === 'work');
    const noZoneEvents = events.filter(event => event.type === 'no-zone');

    for (const workEvent of workEvents) {
      for (const noZoneEvent of noZoneEvents) {
        if (
          (workEvent.start >= noZoneEvent.start && workEvent.start < noZoneEvent.end) ||
          (workEvent.end > noZoneEvent.start && workEvent.end <= noZoneEvent.end) ||
          (workEvent.start <= noZoneEvent.start && workEvent.end >= noZoneEvent.end)
        ) {
          customToast(`You have a meeting scheduled during your protected No-Zone time: ${workEvent.title}`, 'error');
        }
      }
    }
  };

  const handleBackButton = () => window.history.back();
  const handleAddNoZoneTime = () => setShowNoZoneForm(true);

  const saveNoZoneTime = () => {
    const noZoneTimeToAdd = { id: Date.now().toString(), ...newNoZoneTime };
    const updatedNoZoneTimes = [...preferences.noZoneTimes, noZoneTimeToAdd];
    setPreferences(prev => ({ ...prev, noZoneTimes: updatedNoZoneTimes }));
    setShowNoZoneForm(false);
    fetchEvents();
    customToast("Added a new No-Zone time. Your personal time is now protected!", 'success');
  };

  const cancelNoZoneTime = () => setShowNoZoneForm(false);

  const handleAddEvent = () => setShowEventForm(true);

  const saveNewEvent = () => {
    if (!newEvent.title.trim()) {
      customToast("Please enter an event title", 'error');
      return;
    }
    if (moment(newEvent.end).isSameOrBefore(newEvent.start)) {
      customToast("End time must be after start time", 'error');
      return;
    }
    const eventToAdd: CalendarEvent = { id: Date.now().toString(), ...newEvent };
    setEvents(prev => [...prev, eventToAdd]);
    setShowEventForm(false);
    setNewEvent({ title: '', type: 'work', start: moment().set({ hour: 10, minute: 0 }).toDate(), end: moment().set({ hour: 11, minute: 0 }).toDate() });
    customToast(`Added new event: ${eventToAdd.title}`, 'success');
  };

  const cancelNewEvent = () => {
    setShowEventForm(false);
    setNewEvent({ title: '', type: 'work', start: moment().set({ hour: 10, minute: 0 }).toDate(), end: moment().set({ hour: 11, minute: 0 }).toDate() });
  };

  const completeSetup = () => {
    setIsFirstTimeSetup(false);
    setIsLearningPeriod(true);
    customToast("Setup complete! Your Smart Balance Scheduler is now in learning mode for 14 days.", 'success');

    const interval = setInterval(() => {
      setLearningDaysLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsLearningPeriod(false);
          customToast("Learning period complete! Smart Balance Scheduler is now fully active with personalized insights.", 'success');
          return 0;
        }
        return prev - 1;
      });
    }, 10000);
    return () => clearInterval(interval);
  };

  const connectCalendar = () => {
    setIsCalendarConnected(true);
    customToast("Calendar connected successfully!", 'success');
  };

  useEffect(() => { fetchEvents(); }, [preferences.noZoneTimes]);
  useEffect(() => { if (!isFirstTimeSetup && !isLearningPeriod && events.length > 0) checkScheduleHealth(); }, [events, isFirstTimeSetup, isLearningPeriod]);

  const eventStyleGetter = (event: CalendarEvent) => ({
    style: {
      backgroundColor: event.type === 'work' ? '#7e57c2' : event.type === 'personal' ? '#4db6ac' : '#ef5350',
      borderRadius: '4px',
      color: '#fff',
      border: 'none',
      display: 'block',
    },
  });

  const getDailySummary = () => {
    const workEvents = events.filter(event => event.type === 'work');
    const personalEvents = events.filter(event => event.type === 'personal');
    const totalWorkHours = workEvents.reduce((total, event) => total + (event.end.getTime() - event.start.getTime()) / (1000 * 60 * 60), 0);
    const totalPersonalHours = personalEvents.reduce((total, event) => total + (event.end.getTime() - event.start.getTime()) / (1000 * 60 * 60), 0);
    return {
      workHours: Math.round(totalWorkHours * 10) / 10,
      personalHours: Math.round(totalPersonalHours * 10) / 10,
      meetingCount: workEvents.length,
      workLifeRatio: totalPersonalHours > 0 ? Math.round((totalWorkHours / totalPersonalHours) * 10) / 10 : "∞",
    };
  };

  const summary = getDailySummary();

  const handleViewChange = (view: View) => {
    if (view === 'day' || view === 'week' || view === 'month') {
      setCurrentView(view);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-5 font-sans">
      <ToastContainer position="top-right" autoClose={5000} toastClassName="rounded-lg shadow-md" progressClassName="bg-purple-600" />

      {isFirstTimeSetup ? (
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h2 className="text-2xl font-bold text-purple-600 mb-5">Welcome to Smart Balance Scheduler</h2>
          <button onClick={handleBackButton} className="bg-purple-600 text-white px-4 py-2 rounded mb-5 flex items-center gap-2 hover:bg-purple-700">← Back</button>
          <p className="text-gray-600 mb-5">Let's set up your schedule preferences to help you maintain a healthy work-life balance.</p>

          <div className="mb-8 pb-5 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-purple-700 mb-3">Step 1: Connect Your Calendar</h3>
            <button onClick={connectCalendar} className={`px-4 py-2 rounded ${isCalendarConnected ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700 text-white'}`} disabled={isCalendarConnected}>
              {isCalendarConnected ? 'Calendar Connected ✓' : 'Connect Google Calendar'}
            </button>
          </div>

          <div className="mb-8 pb-5 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-purple-700 mb-3">Step 2: Set Your Work Hours</h3>
            <div className="flex gap-5">
              <div>
                <label className="block mb-1">Start Time:</label>
                <input type="time" value={preferences.workHours.start} onChange={(e) => setPreferences({ ...preferences, workHours: { ...preferences.workHours, start: e.target.value } })} className="border border-gray-300 rounded p-2" />
              </div>
              <div>
                <label className="block mb-1">End Time:</label>
                <input type="time" value={preferences.workHours.end} onChange={(e) => setPreferences({ ...preferences, workHours: { ...preferences.workHours, end: e.target.value } })} className="border border-gray-300 rounded p-2" />
              </div>
            </div>
          </div>

          <div className="mb-8 pb-5 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-purple-700 mb-3">Step 3: Add No-Zone Times</h3>
            <p className="text-gray-600 mb-3">These are times when you don't want to be disturbed by work.</p>
            <button onClick={handleAddNoZoneTime} className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">Add No-Zone Time</button>

            {showNoZoneForm && (
              <div className="mt-4 bg-white p-4 rounded-lg shadow-md">
                <div className="mb-3">
                  <label className="block mb-1 font-medium">Day of Week:</label>
                  <select value={newNoZoneTime.dayOfWeek} onChange={(e) => setNewNoZoneTime({ ...newNoZoneTime, dayOfWeek: parseInt(e.target.value) })} className="border border-gray-300 rounded p-2 w-full">
                    {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, i) => <option key={i} value={i}>{day}</option>)}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="block mb-1 font-medium">Start Time:</label>
                  <input type="time" value={newNoZoneTime.start} onChange={(e) => setNewNoZoneTime({ ...newNoZoneTime, start: e.target.value })} className="border border-gray-300 rounded p-2 w-full" />
                </div>
                <div className="mb-3">
                  <label className="block mb-1 font-medium">End Time:</label>
                  <input type="time" value={newNoZoneTime.end} onChange={(e) => setNewNoZoneTime({ ...newNoZoneTime, end: e.target.value })} className="border border-gray-300 rounded p-2 w-full" />
                </div>
                <div className="mb-3">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={newNoZoneTime.recurring} onChange={(e) => setNewNoZoneTime({ ...newNoZoneTime, recurring: e.target.checked })} />
                    Recurring weekly
                  </label>
                </div>
                <div className="flex gap-3">
                  <button onClick={saveNoZoneTime} className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">Save</button>
                  <button onClick={cancelNoZoneTime} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Cancel</button>
                </div>
              </div>
            )}

            <div className="mt-3">
              {preferences.noZoneTimes.map(zone => (
                <div key={zone.id} className="flex justify-between items-center p-2 bg-purple-50 rounded mb-2">
                  <span>{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][zone.dayOfWeek]}: {zone.start} - {zone.end} {zone.recurring ? '(recurring)' : ''}</span>
                  <button onClick={() => setPreferences({ ...preferences, noZoneTimes: preferences.noZoneTimes.filter(z => z.id !== zone.id) })} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">Remove</button>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-8 pb-5 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-purple-700 mb-3">Step 4: Set Balance Preferences</h3>
            <div className="mb-3 flex items-center gap-3">
              <label className="w-64">Maximum consecutive meeting hours:</label>
              <input type="number" value={preferences.maxConsecutiveMeetingHours} onChange={(e) => setPreferences({ ...preferences, maxConsecutiveMeetingHours: parseInt(e.target.value) })} min="1" max="8" className="border border-gray-300 rounded p-2" />
            </div>
            <div className="mb-3 flex items-center gap-3">
              <label className="w-64">Maximum meetings per day:</label>
              <input type="number" value={preferences.maxMeetingsPerDay} onChange={(e) => setPreferences({ ...preferences, maxMeetingsPerDay: parseInt(e.target.value) })} min="1" max="15" className="border border-gray-300 rounded p-2" />
            </div>
            <div className="mb-3 flex items-center gap-3">
              <label className="w-64">Minimum break duration (minutes):</label>
              <input type="number" value={preferences.minBreakDuration} onChange={(e) => setPreferences({ ...preferences, minBreakDuration: parseInt(e.target.value) })} min="5" max="60" step="5" className="border border-gray-300 rounded p-2" />
            </div>
          </div>

          <button onClick={completeSetup} className="bg-purple-600 text-white px-6 py-3 rounded hover:bg-purple-700">Complete Setup</button>
        </div>
      ) : (
        <div>
          <div className="mb-5">
            <button onClick={handleBackButton} className="bg-purple-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-purple-700">← Back</button>
          </div>
          {isLearningPeriod && (
            <div className="bg-gradient-to-r from-purple-100 to-purple-200 rounded-lg p-4 mb-5 flex items-center gap-3">
              <span className="text-2xl">📊</span>
              <div>
                <h3 className="text-lg font-semibold text-purple-700">Learning Period Active</h3>
                <p className="text-purple-800">Hermony is analyzing your schedule patterns to provide personalized insights. {learningDaysLeft} days remaining.</p>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg p-5 shadow-md mb-5">
            <h3 className="text-xl font-semibold text-purple-700 mb-3">Today's Schedule</h3>
            <div className="flex justify-between">
              <div className="text-center flex-1">
                <span className="block text-2xl font-bold text-purple-600">{summary.workHours}h</span>
                <span className="text-gray-600">Work Time</span>
              </div>
              <div className="text-center flex-1">
                <span className="block text-2xl font-bold text-purple-600">{summary.personalHours}h</span>
                <span className="text-gray-600">Personal Time</span>
              </div>
              <div className="text-center flex-1">
                <span className="block text-2xl font-bold text-purple-600">{summary.meetingCount}</span>
                <span className="text-gray-600">Meetings</span>
              </div>
              <div className="text-center flex-1">
                <span className="block text-2xl font-bold text-purple-600">{summary.workLifeRatio}</span>
                <span className="text-gray-600">Work/Life Ratio</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mb-5">
            <button onClick={handleAddNoZoneTime} className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">Add No-Zone Time</button>
            <button onClick={handleAddEvent} className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">Add Calendar Event</button>
            <button onClick={checkScheduleHealth} className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">Check Schedule Health</button>
          </div>

          {showNoZoneForm && (
            <div className="bg-white p-4 rounded-lg shadow-md absolute z-10 w-80">
              <div className="mb-3">
                <label className="block mb-1 font-medium">Day of Week:</label>
                <select value={newNoZoneTime.dayOfWeek} onChange={(e) => setNewNoZoneTime({ ...newNoZoneTime, dayOfWeek: parseInt(e.target.value) })} className="border border-gray-300 rounded p-2 w-full">
                  {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, i) => <option key={i} value={i}>{day}</option>)}
                </select>
              </div>
              <div className="mb-3">
                <label className="block mb-1 font-medium">Start Time:</label>
                <input type="time" value={newNoZoneTime.start} onChange={(e) => setNewNoZoneTime({ ...newNoZoneTime, start: e.target.value })} className="border border-gray-300 rounded p-2 w-full" />
              </div>
              <div className="mb-3">
                <label className="block mb-1 font-medium">End Time:</label>
                <input type="time" value={newNoZoneTime.end} onChange={(e) => setNewNoZoneTime({ ...newNoZoneTime, end: e.target.value })} className="border border-gray-300 rounded p-2 w-full" />
              </div>
              <div className="mb-3">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={newNoZoneTime.recurring} onChange={(e) => setNewNoZoneTime({ ...newNoZoneTime, recurring: e.target.checked })} />
                  Recurring weekly
                </label>
              </div>
              <div className="flex gap-3">
                <button onClick={saveNoZoneTime} className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">Save</button>
                <button onClick={cancelNoZoneTime} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Cancel</button>
              </div>
            </div>
          )}

          {showEventForm && (
            <div className="bg-white p-4 rounded-lg shadow-md absolute z-10 w-80">
              <h3 className="text-lg font-semibold text-purple-700 mb-3">Add New Event</h3>
              <div className="mb-3">
                <label className="block mb-1 font-medium">Title:</label>
                <input type="text" value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} placeholder="Meeting title" className="border border-gray-300 rounded p-2 w-full" />
              </div>
              <div className="mb-3">
                <label className="block mb-1 font-medium">Event Type:</label>
                <select value={newEvent.type} onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as 'work' | 'personal' | 'no-zone' })} className="border border-gray-300 rounded p-2 w-full">
                  <option value="work">Work</option>
                  <option value="personal">Personal</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="block mb-1 font-medium">Date:</label>
                <input type="date" value={moment(newEvent.start).format('YYYY-MM-DD')} onChange={(e) => {
                  const date = e.target.value;
                  const newStart = moment(newEvent.start).year(parseInt(date.substr(0, 4))).month(parseInt(date.substr(5, 2)) - 1).date(parseInt(date.substr(8, 2))).toDate();
                  const newEnd = moment(newEvent.end).year(parseInt(date.substr(0, 4))).month(parseInt(date.substr(5, 2)) - 1).date(parseInt(date.substr(8, 2))).toDate();
                  setNewEvent({ ...newEvent, start: newStart, end: newEnd });
                }} className="border border-gray-300 rounded p-2 w-full" />
              </div>
              <div className="mb-3">
                <label className="block mb-1 font-medium">Start Time:</label>
                <input type="time" value={moment(newEvent.start).format('HH:mm')} onChange={(e) => {
                  const [hours, minutes] = e.target.value.split(':').map(Number);
                  const newStart = moment(newEvent.start).set({ hour: hours, minute: minutes }).toDate();
                  setNewEvent({ ...newEvent, start: newStart });
                }} className="border border-gray-300 rounded p-2 w-full" />
              </div>
              <div className="mb-3">
                <label className="block mb-1 font-medium">End Time:</label>
                <input type="time" value={moment(newEvent.end).format('HH:mm')} onChange={(e) => {
                  const [hours, minutes] = e.target.value.split(':').map(Number);
                  const newEnd = moment(newEvent.end).set({ hour: hours, minute: minutes }).toDate();
                  setNewEvent({ ...newEvent, end: newEnd });
                }} className="border border-gray-300 rounded p-2 w-full" />
              </div>
              <div className="flex gap-3">
                <button onClick={saveNewEvent} className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">Add Event</button>
                <button onClick={cancelNewEvent} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Cancel</button>
              </div>
            </div>
          )}

          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
            eventPropGetter={eventStyleGetter}
            views={['day', 'week', 'month']} // Remove 'as const' to make it a mutable array
            view={currentView}
            onView={handleViewChange}
            date={currentDate}
            onNavigate={setCurrentDate}
            defaultView="week"
          />

          <div className="flex justify-center gap-5 mt-5">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-purple-600"></div>
              <span>Work Meetings</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-teal-500"></div>
              <span>Personal Time</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-red-500"></div>
              <span>No-Zone (Protected Time)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartBalanceScheduler;
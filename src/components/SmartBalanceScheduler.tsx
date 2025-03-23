import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { ToastContainer, ToastContentProps, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Define types for our calendar events
interface CalendarEvent {
    id: string;
    title: string;
    start: Date;
    end: Date;
    type: 'work' | 'personal' | 'no-zone';
    isNoZone?: boolean;
}

interface UserPreferences {
    workHours: {
        start: string; // format: "HH:MM"
        end: string; // format: "HH:MM"
    };
    noZoneTimes: Array<{
        id: string;
        dayOfWeek: number; // 0 = Sunday, 6 = Saturday
        start: string; // format: "HH:MM"
        end: string; // format: "HH:MM"
        recurring: boolean;
    }>;
    maxConsecutiveMeetingHours: number;
    maxMeetingsPerDay: number;
    minBreakDuration: number; // in minutes
}

const defaultPreferences: UserPreferences = {
    workHours: {
        start: "09:00",
        end: "17:00"
    },
    noZoneTimes: [
        {
            id: "1",
            dayOfWeek: 1, // Monday
            start: "12:00",
            end: "13:00",
            recurring: true
        },
        {
            id: "2",
            dayOfWeek: 5, // Friday
            start: "16:00",
            end: "23:59",
            recurring: true
        }
    ],
    maxConsecutiveMeetingHours: 3,
    maxMeetingsPerDay: 5,
    minBreakDuration: 15
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
        recurring: true
    });
    const [showEventForm, setShowEventForm] = useState(false);
    const [newEvent, setNewEvent] = useState({
        title: '',
        type: 'work',
        start: moment().set({ hour: 10, minute: 0 }).toDate(),
        end: moment().set({ hour: 11, minute: 0 }).toDate()
    });

    // Custom toast function with harmonious colors
    const customToast = (message: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | ((props: ToastContentProps<unknown>) => React.ReactNode) | null | undefined, type = 'default') => {
        const options = {
            progressStyle: { background: '#7e57c2' },
            style: { background: '#f9f5ff', color: '#5e35b1', borderLeft: '4px solid #7e57c2' },
            icon: type === 'success' ? '✓' : type === 'error' ? '✗' : type === 'warning' ? '⚠' : 'ℹ',
            iconTheme: {
                primary: '#7e57c2',
                secondary: '#f9f5ff'
            }
        };

        toast(message, options);
    };

    // Fetch calendar events from API (mock for now)
    const fetchEvents = async () => {
        // In a real app, this would connect to Google Calendar API or similar
        // For demo purposes, we'll create some mock events
        const mockEvents: CalendarEvent[] = [
            {
                id: '1',
                title: 'Team Meeting',
                start: moment().set({ hour: 10, minute: 0 }).toDate(),
                end: moment().set({ hour: 11, minute: 0 }).toDate(),
                type: 'work'
            },
            {
                id: '2',
                title: 'Client Call',
                start: moment().set({ hour: 11, minute: 30 }).toDate(),
                end: moment().set({ hour: 12, minute: 30 }).toDate(),
                type: 'work'
            },
            {
                id: '3',
                title: 'Project Planning',
                start: moment().set({ hour: 14, minute: 0 }).toDate(),
                end: moment().set({ hour: 16, minute: 0 }).toDate(),
                type: 'work'
            },
            {
                id: '4',
                title: 'Family Time',
                start: moment().set({ hour: 18, minute: 0 }).toDate(),
                end: moment().set({ hour: 20, minute: 0 }).toDate(),
                type: 'personal'
            }
        ];

        // Add no-zone times from preferences
        const noZoneEvents = generateNoZoneEvents(preferences.noZoneTimes);

        setEvents([...mockEvents, ...noZoneEvents]);
    };

    const generateNoZoneEvents = (noZoneTimes: UserPreferences['noZoneTimes']): CalendarEvent[] => {
        const events: CalendarEvent[] = [];

        // Generate events for the current week and several weeks into the future
        const startOfCurrentWeek = moment().startOf('week');
        const weeksToGenerate = 8; // Generate for 8 weeks (adjust as needed)

        noZoneTimes.forEach(zone => {
            // For each no-zone time, generate it for the appropriate weeks
            for (let weekOffset = 0; weekOffset < weeksToGenerate; weekOffset++) {
                // For non-recurring events, only add them in the current week
                if (weekOffset === 0 || zone.recurring) {
                    // Calculate the specific date for this no-zone time
                    const eventDate = moment(startOfCurrentWeek)
                        .add(weekOffset, 'weeks')
                        .add(zone.dayOfWeek, 'days');

                    // Parse the start and end times
                    const [startHour, startMinute] = zone.start.split(':').map(Number);
                    const [endHour, endMinute] = zone.end.split(':').map(Number);

                    // Create event start and end dates
                    const start = moment(eventDate)
                        .set({ hour: startHour, minute: startMinute })
                        .toDate();

                    const end = moment(eventDate)
                        .set({ hour: endHour, minute: endMinute })
                        .toDate();

                    // Add to events array
                    events.push({
                        id: `no-zone-${zone.id}-week-${weekOffset}`,
                        title: 'No-Zone Time (Protected)',
                        start,
                        end,
                        type: 'no-zone',
                        isNoZone: true
                    });
                }
            }
        });

        return events;
    };

    // Check for schedule issues and provide alerts
    const checkScheduleHealth = () => {
        // Check for consecutive meetings
        let consecutiveMeetingHours = 0;
        let meetingCount = 0;

        // Sort events by start time
        const sortedEvents = [...events]
            .filter(event => event.type === 'work')
            .sort((a, b) => a.start.getTime() - b.start.getTime());

        // Count meetings and check for consecutive meetings
        for (let i = 0; i < sortedEvents.length; i++) {
            meetingCount++;

            // Calculate duration of current meeting in hours
            const duration = (sortedEvents[i].end.getTime() - sortedEvents[i].start.getTime()) / (1000 * 60 * 60);
            consecutiveMeetingHours += duration;

            // Check if there's a break after this meeting
            if (i < sortedEvents.length - 1) {
                const breakDuration = (sortedEvents[i + 1].start.getTime() - sortedEvents[i].end.getTime()) / (1000 * 60);

                if (breakDuration >= preferences.minBreakDuration) {
                    // Reset consecutive meeting count if there's a sufficient break
                    consecutiveMeetingHours = 0;
                }
            }

            // Alert if too many consecutive meeting hours
            if (consecutiveMeetingHours >= preferences.maxConsecutiveMeetingHours) {
                customToast(`You've been in meetings for ${Math.round(consecutiveMeetingHours)} hours straight. Consider taking a break!`, 'warning');
                break;
            }
        }

        // Alert if too many meetings in a day
        if (meetingCount > preferences.maxMeetingsPerDay) {
            customToast(`You've scheduled ${meetingCount} meetings today—that's more than your preferred maximum of ${preferences.maxMeetingsPerDay}.`, 'warning');
        }

        // Check for meetings during no-zone times
        checkNoZoneViolations();
    };

    const checkNoZoneViolations = () => {
        const workEvents = events.filter(event => event.type === 'work');
        const noZoneEvents = events.filter(event => event.type === 'no-zone');

        for (const workEvent of workEvents) {
            for (const noZoneEvent of noZoneEvents) {
                // Check if work event overlaps with no-zone time
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

    const handleBackButton = () => {
        window.history.back();
    };

    const handleAddNoZoneTime = () => {
        setShowNoZoneForm(true);
    };

    const saveNoZoneTime = () => {
        const noZoneTimeToAdd = {
            id: Date.now().toString(),
            ...newNoZoneTime
        };

        const updatedNoZoneTimes = [...preferences.noZoneTimes, noZoneTimeToAdd];

        setPreferences(prev => ({
            ...prev,
            noZoneTimes: updatedNoZoneTimes
        }));

        setShowNoZoneForm(false);

        fetchEvents();

        customToast("Added a new No-Zone time. Your personal time is now protected!", 'success');
    };

    const cancelNoZoneTime = () => {
        setShowNoZoneForm(false);
    };

    const handleAddEvent = () => {
        // Show the event form instead of directly adding an event
        setShowEventForm(true);
    };

    // Add these new functions
    const saveNewEvent = () => {
        // Validate form data
        if (!newEvent.title.trim()) {
            customToast("Please enter an event title", 'error');
            return;
        }

        if (moment(newEvent.end).isSameOrBefore(newEvent.start)) {
            customToast("End time must be after start time", 'error');
            return;
        }

        // Create the new event with a unique ID
        const eventToAdd: CalendarEvent = {
            id: Date.now().toString(),
            title: newEvent.title,
            start: newEvent.start,
            end: newEvent.end,
            type: newEvent.type as 'work' | 'personal' | 'no-zone'
        };

        // Add the event to the state
        setEvents(prev => [...prev, eventToAdd]);

        // Reset and close the form
        setShowEventForm(false);
        setNewEvent({
            title: '',
            type: 'work',
            start: moment().set({ hour: 10, minute: 0 }).toDate(),
            end: moment().set({ hour: 11, minute: 0 }).toDate()
        });

        customToast(`Added new event: ${eventToAdd.title}`, 'success');
    };

    const cancelNewEvent = () => {
        setShowEventForm(false);
        // Reset the form
        setNewEvent({
            title: '',
            type: 'work',
            start: moment().set({ hour: 10, minute: 0 }).toDate(),
            end: moment().set({ hour: 11, minute: 0 }).toDate()
        });
    };

    const completeSetup = () => {
        setIsFirstTimeSetup(false);
        setIsLearningPeriod(true);
        customToast("Setup complete! Your Smart Balance Scheduler is now in learning mode for 14 days.", 'success');

        // Simulate learning period countdown
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
        }, 10000); // Faster simulation for demo: 10 seconds = 1 day

        return () => clearInterval(interval);
    };

    const connectCalendar = () => {
        // In a real app, this would initiate OAuth flow for Google Calendar or similar
        setIsCalendarConnected(true);
        customToast("Calendar connected successfully!", 'success');
    };

    useEffect(() => {
        fetchEvents();
    }, [preferences.noZoneTimes]);

    useEffect(() => {
        if (!isFirstTimeSetup && !isLearningPeriod && events.length > 0) {
            checkScheduleHealth();
        }
    }, [events, isFirstTimeSetup, isLearningPeriod]);

    // Custom event styling based on event type
    const eventStyleGetter = (event: CalendarEvent) => {
        let style = {
            backgroundColor: '',
            borderRadius: '4px',
            color: '#fff',
            border: 'none',
            display: 'block'
        };

        switch (event.type) {
            case 'work':
                style.backgroundColor = '#7e57c2'; // Purple that matches Hermony theme
                break;
            case 'personal':
                style.backgroundColor = '#4db6ac'; // Teal
                break;
            case 'no-zone':
                style.backgroundColor = '#ef5350'; // Red for no-zone times
                break;
            default:
                style.backgroundColor = '#7e57c2'; // Default purple
        }

        return {
            style
        };
    };

    // Get daily summary stats
    const getDailySummary = () => {
        const workEvents = events.filter(event => event.type === 'work');
        const personalEvents = events.filter(event => event.type === 'personal');

        const totalWorkHours = workEvents.reduce((total, event) => {
            return total + (event.end.getTime() - event.start.getTime()) / (1000 * 60 * 60);
        }, 0);

        const totalPersonalHours = personalEvents.reduce((total, event) => {
            return total + (event.end.getTime() - event.start.getTime()) / (1000 * 60 * 60);
        }, 0);

        return {
            workHours: Math.round(totalWorkHours * 10) / 10,
            personalHours: Math.round(totalPersonalHours * 10) / 10,
            meetingCount: workEvents.length,
            workLifeRatio: totalPersonalHours > 0
                ? Math.round((totalWorkHours / totalPersonalHours) * 10) / 10
                : "∞"
        };
    };

    const summary = getDailySummary();

    return (
        <div className="smart-balance-scheduler">
            <ToastContainer
                position="top-right"
                autoClose={5000}
                toastClassName="custom-toast"
                progressClassName="toast-progress"
            />

            {isFirstTimeSetup ? (
                <div className="setup-container">
                    <h2>Welcome to Smart Balance Scheduler</h2>
                    <button onClick={handleBackButton} className="back-button">
                        ← Back
                    </button>
                    <p>Let's set up your schedule preferences to help you maintain a healthy work-life balance.</p>

                    <div className="setup-step">
                        <h3>Step 1: Connect Your Calendar</h3>
                        <button
                            onClick={connectCalendar}
                            className="connect-button"
                            disabled={isCalendarConnected}
                        >
                            {isCalendarConnected ? 'Calendar Connected ✓' : 'Connect Google Calendar'}
                        </button>
                    </div>

                    <div className="setup-step">
                        <h3>Step 2: Set Your Work Hours</h3>
                        <div className="time-inputs">
                            <div>
                                <label>Start Time:</label>
                                <input
                                    type="time"
                                    value={preferences.workHours.start}
                                    onChange={(e) => setPreferences({
                                        ...preferences,
                                        workHours: { ...preferences.workHours, start: e.target.value }
                                    })}
                                />
                            </div>
                            <div>
                                <label>End Time:</label>
                                <input
                                    type="time"
                                    value={preferences.workHours.end}
                                    onChange={(e) => setPreferences({
                                        ...preferences,
                                        workHours: { ...preferences.workHours, end: e.target.value }
                                    })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="setup-step">
                        <h3>Step 3: Add No-Zone Times (Protected Personal Time)</h3>
                        <p>These are times when you don't want to be disturbed by work.</p>
                        <button onClick={handleAddNoZoneTime} className="add-button">
                            Add No-Zone Time
                        </button>

                        {showNoZoneForm && (
                            <div className="no-zone-form">
                                <div className="form-row">
                                    <label>Day of Week:</label>
                                    <select
                                        value={newNoZoneTime.dayOfWeek}
                                        onChange={(e) => setNewNoZoneTime({
                                            ...newNoZoneTime,
                                            dayOfWeek: parseInt(e.target.value)
                                        })}
                                    >
                                        <option value={0}>Sunday</option>
                                        <option value={1}>Monday</option>
                                        <option value={2}>Tuesday</option>
                                        <option value={3}>Wednesday</option>
                                        <option value={4}>Thursday</option>
                                        <option value={5}>Friday</option>
                                        <option value={6}>Saturday</option>
                                    </select>
                                </div>
                                <div className="form-row">
                                    <label>Start Time:</label>
                                    <input
                                        type="time"
                                        value={newNoZoneTime.start}
                                        onChange={(e) => setNewNoZoneTime({
                                            ...newNoZoneTime,
                                            start: e.target.value
                                        })}
                                    />
                                </div>
                                <div className="form-row">
                                    <label>End Time:</label>
                                    <input
                                        type="time"
                                        value={newNoZoneTime.end}
                                        onChange={(e) => setNewNoZoneTime({
                                            ...newNoZoneTime,
                                            end: e.target.value
                                        })}
                                    />
                                </div>
                                <div className="form-row">
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={newNoZoneTime.recurring}
                                            onChange={(e) => setNewNoZoneTime({
                                                ...newNoZoneTime,
                                                recurring: e.target.checked
                                            })}
                                        />
                                        Recurring weekly
                                    </label>
                                </div>
                                <div className="form-buttons">
                                    <button onClick={saveNoZoneTime} className="save-button">Save</button>
                                    <button onClick={cancelNoZoneTime} className="cancel-button">Cancel</button>
                                </div>
                            </div>
                        )}

                        <div className="no-zone-list">
                            {preferences.noZoneTimes.map((zone) => (
                                <div key={zone.id} className="no-zone-item">
                                    <span>
                                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][zone.dayOfWeek]}:&nbsp;
                                        {zone.start} - {zone.end}
                                        {zone.recurring ? ' (recurring)' : ''}
                                    </span>
                                    <button
                                        onClick={() => {
                                            const updatedZones = preferences.noZoneTimes.filter(z => z.id !== zone.id);
                                            setPreferences({ ...preferences, noZoneTimes: updatedZones });
                                        }}
                                        className="remove-button"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="setup-step">
                        <h3>Step 4: Set Balance Preferences</h3>
                        <div className="preference-item">
                            <label>Maximum consecutive meeting hours:</label>
                            <input
                                type="number"
                                value={preferences.maxConsecutiveMeetingHours}
                                onChange={(e) => setPreferences({
                                    ...preferences,
                                    maxConsecutiveMeetingHours: parseInt(e.target.value)
                                })}
                                min="1"
                                max="8"
                            />
                        </div>
                        <div className="preference-item">
                            <label>Maximum meetings per day:</label>
                            <input
                                type="number"
                                value={preferences.maxMeetingsPerDay}
                                onChange={(e) => setPreferences({
                                    ...preferences,
                                    maxMeetingsPerDay: parseInt(e.target.value)
                                })}
                                min="1"
                                max="15"
                            />
                        </div>
                        <div className="preference-item">
                            <label>Minimum break duration (minutes):</label>
                            <input
                                type="number"
                                value={preferences.minBreakDuration}
                                onChange={(e) => setPreferences({
                                    ...preferences,
                                    minBreakDuration: parseInt(e.target.value)
                                })}
                                min="5"
                                max="60"
                                step="5"
                            />
                        </div>
                    </div>

                    <button onClick={completeSetup} className="complete-button">
                        Complete Setup
                    </button>
                </div>
            ) : (
                <div className="calendar-container">
                    <div className="back-button-container">
                        <button onClick={handleBackButton} className="back-button">
                            ← Back
                        </button>
                    </div>
                    {isLearningPeriod && (
                        <div className="learning-banner">
                            <div className="learning-icon">📊</div>
                            <div className="learning-text">
                                <h3>Learning Period Active</h3>
                                <p>Hermony is analyzing your schedule patterns to provide personalized insights. {learningDaysLeft} days remaining.</p>
                            </div>
                        </div>
                    )}

                    <div className="dashboard">
                        <div className="summary-card">
                            <h3>Today's Schedule</h3>
                            <div className="summary-stats">
                                <div className="stat-item">
                                    <span className="stat-value">{summary.workHours}h</span>
                                    <span className="stat-label">Work Time</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-value">{summary.personalHours}h</span>
                                    <span className="stat-label">Personal Time</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-value">{summary.meetingCount}</span>
                                    <span className="stat-label">Meetings</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-value">{summary.workLifeRatio}</span>
                                    <span className="stat-label">Work/Life Ratio</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="controls">
                        <button onClick={handleAddNoZoneTime} className="add-no-zone-button">
                            Add No-Zone Time
                        </button>
                        {showNoZoneForm && (
                            <div className="no-zone-form">
                                <div className="form-row">
                                    <label>Day of Week:</label>
                                    <select
                                        value={newNoZoneTime.dayOfWeek}
                                        onChange={(e) => setNewNoZoneTime({
                                            ...newNoZoneTime,
                                            dayOfWeek: parseInt(e.target.value)
                                        })}
                                    >
                                        <option value={0}>Sunday</option>
                                        <option value={1}>Monday</option>
                                        <option value={2}>Tuesday</option>
                                        <option value={3}>Wednesday</option>
                                        <option value={4}>Thursday</option>
                                        <option value={5}>Friday</option>
                                        <option value={6}>Saturday</option>
                                    </select>
                                </div>
                                <div className="form-row">
                                    <label>Start Time:</label>
                                    <input
                                        type="time"
                                        value={newNoZoneTime.start}
                                        onChange={(e) => setNewNoZoneTime({
                                            ...newNoZoneTime,
                                            start: e.target.value
                                        })}
                                    />
                                </div>
                                <div className="form-row">
                                    <label>End Time:</label>
                                    <input
                                        type="time"
                                        value={newNoZoneTime.end}
                                        onChange={(e) => setNewNoZoneTime({
                                            ...newNoZoneTime,
                                            end: e.target.value
                                        })}
                                    />
                                </div>
                                <div className="form-row">
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={newNoZoneTime.recurring}
                                            onChange={(e) => setNewNoZoneTime({
                                                ...newNoZoneTime,
                                                recurring: e.target.checked
                                            })}
                                        />
                                        Recurring weekly
                                    </label>
                                </div>
                                <div className="form-buttons">
                                    <button onClick={saveNoZoneTime} className="save-button">Save</button>
                                    <button onClick={cancelNoZoneTime} className="cancel-button">Cancel</button>
                                </div>
                            </div>
                        )}
                        <button onClick={handleAddEvent} className="add-event-button">
                            Add Calendar Event
                        </button>
                        {/* Add this after the No-Zone form */}
                        {showEventForm && (
                            <div className="event-form">
                                <h3>Add New Event</h3>
                                <div className="form-row">
                                    <label>Title:</label>
                                    <input
                                        type="text"
                                        value={newEvent.title}
                                        onChange={(e) => setNewEvent({
                                            ...newEvent,
                                            title: e.target.value
                                        })}
                                        placeholder="Meeting title"
                                    />
                                </div>
                                <div className="form-row">
                                    <label>Event Type:</label>
                                    <select
                                        value={newEvent.type}
                                        onChange={(e) => setNewEvent({
                                            ...newEvent,
                                            type: e.target.value as 'work' | 'personal' | 'no-zone'
                                        })}
                                    >
                                        <option value="work">Work</option>
                                        <option value="personal">Personal</option>
                                    </select>
                                </div>
                                <div className="form-row">
                                    <label>Date:</label>
                                    <input
                                        type="date"
                                        value={moment(newEvent.start).format('YYYY-MM-DD')}
                                        onChange={(e) => {
                                            const date = e.target.value;
                                            const newStart = moment(newEvent.start)
                                                .year(parseInt(date.substr(0, 4)))
                                                .month(parseInt(date.substr(5, 2)) - 1)
                                                .date(parseInt(date.substr(8, 2)))
                                                .toDate();

                                            const newEnd = moment(newEvent.end)
                                                .year(parseInt(date.substr(0, 4)))
                                                .month(parseInt(date.substr(5, 2)) - 1)
                                                .date(parseInt(date.substr(8, 2)))
                                                .toDate();

                                            setNewEvent({
                                                ...newEvent,
                                                start: newStart,
                                                end: newEnd
                                            });
                                        }}
                                    />
                                </div>
                                <div className="form-row">
                                    <label>Start Time:</label>
                                    <input
                                        type="time"
                                        value={moment(newEvent.start).format('HH:mm')}
                                        onChange={(e) => {
                                            const [hours, minutes] = e.target.value.split(':').map(Number);
                                            const newStart = moment(newEvent.start)
                                                .set({ hour: hours, minute: minutes })
                                                .toDate();

                                            setNewEvent({
                                                ...newEvent,
                                                start: newStart
                                            });
                                        }}
                                    />
                                </div>
                                <div className="form-row">
                                    <label>End Time:</label>
                                    <input
                                        type="time"
                                        value={moment(newEvent.end).format('HH:mm')}
                                        onChange={(e) => {
                                            const [hours, minutes] = e.target.value.split(':').map(Number);
                                            const newEnd = moment(newEvent.end)
                                                .set({ hour: hours, minute: minutes })
                                                .toDate();

                                            setNewEvent({
                                                ...newEvent,
                                                end: newEnd
                                            });
                                        }}
                                    />
                                </div>
                                <div className="form-buttons">
                                    <button onClick={saveNewEvent} className="save-button">Add Event</button>
                                    <button onClick={cancelNewEvent} className="cancel-button">Cancel</button>
                                </div>
                            </div>
                        )}

                        <button onClick={checkScheduleHealth} className="check-health-button">
                            Check Schedule Health
                        </button>
                    </div>

                    <Calendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: 500 }}
                        eventPropGetter={eventStyleGetter}
                        views={['day', 'week', 'month']}
                        view={currentView}
                        onView={setCurrentView}
                        date={currentDate}
                        onNavigate={setCurrentDate}
                        defaultView="week"
                    />

                    <div className="legend">
                        <div className="legend-item">
                            <div className="color-box work"></div>
                            <span>Work Meetings</span>
                        </div>
                        <div className="legend-item">
                            <div className="color-box personal"></div>
                            <span>Personal Time</span>
                        </div>
                        <div className="legend-item">
                            <div className="color-box no-zone"></div>
                            <span>No-Zone (Protected Time)</span>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
        .smart-balance-scheduler {
          font-family: 'Inter', sans-serif;
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .setup-container {
          background: white;
          border-radius: 10px;
          padding: 30px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }
        
        h2 {
          color: #7e57c2;
          margin-bottom: 20px;
        }
        
        .setup-step {
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 1px solid #eee;
        }
        
        h3 {
          color: #5e35b1;
          margin-bottom: 15px;
        }
        
        .time-inputs {
          display: flex;
          gap: 20px;
          margin-top: 10px;
        }
        
        input[type="time"], input[type="number"] {
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 16px;
        }
        
        .no-zone-list {
          margin-top: 15px;
        }
        
        .no-zone-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px;
          background: #f9f5ff;
          border-radius: 4px;
          margin-bottom: 8px;
        }
        
        button {
          background-color: #7e57c2;
          color: white;
          border: none;
          padding: 10px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
          transition: background-color 0.2s;
        }
        
        button:hover {
          background-color: #6a3ab2;
        }
        
        button:disabled {
          background-color: #b39ddb;
          cursor: not-allowed;
        }
        
        .complete-button {
          background-color: #7e57c2;
          font-size: 18px;
          padding: 12px 24px;
          margin-top: 20px;
        }
        
        .complete-button:hover {
          background-color: #6a3ab2;
        }
        
        .remove-button {
          background-color: #f44336;
          padding: 5px 10px;
          font-size: 14px;
        }
        
        .remove-button:hover {
          background-color: #d32f2f;
        }
        
        .preference-item {
          margin-bottom: 15px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .preference-item label {
          min-width: 250px;
        }
        
        .calendar-container {
          margin-top: 20px;
        }
        
        .controls {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }
        
        .legend {
          display: flex;
          margin-top: 20px;
          gap: 20px;
          justify-content: center;
        }
        
        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .color-box {
          width: 16px;
          height: 16px;
          border-radius: 4px;
        }
        
        .color-box.work {
          background-color: #7e57c2;
        }
        
        .color-box.personal {
          background-color: #4db6ac;
        }
        
        .color-box.no-zone {
          background-color: #ef5350;
        }
        
        .learning-banner {
          background: linear-gradient(90deg, #f3e5f5, #e1bee7);
          border-radius: 8px;
          padding: 15px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 15px;
        }
        
        .learning-icon {
          font-size: 24px;
        }
        
        .learning-text h3 {
          margin: 0 0 5px 0;
          color: #5e35b1;
        }
        
        .learning-text p {
          margin: 0;
          color: #6a1b9a;
        }
        
        .dashboard {
          margin-bottom: 20px;
        }
        
        .summary-card {
          background: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        .summary-card h3 {
          margin-top: 0;
          margin-bottom: 15px;
          color: #5e35b1;
        }
        
        .summary-stats {
          display: flex;
          justify-content: space-between;
        }
        
        .stat-item {
          text-align: center;
          flex: 1;
        }
        
        .stat-value {
          display: block;
          font-size: 24px;
          font-weight: bold;
          color: #7e57c2;
        }
        
        .stat-label {
          font-size: 14px;
          color: #666;
        }
        .event-form {
          background: white;
          border-radius: 8px;
          padding: 20px;
          margin-top: 15px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          position: absolute;
          z-index: 10;
          width: 320px;
          border: 1px solid #e0e0e0;
        }

        .event-form h3 {
          margin-top: 0;
          margin-bottom: 15px;
          color: #5e35b1;
        }

        .form-row {
          margin-bottom: 12px;
        }

        .form-row label {
          display: block;
          margin-bottom: 5px;
          font-weight: 500;
          color: #555;
        }

        .form-row input[type="text"],
        .form-row input[type="date"],
        .form-row input[type="time"],
        .form-row select {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 16px;
        }

        .form-buttons {
          display: flex;
          justify-content: space-between;
          margin-top: 20px;
        }

        .form-buttons button {
          min-width: 120px;
        }

        .save-button {
          background-color: #7e57c2;
        }

        .save-button:hover {
          background-color: #6a3ab2;
        }

        .cancel-button {
          background-color: #9e9e9e;
        }

        .cancel-button:hover {
          background-color: #757575;
        }

        .back-button {
          background-color: #7e57c2;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 5px;
        }   

        .back-button:hover {
            background-color: #6a3ab2;
        }

        .back-button-container {
            margin-bottom: 15px;
            display: flex;
            justify-content: flex-start; /* Ensures container aligns contents to the left */
            width: 100%;
        }
      `}</style>
        </div>
    );
};

export default SmartBalanceScheduler;
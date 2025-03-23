import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import moment from 'moment';
import { 
  CalendarIcon, 
  PieChartIcon, 
  BarChart3Icon, 
  TrendingUpIcon, 
  BellIcon, 
  ArrowRightIcon,
  ArrowLeftIcon,
  HeartPulseIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Helper function to round numbers to 2 decimal places
const roundToTwo = (num: number): number => {
  return Math.round(num * 100) / 100;
};

// Types for our stats component
interface ScheduleAnalytics {
  dailyStats: Array<{
    date: string;
    workHours: number;
    personalHours: number;
    meetingCount: number;
    noZoneConflicts: number;
    notificationsSent: number;
  }>;
  weeklyTotals: {
    workHours: number;
    personalHours: number;
    meetingCount: number;
    noZoneConflicts: number;
    notificationsSent: number;
    workLifeRatio: number;
  };
  monthlyTrends: Array<{
    month: string;
    avgWorkHours: number;
    avgPersonalHours: number;
    avgWorkLifeRatio: number;
  }>;
  focusTimeStats: {
    planned: number;
    achieved: number;
    interrupted: number;
    percentSuccessful: number;
  };
  topNotificationReasons: Array<{
    reason: string;
    count: number;
  }>;
}

// Mock data generator for demo purposes
const generateMockStats = (): ScheduleAnalytics => {
  // Generate daily stats for the past 14 days
  const dailyStats = Array.from({ length: 14 }, (_, i) => {
    const date = moment().subtract(13 - i, 'days');
    const isWeekend = date.day() === 0 || date.day() === 6;
    return {
      date: date.format('YYYY-MM-DD'),
      workHours: roundToTwo(isWeekend ? Math.random() * 2 : 5 + Math.random() * 4),
      personalHours: roundToTwo(isWeekend ? 5 + Math.random() * 5 : 2 + Math.random() * 3),
      meetingCount: isWeekend ? Math.round(Math.random() * 2) : Math.round(Math.random() * 7 + 2),
      noZoneConflicts: Math.random() > 0.7 ? Math.round(Math.random() * 2) : 0,
      notificationsSent: Math.round(Math.random() * 5),
    };
  });

  // Calculate weekly totals
  const thisWeekStats = dailyStats.slice(-7);
  const weeklyTotals = {
    workHours: roundToTwo(thisWeekStats.reduce((sum, day) => sum + day.workHours, 0)),
    personalHours: roundToTwo(thisWeekStats.reduce((sum, day) => sum + day.personalHours, 0)),
    meetingCount: thisWeekStats.reduce((sum, day) => sum + day.meetingCount, 0),
    noZoneConflicts: thisWeekStats.reduce((sum, day) => sum + day.noZoneConflicts, 0),
    notificationsSent: thisWeekStats.reduce((sum, day) => sum + day.notificationsSent, 0),
    workLifeRatio: roundToTwo(thisWeekStats.reduce((sum, day) => sum + day.workHours, 0) / 
      thisWeekStats.reduce((sum, day) => sum + day.personalHours, 0))
  };

  // Generate monthly trends for the past 3 months
  const monthlyTrends = Array.from({ length: 3 }, (_, i) => {
    const month = moment().subtract(2 - i, 'months');
    return {
      month: month.format('MMM YYYY'),
      avgWorkHours: roundToTwo(25 + Math.random() * 20),
      avgPersonalHours: roundToTwo(15 + Math.random() * 15),
      avgWorkLifeRatio: roundToTwo(1 + Math.random()),
    };
  });

  // Focus Time Stats
  const focusTimeStats = {
    planned: roundToTwo(15 + Math.random() * 10),
    achieved: roundToTwo(10 + Math.random() * 12),
    interrupted: roundToTwo(2 + Math.random() * 5),
    percentSuccessful: roundToTwo((10 + Math.random() * 12) / (15 + Math.random() * 10) * 100)
  };

  // Top notification reasons
  const topNotificationReasons = [
    { reason: 'Too many consecutive meetings', count: 7 + Math.round(Math.random() * 5) },
    { reason: 'No-Zone time conflicts', count: 5 + Math.round(Math.random() * 4) },
    { reason: 'Meeting overload (daily limit)', count: 4 + Math.round(Math.random() * 3) },
    { reason: 'Insufficient breaks', count: 3 + Math.round(Math.random() * 3) },
    { reason: 'Late night work detected', count: 2 + Math.round(Math.random() * 2) }
  ];

  return {
    dailyStats,
    weeklyTotals,
    monthlyTrends,
    focusTimeStats,
    topNotificationReasons
  };
};

const ScheduleAnalytics: React.FC = () => {
  const [stats, setStats] = useState<ScheduleAnalytics | null>(null);
  const [timeframe, setTimeframe] = useState<'week' | 'month'>('week');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showFocusTime] = useState<boolean>(true);
  const [showNotifications] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    // In a real app, you would fetch this data from an API
    // that connects to your SmartBalanceScheduler data
    const fetchStats = async () => {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setStats(generateMockStats());
        setIsLoading(false);
      }, 800);
    };

    fetchStats();
  }, []);

  if (isLoading || !stats) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-purple-50 to-white">
        {/* Header - matching WellbeingChatbot */}
        <header className="bg-purple-100 shadow-sm py-4 px-6">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <button onClick={() => navigate('/')} className="flex items-center playfair-display-custom text-purple-700 hover:text-purple-900">
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              <span>Back to Home</span>
            </button>
            <div className="flex items-center">
              <HeartPulseIcon className="h-6 w-6 text-rose-600 mr-2 playfair-display-custom" />
              <h1 className="text-xl font-bold text-purple-800 playfair-display-custom">Schedule Analytics</h1>
            </div>
            <div className="w-24"></div>
          </div>
        </header>

        <div className="w-full flex flex-col items-center justify-center py-24">
          <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-purple-600 text-lg playfair-display-custom">Loading insights...</p>
        </div>
      </div>
    );
  }

  // Calculate chart data based on selected timeframe
  const chartData = timeframe === 'week' 
    ? stats.dailyStats.slice(-7).map(day => ({
        ...day,
        date: moment(day.date).format('ddd')
      }))
    : stats.dailyStats.map(day => ({
        ...day,
        date: moment(day.date).format('MMM DD')
      }));

  // COLORS - refined to create a harmonious palette
  const COLORS = {
    work: '#8b5cf6',       // Vibrant purple (primary)
    personal: '#c4b5fd',   // Soft lilac (secondary)
    conflicts: '#e11d48',  // Rose
    notifications: '#a855f7', // Bright purple (tertiary)
    success: '#16a34a',    // Green
    interrupted: '#f59e0b'  // Amber
  };

  // Format weekly stats
  const weeklyBalanceData = [
    { name: 'Work Hrs', value: stats.weeklyTotals.workHours },
    { name: 'Personal Hrs', value: stats.weeklyTotals.personalHours },
  ];

  // Get percentage of successful focus time
  const focusTimeData = [
    { name: 'Focused', value: stats.focusTimeStats.achieved },
    { name: 'Interrupted', value: stats.focusTimeStats.interrupted }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Header - matching WellbeingChatbot */}
      <header className="bg-purple-100 shadow-sm py-4 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center playfair-display-custom text-purple-600 hover:text-purple-700">
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            <span>Back to Home</span>
          </button>
          <div className="flex items-center">
            <HeartPulseIcon className="h-6 w-6 text-purple-500 mr-2 playfair-display-custom" />
            <h1 className="text-xl font-bold text-purple-700 playfair-display-custom">Schedule Analytics</h1>
          </div>
          <div className="w-24"></div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md border border-purple-200">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm playfair-display-custom">Weekly Work Time</p>
                  <h3 className="text-3xl font-bold text-purple-500 mt-1 playfair-display-custom">{stats.weeklyTotals.workHours.toFixed(2)}h</h3>
                  <p className="text-sm text-gray-500 mt-1 playfair-display-custom">
                    vs. {stats.weeklyTotals.personalHours.toFixed(2)}h personal
                  </p>
                </div>
                <div className="bg-purple-100 p-2 rounded-lg">
                  <CalendarIcon className="h-5 w-5 text-purple-500 playfair-display-custom" />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border border-purple-200">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm playfair-display-custom">Total Meetings</p>
                  <h3 className="text-3xl font-bold text-purple-500 mt-1 playfair-display-custom">{stats.weeklyTotals.meetingCount}</h3>
                  <p className="text-sm text-gray-500 mt-1 playfair-display-custom">
                    Avg. {Math.round(stats.weeklyTotals.meetingCount / 5)} per workday
                  </p>
                </div>
                <div className="bg-purple-100 p-2 rounded-lg">
                  <PieChartIcon className="h-5 w-5 text-purple-500 playfair-display-custom" />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border border-purple-200">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm playfair-display-custom">Work/Life Ratio</p>
                  <h3 className="text-3xl font-bold text-purple-500 mt-1 playfair-display-custom">{stats.weeklyTotals.workLifeRatio.toFixed(2)}</h3>
                  <p className={`text-sm mt-1 playfair-display-custom ${stats.weeklyTotals.workLifeRatio > 2 ? 'text-rose-500' : 'text-emerald-500'}`}>
                    {stats.weeklyTotals.workLifeRatio > 2 ? 'Above target (2.0)' : 'Within target'}
                  </p>
                </div>
                <div className="bg-purple-100 p-2 rounded-lg">
                  <BarChart3Icon className="h-5 w-5 text-purple-500 playfair-display-custom" />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border border-purple-200">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm playfair-display-custom">Boundary Alerts</p>
                  <h3 className="text-3xl font-bold text-rose-600 mt-1 playfair-display-custom">{stats.weeklyTotals.notificationsSent}</h3>
                  <p className="text-sm text-gray-500 mt-1 playfair-display-custom">
                    {stats.weeklyTotals.noZoneConflicts} No-Zone conflicts
                  </p>
                </div>
                <div className="bg-rose-100 p-2 rounded-lg">
                  <BellIcon className="h-5 w-5 text-rose-600 playfair-display-custom" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Time Distribution Chart */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-purple-200 mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                              <h2 className="text-xl font-bold playfair-display-custom text-purple-700">Time Distribution</h2>
              <div className="mt-4 sm:mt-0 bg-purple-50 inline-flex rounded-full p-1">
                <button 
                  className={`px-4 py-2 rounded-full playfair-display-custom text-sm font-medium transition-colors ${
                    timeframe === 'week' ? 'bg-purple-500 text-white' : 'text-gray-600'
                  }`} 
                  onClick={() => setTimeframe('week')}
                >
                  This Week
                </button>
                <button 
                  className={`px-4 py-2 rounded-full playfair-display-custom text-sm font-medium transition-colors ${
                    timeframe === 'month' ? 'bg-purple-500 text-white' : 'text-gray-600'
                  }`} 
                  onClick={() => setTimeframe('month')}
                >
                  This Month
                </button>
              </div>
            </div>
            
            <div className="w-full h-64 md:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" />
                  <YAxis label={{ value: 'Hours', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#666' } }} />
                  <Tooltip 
                    formatter={(value) => {
                      return typeof value === 'number' ? [`${value.toFixed(2)} hours`, ''] : [value, ''];
                    }} 
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', border: 'none' }}
                  />
                  <Legend />
                  <Bar name="Work Hours" dataKey="workHours" stackId="a" fill={COLORS.work} radius={[4, 4, 0, 0]} />
                  <Bar name="Personal Hours" dataKey="personalHours" stackId="a" fill={COLORS.personal} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Secondary Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Work/Life Balance Pie Chart */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-purple-200">
              <h2 className="text-xl font-bold text-purple-700 mb-4 text-center playfair-display-custom">Weekly Balance</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={weeklyBalanceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(2)}%)`}
                    >
                      <Cell fill={COLORS.work} />
                      <Cell fill={COLORS.personal} />
                    </Pie>
                    <Tooltip 
                      formatter={(value) => {
                        return typeof value === 'number' ? [`${value.toFixed(2)} hours`, ''] : [value, ''];
                      }}
                      contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', border: 'none' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <p className="text-center text-gray-600 mt-4 playfair-display-custom">
                Ratio: <span className="font-bold text-purple-500 playfair-display-custom">{stats.weeklyTotals.workLifeRatio.toFixed(2)}</span>
              </p>
            </div>
            
            {/* Focus Time Stats */}
            {showFocusTime && (
              <div className="bg-white p-6 rounded-lg shadow-md border border-purple-200">
                <h2 className="text-xl font-bold text-purple-700 mb-4 text-center playfair-display-custom">Focus Time</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={focusTimeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(2)}%)`}
                      >
                        <Cell fill={COLORS.success} />
                        <Cell fill={COLORS.interrupted} />
                      </Pie>
                      <Tooltip 
                        formatter={(value) => {
                          return typeof value === 'number' ? [`${value.toFixed(2)} hours`, ''] : [value, ''];
                        }}
                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', border: 'none' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-center text-gray-600 mt-4 playfair-display-custom">
                  <span className="font-bold text-green-600 playfair-display-custom">{stats.focusTimeStats.achieved.toFixed(2)}</span> of {stats.focusTimeStats.planned.toFixed(2)} planned hours achieved
                </p>
              </div>
            )}
            
            {/* Notification Reasons */}
            {showNotifications && (
              <div className="bg-white p-6 rounded-lg shadow-md border border-purple-200">
                <h2 className="text-xl font-bold text-purple-700 mb-4 playfair-display-custom">Top Alert Reasons</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={stats.topNotificationReasons.slice(0, 4)}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis type="number" />
                      <YAxis dataKey="reason" type="category" width={150} tick={{ fontSize: 12 }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', border: 'none' }}
                      />
                      <Bar dataKey="count" fill={COLORS.notifications} radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
          
          {/* Monthly Trends */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-purple-200 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-purple-700 playfair-display-custom">Monthly Trends</h2>
              <div className="bg-purple-100 p-2 rounded-lg">
                <TrendingUpIcon className="h-5 w-5 text-purple-500 playfair-display-custom" />
              </div>
            </div>
            <div className="h-64 md:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={stats.monthlyTrends}
                  margin={{ top: 5, right: 30, left: 20, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" orientation="left" stroke={COLORS.work} />
                  <YAxis yAxisId="right" orientation="right" stroke={COLORS.notifications} />
                  <Tooltip 
                    formatter={(value) => {
                      return typeof value === 'number' ? [`${value.toFixed(2)}`, ''] : [value, ''];
                    }}
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', border: 'none' }}
                  />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    name="Avg. Work Hours/Week"
                    dataKey="avgWorkHours"
                    stroke={COLORS.work}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    name="Avg. Personal Hours/Week"
                    dataKey="avgPersonalHours"
                    stroke={COLORS.personal}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    name="Work/Life Ratio"
                    dataKey="avgWorkLifeRatio"
                    stroke={COLORS.notifications}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <div className="bg-white p-6 rounded-lg shadow-md border border-purple-200">
              <h2 className="text-xl font-bold text-purple-700 mb-4 playfair-display-custom">Actions</h2>
              <div className="flex flex-wrap gap-4 items-center justify-center">
                <button className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-full playfair-display-custom text-sm font-medium transition-colors">
                  <span>Export Report</span>
                  <ArrowRightIcon size={16} />
                </button>
                <button 
                  onClick={() => navigate('/scheduler')}
                  className="flex items-center gap-2 border border-purple-400 text-purple-500 px-6 py-3 rounded-full text-sm font-medium hover:bg-purple-50 playfair-display-custom transition-colors"
                >
                  <span>Adjust Preferences</span>
                </button>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border border-purple-200">
              <h2 className="text-xl font-bold text-purple-700 mb-4 playfair-display-custom">Wellbeing Tips</h2>
              <p className="text-gray-700 mb-4 playfair-display-custom">
                Based on your work patterns, consider taking more breaks during your workday. 
                Regular short breaks can improve focus and reduce stress.
              </p>
              <div className="flex justify-center">
                <button 
                  onClick={() => navigate('/wellbeing')}
                  className="flex items-center gap-2 playfair-display-custom bg-purple-100 text-purple-500 px-6 py-3 rounded-full text-sm font-medium hover:bg-purple-200 transition-colors"
                >
                  <span>Chat with Balance Buddy AI</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleAnalytics;
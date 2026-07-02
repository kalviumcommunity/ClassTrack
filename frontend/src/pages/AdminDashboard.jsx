import React, { useEffect, useState, useContext } from 'react';
import { api } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { 
  Users, 
  CheckCircle2, 
  XCircle, 
  Percent, 
  TrendingUp, 
  ArrowRight,
  RefreshCw,
  GraduationCap
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { isDark } = useContext(ThemeContext);

  const fetchStats = async () => {
    try {
      const res = await api.get('/reports/dashboard-stats');
      setStats(res.data);
    } catch (error) {
      console.error('Error fetching dashboard statistics:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchStats();
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 transition-colors duration-300">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <span className="text-sm font-semibold text-slate-500 dark:text-gray-400">Compiling dashboard stats...</span>
        </div>
      </div>
    );
  }

  // Fallback default values
  const totalStudents = stats?.totalStudents ?? 0;
  const presentToday = stats?.presentToday ?? 0;
  const absentToday = stats?.absentToday ?? 0;
  const lateToday = stats?.lateToday ?? 0;
  const overallPercentage = stats?.overallPercentage ?? 100;
  const trends = stats?.trends ?? [];

  return (
    <div className="flex-1 p-6 lg:p-8 overflow-y-auto space-y-8 animate-fade-in-up transition-colors duration-300">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white transition-colors duration-300">Admin Control Center</h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm mt-1 transition-colors duration-300">Real-time attendance intelligence & campus telemetry</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl text-sm font-semibold text-slate-700 dark:text-gray-200 hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors duration-300 shadow-sm active:scale-[0.98] self-start sm:self-auto"
        >
          <RefreshCw className={`h-4 w-4 text-slate-500 dark:text-gray-400 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Syncing...' : 'Refresh Stats'}
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Students Card */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-gray-800 flex items-start justify-between relative overflow-hidden group hover:shadow-md transition-all duration-300">
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wider block transition-colors duration-300">Total Students</span>
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white block transition-colors duration-300">{totalStudents}</span>
            <span className="text-xs font-semibold text-slate-400 dark:text-gray-500 block transition-colors duration-300">Registered accounts</span>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-2xl text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-all duration-300">
            <Users className="h-6 w-6" />
          </div>
        </div>

        {/* Present Today Card */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-gray-800 flex items-start justify-between relative overflow-hidden group hover:shadow-md transition-all duration-300">
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wider block transition-colors duration-300">Present Today</span>
            <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-500 block transition-colors duration-300">{presentToday}</span>
            <span className="text-xs font-semibold text-slate-400 dark:text-gray-500 block transition-colors duration-300">Includes {lateToday} late arrivals</span>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-900/30 p-3 rounded-2xl text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-all duration-300">
            <CheckCircle2 className="h-6 w-6" />
          </div>
        </div>

        {/* Absent Today Card */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-gray-800 flex items-start justify-between relative overflow-hidden group hover:shadow-md transition-all duration-300">
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wider block transition-colors duration-300">Absent Today</span>
            <span className="text-3xl font-extrabold text-red-600 dark:text-red-500 block transition-colors duration-300">{absentToday}</span>
            <span className="text-xs font-semibold text-slate-400 dark:text-gray-500 block transition-colors duration-300">Unexcused leaves today</span>
          </div>
          <div className="bg-red-50 dark:bg-red-900/30 p-3 rounded-2xl text-red-600 dark:text-red-400 group-hover:scale-105 transition-all duration-300">
            <XCircle className="h-6 w-6" />
          </div>
        </div>

        {/* Attendance Percentage Card */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-gray-800 flex items-start justify-between relative overflow-hidden group hover:shadow-md transition-all duration-300">
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wider block transition-colors duration-300">Attendance Rate</span>
            <span className="text-3xl font-extrabold text-blue-600 dark:text-blue-500 block transition-colors duration-300">{overallPercentage}%</span>
            <span className="text-xs font-semibold text-slate-400 dark:text-gray-500 block transition-colors duration-300">Aggregate average</span>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-2xl text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-all duration-300">
            <Percent className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Analytics Trend Chart */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-gray-800 transition-colors duration-300">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-500" />
          <h2 className="text-lg font-bold text-slate-800 dark:text-white transition-colors duration-300">Weekly Attendance Telemetry</h2>
        </div>
        <div className="h-[300px] sm:h-[350px] w-full">
          {trends.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={trends}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#374151' : '#f1f5f9'} />
                <XAxis dataKey="date" tick={{ fill: isDark ? '#9ca3af' : '#64748b', fontSize: 11, fontWeight: 500 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: isDark ? '#9ca3af' : '#64748b', fontSize: 11, fontWeight: 500 }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: isDark ? 'rgba(31, 41, 55, 0.9)' : 'rgba(15, 23, 42, 0.9)', border: isDark ? '1px solid #374151' : 'none', borderRadius: '16px', color: '#fff' }}
                  labelStyle={{ fontWeight: 'bold', marginBottom: '4px', fontSize: '12px', color: '#fff' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 500, pt: '10px', color: isDark ? '#d1d5db' : '#475569' }} />
                <Bar dataKey="Present" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="Late" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="Absent" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400 dark:text-gray-500 text-sm font-semibold transition-colors duration-300">
              No recent attendance data. Mark attendance to view analytics.
            </div>
          )}
        </div>
      </div>

      {/* Action Quick-Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Card: Mark Attendance */}
        <div className="bg-blue-600 dark:bg-blue-800 text-white rounded-3xl p-6 shadow-md shadow-blue-600/10 dark:shadow-blue-900/20 flex flex-col justify-between h-48 relative overflow-hidden group transition-colors duration-300">
          <div className="absolute right-[-10px] bottom-[-20px] text-white/5 group-hover:scale-110 transition-transform">
            <GraduationCap className="h-44 w-44" />
          </div>
          <div className="space-y-2 z-10">
            <h3 className="text-xl font-bold">Mark Daily Attendance</h3>
            <p className="text-blue-100 dark:text-blue-200 text-sm max-w-xs font-medium transition-colors duration-300">Record daily student attendance by department, year, and section with duplicate validation checks.</p>
          </div>
          <Link
            to="/mark-attendance"
            className="flex items-center gap-2 px-4 py-2 bg-white text-blue-700 hover:bg-slate-50 transition-colors rounded-xl text-xs font-bold self-start z-10 shadow-sm"
          >
            Go to marking
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Right Card: Reports */}
        <div className="bg-slate-900 dark:bg-gray-800 text-white rounded-3xl p-6 shadow-md flex flex-col justify-between h-48 relative overflow-hidden group transition-colors duration-300">
          <div className="space-y-2 z-10">
            <h3 className="text-xl font-bold">Generate System Reports</h3>
            <p className="text-slate-400 dark:text-gray-300 text-sm max-w-xs font-medium transition-colors duration-300">Compile class-wise summaries or individual logs, and download print-ready PDF & CSV exports.</p>
          </div>
          <Link
            to="/reports"
            className="flex items-center gap-2 px-4 py-2 bg-white text-slate-800 hover:bg-slate-100 transition-colors rounded-xl text-xs font-bold self-start z-10 shadow-sm"
          >
            Compile Reports
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

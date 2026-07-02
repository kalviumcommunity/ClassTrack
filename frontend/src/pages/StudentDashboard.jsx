import React, { useEffect, useState, useContext } from 'react';
import { api } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Calendar,
  AlertCircle,
  BookOpen
} from 'lucide-react';

const StudentDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isDark } = useContext(ThemeContext);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const res = await api.get('/attendance/student');
        setData(res.data);
      } catch (error) {
        console.error('Error fetching student dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudentData();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 transition-colors duration-300">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <span className="text-sm font-semibold text-slate-500 dark:text-gray-400">Retrieving academic profile...</span>
        </div>
      </div>
    );
  }

  const stats = data?.stats || {
    totalClasses: 0,
    presentCount: 0,
    absentCount: 0,
    lateCount: 0,
    attendancePercentage: 100
  };
  const records = data?.records || [];

  // SVG parameters for radial attendance chart
  const size = 160;
  const strokeWidth = 10;
  const radius = size / 2;
  const normalizedRadius = radius - strokeWidth;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (stats.attendancePercentage / 100) * circumference;

  return (
    <div className="flex-1 p-6 lg:p-8 overflow-y-auto space-y-8 animate-fade-in-up transition-colors duration-300">
      {/* Header Banner */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white transition-colors duration-300">Student Portal</h1>
        <p className="text-slate-500 dark:text-gray-400 text-sm mt-1 transition-colors duration-300">Review your personal attendance metrics and history logs</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Radial Progress gauge */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-gray-800 flex flex-col items-center justify-center text-center transition-colors duration-300">
          <h2 className="text-base font-bold text-slate-800 dark:text-white mb-6 transition-colors duration-300">Overall Attendance Rate</h2>
          
          <div className="relative flex items-center justify-center mb-6">
            <svg height={size} width={size} className="radial-progress">
              {/* Background circle */}
              <circle
                stroke={isDark ? '#374151' : '#f1f5f9'}
                fill="transparent"
                strokeWidth={strokeWidth}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
                className="transition-colors duration-300"
              />
              {/* Progress circle */}
              <circle
                stroke={stats.attendancePercentage >= 75 ? '#10b981' : '#f59e0b'}
                fill="transparent"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference + ' ' + circumference}
                style={{ strokeDashoffset }}
                strokeLinecap="round"
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white transition-colors duration-300">{stats.attendancePercentage}%</span>
              <p className="text-[10px] text-slate-400 dark:text-gray-500 font-bold uppercase tracking-wider mt-0.5 transition-colors duration-300">Attended</p>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-semibold text-slate-700 dark:text-gray-300 transition-colors duration-300">
              {stats.attendancePercentage >= 75 
                ? 'Good Standing (On Track)' 
                : 'Warning: Low attendance (Needs 75%)'}
            </p>
            <p className="text-xs text-slate-400 dark:text-gray-500 font-medium transition-colors duration-300">Keep your percentage above 75% for exam eligibility</p>
          </div>
        </div>

        {/* Right Column: Breakdown Cards */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-gray-800 flex flex-col justify-between transition-colors duration-300">
            <div className="bg-slate-50 dark:bg-gray-800 p-2.5 rounded-xl text-slate-600 dark:text-slate-400 self-start transition-colors duration-300">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 dark:text-gray-500 block mb-1 transition-colors duration-300">Total Held Classes</span>
              <span className="text-2xl font-extrabold text-slate-800 dark:text-white transition-colors duration-300">{stats.totalClasses}</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-gray-800 flex flex-col justify-between transition-colors duration-300">
            <div className="bg-emerald-50 dark:bg-emerald-900/30 p-2.5 rounded-xl text-emerald-600 dark:text-emerald-400 self-start transition-colors duration-300">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 dark:text-gray-500 block mb-1 transition-colors duration-300">Present Days</span>
              <span className="text-2xl font-extrabold text-slate-800 dark:text-white transition-colors duration-300">{stats.presentCount}</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-gray-800 flex flex-col justify-between transition-colors duration-300">
            <div className="bg-rose-50 dark:bg-rose-900/30 p-2.5 rounded-xl text-rose-600 dark:text-rose-400 self-start transition-colors duration-300">
              <XCircle className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 dark:text-gray-500 block mb-1 transition-colors duration-300">Absent Days</span>
              <span className="text-2xl font-extrabold text-red-600 dark:text-red-500 transition-colors duration-300">{stats.absentCount}</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-gray-800 flex flex-col justify-between transition-colors duration-300">
            <div className="bg-amber-50 dark:bg-amber-900/30 p-2.5 rounded-xl text-amber-600 dark:text-amber-400 self-start transition-colors duration-300">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 dark:text-gray-500 block mb-1 transition-colors duration-300">Late Arrivals</span>
              <span className="text-2xl font-extrabold text-amber-600 dark:text-amber-500 transition-colors duration-300">{stats.lateCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* History Log Table */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-slate-100 dark:border-gray-800 overflow-hidden transition-colors duration-300">
        <div className="px-6 py-5 border-b border-slate-100 dark:border-gray-800 flex items-center gap-2 transition-colors duration-300">
          <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-500" />
          <h2 className="text-lg font-bold text-slate-800 dark:text-white transition-colors duration-300">Attendance Log History</h2>
        </div>

        <div className="overflow-x-auto">
          {records.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-gray-800/50 border-b border-slate-100 dark:border-gray-800 transition-colors duration-300">
                  <th className="px-6 py-3 text-xs font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-xs font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-xs font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wider">Marked By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-gray-800 text-sm transition-colors duration-300">
                {records.map((rec) => (
                  <tr key={rec._id} className="hover:bg-slate-50/50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-3.5 font-medium text-slate-700 dark:text-gray-300 transition-colors duration-300">
                      {new Date(rec.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        timeZone: 'UTC'
                      })}
                    </td>
                    <td className="px-6 py-3.5">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold transition-colors duration-300 ${
                        rec.status === 'Present' 
                          ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' 
                          : rec.status === 'Late' 
                            ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' 
                            : 'bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-red-400'
                      }`}>
                        {rec.status}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-slate-500 dark:text-gray-400 font-semibold transition-colors duration-300">
                      {rec.markedBy?.name || 'Academic Administrator'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8 flex flex-col items-center gap-2 text-slate-400 dark:text-gray-500 transition-colors duration-300">
              <AlertCircle className="h-8 w-8 text-slate-300 dark:text-gray-600 transition-colors duration-300" />
              <p className="text-sm font-semibold">No attendance entries recorded yet.</p>
              <p className="text-xs">Once classes are held, your records will populate here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;

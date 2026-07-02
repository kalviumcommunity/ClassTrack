import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { GraduationCap, Lock, Mail, KeyRound } from 'lucide-react';
import Toast from '../components/Toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setToast({ message: 'Please enter both email and password', type: 'error' });
      return;
    }

    setLoading(true);
    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      setToast({ message: `Welcome back, ${res.user.name}!`, type: 'success' });
      // Redirect based on role
      setTimeout(() => {
        if (res.user.role === 'admin') {
          navigate('/admin-dashboard');
        } else {
          navigate('/student-dashboard');
        }
      }, 500);
    } else {
      setToast({ message: res.message, type: 'error' });
    }
  };

  const fillCredentials = (role) => {
    if (role === 'admin') {
      setEmail('admin@classtrack.com');
      setPassword('Admin@123');
    } else {
      setEmail('student@classtrack.com'); // Mock student email if created later
      setPassword('STUDENT101');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12 relative overflow-hidden">
      {/* Background Decorative Blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-academic-200/40 blur-3xl -z-10"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-academic-300/30 blur-3xl -z-10"></div>

      <div className="w-full max-w-md animate-fade-in-up">
        {/* Brand */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-academic-600 p-4 rounded-2xl shadow-xl shadow-academic-600/20 mb-3 flex items-center justify-center">
            <GraduationCap className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">ClassTrack</h2>
          <p className="text-slate-500 text-sm mt-1 font-medium">Student Attendance Management System</p>
        </div>

        {/* Card Panel */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-slate-100 p-8">
          <h3 className="text-xl font-bold text-slate-800 mb-6 text-center">Sign In to Portal</h3>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-academic-500 focus:border-academic-500 transition-all text-sm font-medium"
                  placeholder="Enter email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-academic-500 focus:border-academic-500 transition-all text-sm font-medium"
                  placeholder="Enter password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-2xl shadow-lg text-sm font-bold text-white bg-academic-600 hover:bg-academic-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-academic-500 transition-all disabled:opacity-55 active:scale-[0.98]"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Quick-Fill Helpers */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 justify-center">
              <KeyRound className="h-4.5 w-4.5 text-slate-400" />
              Quick-Fill Demo Credentials
            </span>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => fillCredentials('admin')}
                className="px-3 py-2 bg-academic-50 hover:bg-academic-100 text-academic-700 text-xs font-bold rounded-xl border border-academic-100 transition-colors"
              >
                Admin Credentials
              </button>
              <button
                type="button"
                onClick={() => fillCredentials('student')}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-colors"
              >
                Student Demo
              </button>
            </div>
            <p className="text-[10px] text-slate-400 text-center mt-2 font-medium">
              Note: Register a student in admin panel to test student login
            </p>
            <p className="text-center text-blue-300 text-sm mt-3">
              Don't have an account?{' '}
              <Link to="/signup" className="text-blue-200 font-bold hover:text-white transition-colors">Create one</Link>
            </p>
          </div>
        </div>
      </div>

      {/* Custom Toast Alert */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default Login;

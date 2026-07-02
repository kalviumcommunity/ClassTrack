import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Eye, EyeOff, UserPlus, GraduationCap } from 'lucide-react';
import Toast from '../components/Toast';

const SignUp = () => {
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    rollNumber: '',
    department: '',
    year: '',
    section: '',
    phone: '',
  });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const departments = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT'];
  const years = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
  const sections = ['A', 'B', 'C'];

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setToast({ message: 'Passwords do not match', type: 'error' });
      return;
    }
    if (form.password.length < 6) {
      setToast({ message: 'Password must be at least 6 characters', type: 'error' });
      return;
    }
    setLoading(true);
    try {
      const { confirmPassword, ...payload } = form;
      const result = await signup(payload);
      setToast({ message: 'Account created successfully!', type: 'success' });
      setTimeout(() => navigate(result.user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'), 800);
    } catch (err) {
      setToast({ message: err?.response?.data?.message || 'Signup failed. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-800/20 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-2xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl shadow-lg shadow-blue-600/30 mb-4">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">ClassTrack</h1>
          <p className="text-blue-300 text-sm mt-1">Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl space-y-5">
          {/* Name + Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-blue-200 mb-2">Full Name *</label>
              <input
                type="text" name="name" required value={form.name} onChange={handleChange}
                placeholder="John Doe"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300/60 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-blue-200 mb-2">Email *</label>
              <input
                type="email" name="email" required value={form.email} onChange={handleChange}
                placeholder="john@example.com"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300/60 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
              />
            </div>
          </div>

          {/* Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-blue-200 mb-2">Password *</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'} name="password" required value={form.password} onChange={handleChange}
                  placeholder="Min. 6 characters"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300/60 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm pr-10"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-blue-200 mb-2">Confirm Password *</label>
              <input
                type="password" name="confirmPassword" required value={form.confirmPassword} onChange={handleChange}
                placeholder="Repeat password"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300/60 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
              />
            </div>
          </div>

          {/* Role */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-blue-200 mb-2">Role *</label>
            <div className="flex gap-3">
              {['student', 'admin'].map(r => (
                <button
                  key={r} type="button"
                  onClick={() => setForm({ ...form, role: r })}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold capitalize transition-all ${
                    form.role === r
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                      : 'bg-white/10 text-blue-200 border border-white/20'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Student-specific fields */}
          {form.role === 'student' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-white/10 pt-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-blue-200 mb-2">Roll Number</label>
                <input
                  type="text" name="rollNumber" value={form.rollNumber} onChange={handleChange}
                  placeholder="e.g. CS2024001"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300/60 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-blue-200 mb-2">Department</label>
                <select
                  name="department" value={form.department} onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-800 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                >
                  <option value="">Select Department</option>
                  {departments.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-blue-200 mb-2">Year</label>
                <select
                  name="year" value={form.year} onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-800 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                >
                  <option value="">Select Year</option>
                  {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-blue-200 mb-2">Section</label>
                <select
                  name="section" value={form.section} onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-800 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                >
                  <option value="">Select Section</option>
                  {sections.map(s => <option key={s} value={s}>Section {s}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-blue-200 mb-2">Phone</label>
                <input
                  type="tel" name="phone" value={form.phone} onChange={handleChange}
                  placeholder="e.g. +91 9876543210"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300/60 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                />
              </div>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit" disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold rounded-xl text-sm shadow-lg shadow-blue-600/30 disabled:opacity-60 active:scale-[0.98] transition-all"
          >
            {loading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <><UserPlus className="w-4 h-4" /> Create Account</>
            )}
          </button>

          <p className="text-center text-blue-300 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-200 font-bold hover:text-white transition-colors">Sign in</Link>
          </p>
        </form>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default SignUp;

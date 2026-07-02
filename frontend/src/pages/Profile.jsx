import React, { useState, useContext, useEffect } from 'react';
import { AuthContext, api } from '../context/AuthContext';
import { User, Mail, Phone, Lock, Save, ShieldCheck, BookOpen } from 'lucide-react';
import Toast from '../components/Toast';

const Profile = () => {
  const { user, updateProfile } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('info');
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (user) {
      setForm({ name: user.name || '', email: user.email || '', phone: user.phone || '' });
    }
  }, [user]);

  const handleInfoChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handlePwChange = (e) => setPwForm({ ...pwForm, [e.target.name]: e.target.value });

  const handleUpdateInfo = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await updateProfile(form);
      if (result.success) {
        setToast({ message: 'Profile updated successfully!', type: 'success' });
      } else {
        setToast({ message: result.message || 'Update failed', type: 'error' });
      }
    } catch (err) {
      setToast({ message: 'Update failed', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setToast({ message: 'New passwords do not match', type: 'error' });
      return;
    }
    if (pwForm.newPassword.length < 6) {
      setToast({ message: 'Password must be at least 6 characters', type: 'error' });
      return;
    }
    setLoading(true);
    try {
      const result = await updateProfile({ password: pwForm.newPassword });
      if (result.success) {
        setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setToast({ message: 'Password changed successfully!', type: 'success' });
      } else {
        setToast({ message: result.message || 'Password update failed', type: 'error' });
      }
    } catch (err) {
      setToast({ message: 'Password update failed', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'info', label: 'Personal Info', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
  ];

  const avatarInitials = user?.name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'U';

  return (
    <div className="flex-1 p-6 lg:p-8 overflow-y-auto space-y-8 animate-fade-in-up transition-colors duration-300">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white transition-colors duration-300">Profile Settings</h1>
        <p className="text-slate-500 dark:text-gray-400 text-sm mt-1 transition-colors duration-300">Manage your account information and security settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Avatar Card */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-gray-800 flex flex-col items-center text-center transition-colors duration-300">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/30 mb-4 transition-colors duration-300">
              <span className="text-2xl font-extrabold text-white">{avatarInitials}</span>
            </div>
            <h2 className="text-slate-900 dark:text-white font-extrabold text-lg transition-colors duration-300">{user?.name}</h2>
            <p className="text-slate-500 dark:text-gray-400 text-sm transition-colors duration-300">{user?.email}</p>
            <span className={`mt-3 px-3 py-1 rounded-full text-xs font-bold capitalize transition-colors duration-300 ${
              user?.role === 'admin' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
            }`}>
              {user?.role}
            </span>

            {/* Student details */}
            {user?.role === 'student' && (
              <div className="mt-5 w-full space-y-2 text-left">
                {user?.rollNumber && (
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-slate-400 dark:text-gray-500 transition-colors duration-300" />
                    <span className="text-xs text-slate-600 dark:text-gray-400 font-medium transition-colors duration-300">{user.rollNumber}</span>
                  </div>
                )}
                {user?.department && (
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-slate-400 dark:text-gray-500 transition-colors duration-300" />
                    <span className="text-xs text-slate-600 dark:text-gray-400 font-medium transition-colors duration-300">{user.department} • {user.year} • Sec {user.section}</span>
                  </div>
                )}
                {user?.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 dark:text-gray-500 transition-colors duration-300" />
                    <span className="text-xs text-slate-600 dark:text-gray-400 font-medium transition-colors duration-300">{user.phone}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Main Settings Area */}
        <div className="lg:col-span-3 space-y-5">
          {/* Tabs */}
          <div className="flex gap-2 bg-slate-100 dark:bg-gray-800 rounded-2xl p-1.5 w-fit transition-colors duration-300">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-gray-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-200'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Personal Info Tab */}
          {activeTab === 'info' && (
            <form onSubmit={handleUpdateInfo} className="bg-white dark:bg-gray-900 rounded-3xl p-6 lg:p-8 shadow-sm border border-slate-100 dark:border-gray-800 space-y-5 transition-colors duration-300">
              <h3 className="text-slate-900 dark:text-white font-extrabold text-lg transition-colors duration-300">Personal Information</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-2 transition-colors duration-300">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-gray-500 transition-colors duration-300" />
                    <input
                      type="text" name="name" value={form.name} onChange={handleInfoChange} required
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-colors duration-300"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-2 transition-colors duration-300">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-gray-500 transition-colors duration-300" />
                    <input
                      type="email" name="email" value={form.email} onChange={handleInfoChange} required
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-colors duration-300"
                    />
                  </div>
                </div>
                {user?.role === 'student' && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-2 transition-colors duration-300">Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-gray-500 transition-colors duration-300" />
                      <input
                        type="tel" name="phone" value={form.phone} onChange={handleInfoChange}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-colors duration-300"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Read-only student fields */}
              {user?.role === 'student' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-2 border-t border-slate-100 dark:border-gray-800 transition-colors duration-300">
                  {[
                    { label: 'Roll Number', value: user?.rollNumber },
                    { label: 'Department', value: user?.department },
                    { label: 'Year & Section', value: `${user?.year} • Sec ${user?.section}` },
                  ].map(field => (
                    <div key={field.label}>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-gray-500 mb-2 transition-colors duration-300">{field.label}</label>
                      <div className="px-4 py-3 bg-slate-100 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl text-slate-600 dark:text-gray-300 text-sm font-medium transition-colors duration-300">
                        {field.value || '—'}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button
                type="submit" disabled={loading}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-md shadow-blue-600/10 disabled:opacity-60 active:scale-[0.98] transition-all"
              >
                {loading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <><Save className="w-4 h-4" /> Save Changes</>
                )}
              </button>
            </form>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <form onSubmit={handleUpdatePassword} className="bg-white dark:bg-gray-900 rounded-3xl p-6 lg:p-8 shadow-sm border border-slate-100 dark:border-gray-800 space-y-5 transition-colors duration-300">
              <h3 className="text-slate-900 dark:text-white font-extrabold text-lg transition-colors duration-300">Change Password</h3>
              <p className="text-slate-500 dark:text-gray-400 text-sm transition-colors duration-300">Choose a strong password that you don't use on other sites.</p>

              {[
                { name: 'currentPassword', label: 'Current Password', placeholder: 'Your current password' },
                { name: 'newPassword', label: 'New Password', placeholder: 'Min. 6 characters' },
                { name: 'confirmPassword', label: 'Confirm New Password', placeholder: 'Repeat new password' },
              ].map(field => (
                <div key={field.name}>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-2 transition-colors duration-300">{field.label}</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-gray-500 transition-colors duration-300" />
                    <input
                      type="password" name={field.name} value={pwForm[field.name]} onChange={handlePwChange}
                      placeholder={field.placeholder}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-colors duration-300"
                    />
                  </div>
                </div>
              ))}

              <button
                type="submit" disabled={loading}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-md shadow-blue-600/10 disabled:opacity-60 active:scale-[0.98] transition-all"
              >
                {loading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <><ShieldCheck className="w-4 h-4" /> Update Password</>
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default Profile;

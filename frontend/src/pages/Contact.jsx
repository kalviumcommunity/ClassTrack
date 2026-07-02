import React, { useState } from 'react';
import { api } from '../context/AuthContext';
import { Mail, MessageSquare, Send, CheckCircle, Phone, Tag, GraduationCap } from 'lucide-react';
import Toast from '../components/Toast';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', category: 'General', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [toast, setToast] = useState(null);

  const categories = ['General', 'Technical Support', 'Account Issue', 'Bug Report', 'Feature Request', 'Other'];

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/contact', form);
      setSubmitted(true);
    } catch (err) {
      setToast({ message: err?.response?.data?.message || 'Failed to send message. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="bg-white rounded-3xl p-10 shadow-sm border border-slate-100 max-w-md w-full text-center animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mb-3">Message Sent!</h2>
          <p className="text-slate-500 leading-relaxed mb-6">
            Thank you for reaching out. We've received your message and will get back to you within 24–48 hours. A confirmation email has been sent to <strong>{form.email}</strong>.
          </p>
          <button
            onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', category: 'General', subject: '', message: '' }); }}
            className="px-6 py-2.5 bg-academic-600 hover:bg-academic-700 text-white rounded-xl text-sm font-bold"
          >
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 lg:p-8 overflow-y-auto space-y-8 animate-fade-in-up">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900">Contact Us</h1>
        <p className="text-slate-500 text-sm mt-1">Send us a message and we'll get back to you within 24–48 hours.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Info Cards */}
        <div className="space-y-5">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-6 text-white">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-4">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-bold text-lg mb-1">ClassTrack Support</h3>
            <p className="text-blue-200 text-sm leading-relaxed">
              Our team is here to help with any questions about attendance management, reports, or account access.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Email</p>
              <p className="text-slate-700 font-semibold text-sm">support@classtrack.com</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-start gap-4">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Response Time</p>
              <p className="text-slate-700 font-semibold text-sm">24–48 hours</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-start gap-4">
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center shrink-0">
              <Tag className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Support Categories</p>
              <p className="text-slate-700 font-semibold text-sm">Technical, Account, Billing</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-slate-100 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Full Name *</label>
              <input
                type="text" name="name" required value={form.name} onChange={handleChange}
                placeholder="Your name"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-academic-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Email Address *</label>
              <input
                type="email" name="email" required value={form.email} onChange={handleChange}
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-academic-500 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Phone (optional)</label>
              <input
                type="tel" name="phone" value={form.phone} onChange={handleChange}
                placeholder="+91 9876543210"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-academic-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Category</label>
              <select
                name="category" value={form.category} onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-academic-500 text-sm"
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Subject</label>
            <input
              type="text" name="subject" value={form.subject} onChange={handleChange}
              placeholder="Brief description of your issue"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-academic-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Message *</label>
            <textarea
              name="message" required value={form.message} onChange={handleChange} rows={5}
              placeholder="Describe your issue or question in detail..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-academic-500 text-sm resize-none"
            />
          </div>

          <button
            type="submit" disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-academic-600 hover:bg-academic-700 text-white rounded-xl text-sm font-bold shadow-md shadow-academic-600/10 disabled:opacity-60 active:scale-[0.98] transition-all"
          >
            {loading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <><Send className="w-4 h-4" /> Send Message</>
            )}
          </button>
        </form>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default Contact;

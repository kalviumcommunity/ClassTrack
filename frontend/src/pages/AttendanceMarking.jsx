import React, { useEffect, useState } from 'react';
import { api } from '../context/AuthContext';
import { Calendar, CheckCircle2, XCircle, ChevronRight, RefreshCw, ArrowLeft, ArrowRight, Filter, AlertCircle, Download, Calendar as CalendarIcon } from 'lucide-react';
import Toast from '../components/Toast';

// Utility to format date as YYYY-MM-DD for input value
const formatDate = (date) => {
  const d = new Date(date);
  const month = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
};

const AttendanceMarking = () => {
  const [date, setDate] = useState(formatDate(new Date()));
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState('');
  const [section, setSection] = useState('');
  const [students, setStudents] = useState([]);
  const [statusMap, setStatusMap] = useState({}); // { studentId: 'Present' | 'Absent' | 'Late' }
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [isMarked, setIsMarked] = useState(false);

  const departments = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT'];
  const years = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
  const sections = ['A', 'B', 'C'];

  const resetState = () => {
    setStudents([]);
    setStatusMap({});
    setIsMarked(false);
  };

  const checkAttendance = async () => {
    if (!department || !year || !section) {
      setToast({ message: 'Select Department, Year & Section first', type: 'error' });
      return;
    }
    setChecking(true);
    try {
      const res = await api.get('/attendance/check', {
        params: { date, department, year, section }
      });
      const fetchedStudents = res.data.students;
      const existingRecords = res.data.records;
      const alreadyMarked = res.data.isMarked;

      setStudents(fetchedStudents);
      // Initialize status map
      const map = {};
      fetchedStudents.forEach(s => {
        const rec = existingRecords.find(r => r.studentId === s._id);
        map[s._id] = rec ? rec.status : 'Absent'; // default to Absent if not yet marked
      });
      setStatusMap(map);
      setIsMarked(alreadyMarked);
    } catch (error) {
      console.error('Attendance check error:', error);
      setToast({ message: 'Failed to load student list', type: 'error' });
    } finally {
      setChecking(false);
    }
  };

  const handleStatusChange = (studentId, status) => {
    setStatusMap(prev => ({ ...prev, [studentId]: status }));
  };

  const submitAttendance = async () => {
    setSaving(true);
    const records = Object.entries(statusMap).map(([studentId, status]) => ({ studentId, status }));
    try {
      await api.post('/attendance/mark', { date, records });
      setToast({ message: 'Attendance saved successfully', type: 'success' });
      resetState();
    } catch (error) {
      console.error('Submit attendance error:', error);
      setToast({ message: 'Failed to save attendance', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex-1 p-6 lg:p-8 overflow-y-auto space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900">Mark Attendance</h1>
          <p className="text-slate-500 text-sm mt-1">Select a class and record daily presence</p>
        </div>
        <button
          onClick={() => { resetState(); setDate(formatDate(new Date())); setDepartment(''); setYear(''); setSection(''); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-white text-slate-800 border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm"
        >
          Reset Form
        </button>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-academic-500 text-sm font-medium"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Department</label>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-academic-500 text-sm font-medium"
          >
            <option value="">Select Department</option>
            {departments.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Year</label>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-academic-500 text-sm font-medium"
          >
            <option value="">Select Year</option>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Section</label>
          <select
            value={section}
            onChange={(e) => setSection(e.target.value)}
            className="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-academic-500 text-sm font-medium"
          >
            <option value="">Select Section</option>
            {sections.map(s => <option key={s} value={s}>Section {s}</option>)}
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={checkAttendance}
          disabled={checking}
          className="flex items-center gap-2 px-5 py-2.5 bg-academic-600 hover:bg-academic-700 text-white rounded-xl text-sm font-bold shadow-md shadow-academic-600/10 disabled:opacity-55 active:scale-[0.98]"
        >
          {checking ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <>
              <RefreshCw className="h-4 w-4" />
              Load Class List
            </>
          )}
        </button>
        {students.length > 0 && (
          <button
            onClick={submitAttendance}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-md shadow-emerald-600/10 disabled:opacity-55 active:scale-[0.98]"
          >
            {saving ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Save Attendance
              </>
            )}
          </button>
        )}
      </div>

      {/* Attendance Grid */}
      {students.length > 0 && (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Roll No.</th>
                <th className="px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Student Name</th>
                <th className="px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map(stu => (
                <tr key={stu._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-3 font-medium text-slate-800">{stu.rollNumber}</td>
                  <td className="px-6 py-3 text-slate-700">{stu.name}</td>
                  <td className="px-6 py-3 text-center">
                    <div className="inline-flex gap-2 items-center bg-slate-50 rounded-xl px-3 py-1.5">
                      <label className="inline-flex items-center gap-1.5">
                        <input
                          type="radio"
                          name={`status-${stu._id}`}
                          value="Present"
                          checked={statusMap[stu._id] === 'Present'}
                          onChange={() => handleStatusChange(stu._id, 'Present')}
                          className="form-radio h-4 w-4 text-emerald-600"
                        />
                        <span className="text-sm font-medium text-emerald-600">P</span>
                      </label>
                      <label className="inline-flex items-center gap-1.5">
                        <input
                          type="radio"
                          name={`status-${stu._id}`}
                          value="Late"
                          checked={statusMap[stu._id] === 'Late'}
                          onChange={() => handleStatusChange(stu._id, 'Late')}
                          className="form-radio h-4 w-4 text-amber-600"
                        />
                        <span className="text-sm font-medium text-amber-600">L</span>
                      </label>
                      <label className="inline-flex items-center gap-1.5">
                        <input
                          type="radio"
                          name={`status-${stu._id}`}
                          value="Absent"
                          checked={statusMap[stu._id] === 'Absent'}
                          onChange={() => handleStatusChange(stu._id, 'Absent')}
                          className="form-radio h-4 w-4 text-rose-600"
                        />
                        <span className="text-sm font-medium text-rose-600">A</span>
                      </label>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Duplicate warning */}
      {isMarked && (
        <div className="flex items-center gap-2 bg-amber-50 text-amber-800 p-4 rounded-xl border border-amber-200 mt-4">
          <AlertCircle className="h-5 w-5" />
          <p className="text-sm font-medium">Attendance for this class on the selected date has already been recorded. You may edit existing entries by adjusting the status and clicking ‘Save Attendance’.</p>
        </div>
      )}

      {/* Toast */}
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

export default AttendanceMarking;

import React, { useEffect, useState } from 'react';
import { api } from '../context/AuthContext';
import { Download, Calendar, Filter, RefreshCw, ChevronRight, ArrowRight, AlertCircle, FileText, FileSpreadsheet } from 'lucide-react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import Toast from '../components/Toast';

// Helper to convert array of objects to CSV string
const arrayToCSV = (data) => {
  if (!data || data.length === 0) return '';
  const headers = Object.keys(data[0]);
  const rows = data.map(row => headers.map(h => JSON.stringify(row[h] ?? '')).join(','));
  return [headers.join(','), ...rows].join('\n');
};

const Reports = () => {
  const [filters, setFilters] = useState({
    studentId: '',
    department: '',
    year: '',
    section: '',
    startDate: '',
    endDate: ''
  });
  const [records, setRecords] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const departments = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT'];
  const years = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
  const sections = ['A', 'B', 'C'];

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await api.get('/reports', { params: filters });
      setRecords(res.data.records);
      setStats(res.data.stats);
      if (res.data.records.length === 0) {
        setToast({ message: 'No records match the selected criteria', type: 'error' });
      } else {
        setToast({ message: `Fetched ${res.data.records.length} attendance entries`, type: 'success' });
      }
    } catch (error) {
      console.error('Report fetch error:', error);
      setToast({ message: 'Failed to retrieve report data', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    if (!records.length) {
      setToast({ message: 'No data to export', type: 'error' });
      return;
    }
    const csv = arrayToCSV(records);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `classtrack_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadPDF = () => {
    if (!records.length) {
      setToast({ message: 'No data to export', type: 'error' });
      return;
    }
    const doc = new jsPDF('landscape');
    doc.setFontSize(12);
    doc.text('ClassTrack Attendance Report', 14, 15);
    // Table columns based on record fields
    const columns = [
      { header: 'Student Name', dataKey: 'studentName' },
      { header: 'Roll Number', dataKey: 'rollNumber' },
      { header: 'Department', dataKey: 'department' },
      { header: 'Year', dataKey: 'year' },
      { header: 'Section', dataKey: 'section' },
      { header: 'Date', dataKey: 'date' },
      { header: 'Status', dataKey: 'status' },
      { header: 'Marked By', dataKey: 'markedBy' }
    ];

    // Transform records for autotable
    const rows = records.map(rec => ({
      studentName: rec.studentId?.name ?? 'N/A',
      rollNumber: rec.studentId?.rollNumber ?? 'N/A',
      department: rec.studentId?.department ?? 'N/A',
      year: rec.studentId?.year ?? 'N/A',
      section: rec.studentId?.section ?? 'N/A',
      date: new Date(rec.date).toLocaleDateString('en-US'),
      status: rec.status,
      markedBy: rec.markedBy?.name ?? 'Admin'
    }));

    doc.autoTable({
      head: [columns.map(col => col.header)],
      body: rows.map(row => columns.map(col => row[col.dataKey])),
      startY: 20,
      theme: 'grid',
      headStyles: { fillColor: [30, 58, 138], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [240, 250, 255] },
      margin: { left: 10, right: 10 }
    });

    doc.save(`classtrack_report_${Date.now()}.pdf`);
  };

  const handleInputChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex-1 p-6 lg:p-8 overflow-y-auto space-y-8 animate-fade-in-up transition-colors duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white transition-colors duration-300">Attendance Reports</h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm mt-1 transition-colors duration-300">Generate filtered logs and export in PDF or CSV format.</p>
        </div>
        <button
          onClick={fetchReport}
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-md shadow-blue-600/10 disabled:opacity-55 active:scale-[0.98] transition-all"
        >
          {loading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <>
              <RefreshCw className="h-4 w-4" />
              Generate Report
            </>
          )}
        </button>
      </div>

      {/* Filter Panel */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-gray-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 transition-colors duration-300">
        {/* Student selector (optional) */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-2 transition-colors duration-300">Student (optional)</label>
          <input
            type="text"
            name="studentId"
            placeholder="Enter student ID or name"
            value={filters.studentId}
            onChange={handleInputChange}
            className="block w-full px-4 py-2.5 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-2xl text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium transition-colors"
          />
        </div>
        {/* Department */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-2 transition-colors duration-300">Department</label>
          <select
            name="department"
            value={filters.department}
            onChange={handleInputChange}
            className="block w-full px-4 py-2.5 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-2xl text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium transition-colors"
          >
            <option value="">All Departments</option>
            {departments.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        {/* Year */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-2 transition-colors duration-300">Year</label>
          <select
            name="year"
            value={filters.year}
            onChange={handleInputChange}
            className="block w-full px-4 py-2.5 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-2xl text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium transition-colors"
          >
            <option value="">All Years</option>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        {/* Section */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-2 transition-colors duration-300">Section</label>
          <select
            name="section"
            value={filters.section}
            onChange={handleInputChange}
            className="block w-full px-4 py-2.5 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-2xl text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium transition-colors"
          >
            <option value="">All Sections</option>
            {sections.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        {/* Date Range */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-2 transition-colors duration-300">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleInputChange}
            className="block w-full px-4 py-2.5 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-2xl text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-2 transition-colors duration-300">End Date</label>
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleInputChange}
            className="block w-full px-4 py-2.5 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-2xl text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium transition-colors"
          />
        </div>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-gray-800 flex flex-col items-center transition-colors duration-300">
            <h4 className="text-xs font-bold uppercase text-slate-400 dark:text-gray-500 mb-2 transition-colors duration-300">Total Records</h4>
            <p className="text-3xl font-extrabold text-slate-800 dark:text-white transition-colors duration-300">{stats.totalRecords}</p>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-gray-800 flex flex-col items-center transition-colors duration-300">
            <h4 className="text-xs font-bold uppercase text-slate-400 dark:text-gray-500 mb-2 transition-colors duration-300">Present</h4>
            <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-500 transition-colors duration-300">{stats.presentCount}</p>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-gray-800 flex flex-col items-center transition-colors duration-300">
            <h4 className="text-xs font-bold uppercase text-slate-400 dark:text-gray-500 mb-2 transition-colors duration-300">Absent</h4>
            <p className="text-3xl font-extrabold text-red-600 dark:text-red-500 transition-colors duration-300">{stats.absentCount}</p>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-gray-800 flex flex-col items-center transition-colors duration-300">
            <h4 className="text-xs font-bold uppercase text-slate-400 dark:text-gray-500 mb-2 transition-colors duration-300">Late</h4>
            <p className="text-3xl font-extrabold text-amber-600 dark:text-amber-500 transition-colors duration-300">{stats.lateCount}</p>
          </div>
        </div>
      )}

      {/* Records Table */}
      {records.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-slate-100 dark:border-gray-800 overflow-x-auto mt-6 transition-colors duration-300">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-gray-800/50 border-b border-slate-100 dark:border-gray-800 transition-colors duration-300">
                <th className="px-5 py-3 text-xs font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-5 py-3 text-xs font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wider">Roll No.</th>
                <th className="px-5 py-3 text-xs font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wider">Class</th>
                <th className="px-5 py-3 text-xs font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-5 py-3 text-xs font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-xs font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wider">Marked By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-gray-800 text-sm transition-colors duration-300">
              {records.map((rec) => (
                <tr key={rec._id} className="hover:bg-slate-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-5 py-3 font-medium text-slate-800 dark:text-gray-200 transition-colors duration-300">{rec.studentId?.name ?? 'N/A'}</td>
                  <td className="px-5 py-3 text-slate-700 dark:text-gray-300 transition-colors duration-300">{rec.studentId?.rollNumber ?? 'N/A'}</td>
                  <td className="px-5 py-3 text-slate-600 dark:text-gray-400 transition-colors duration-300">
                    {rec.studentId?.department} • {rec.studentId?.year.split(' ')[0]} • Sec {rec.studentId?.section}
                  </td>
                  <td className="px-5 py-3 text-slate-600 dark:text-gray-400 transition-colors duration-300">{new Date(rec.date).toLocaleDateString('en-US')}</td>
                  <td className={`px-5 py-3 font-semibold transition-colors duration-300 ${rec.status === 'Present' ? 'text-emerald-600 dark:text-emerald-500' : rec.status === 'Late' ? 'text-amber-600 dark:text-amber-500' : 'text-red-600 dark:text-red-500'}`}>
                    {rec.status}
                  </td>
                  <td className="px-5 py-3 text-slate-500 dark:text-gray-400 transition-colors duration-300">{rec.markedBy?.name ?? 'Admin'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Export Buttons */}
      {records.length > 0 && (
        <div className="flex gap-4 mt-6">
          <button
            onClick={downloadCSV}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-md shadow-emerald-600/10"
          >
            <FileText className="h-4 w-4" />
            Export CSV
          </button>
          <button
            onClick={downloadPDF}
            className="flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-bold shadow-md shadow-rose-600/10"
          >
            <FileSpreadsheet className="h-4 w-4" />
            Export PDF
          </button>
        </div>
      )}

      {/* No Records Message */}
      {records.length === 0 && !loading && (
        <div className="flex flex-col items-center gap-2 py-12 text-slate-400 dark:text-gray-500 transition-colors duration-300">
          <AlertCircle className="h-8 w-8" />
          <p className="text-sm font-semibold">No attendance records to display.</p>
          <p className="text-xs">Adjust filters and click "Generate Report".</p>
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

export default Reports;

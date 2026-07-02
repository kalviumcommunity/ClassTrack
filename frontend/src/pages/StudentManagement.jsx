import React, { useEffect, useState } from 'react';
import { api } from '../context/AuthContext';
import { 
  UserPlus, 
  Search, 
  Edit3, 
  Trash2, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ArrowUpDown,
  Filter,
  Check,
  AlertTriangle
} from 'lucide-react';
import Toast from '../components/Toast';

const StudentManagement = () => {
  // State variables
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  
  // Search and Filter states
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState('');
  const [section, setSection] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);
  const [sortBy, setSortBy] = useState('rollNumber');
  const [sortOrder, setSortOrder] = useState('asc');

  // Modal states
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null); // null for Add, student object for Edit
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    rollNumber: '',
    department: 'CSE',
    year: '1st Year',
    section: 'A',
    email: '',
    phone: ''
  });

  const departments = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT'];
  const years = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
  const sections = ['A', 'B', 'C'];

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await api.get('/students', {
        params: {
          search,
          department,
          year,
          section,
          page,
          limit: 8,
          sortBy,
          order: sortOrder
        }
      });
      setStudents(res.data.students);
      setTotalPages(res.data.pages);
      setTotalStudents(res.data.total);
    } catch (error) {
      console.error('Error fetching students:', error);
      setToast({ message: 'Failed to retrieve students roster', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [search, department, year, section, page, sortBy, sortOrder]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openAddModal = () => {
    setCurrentStudent(null);
    setFormData({
      name: '',
      rollNumber: '',
      department: 'CSE',
      year: '1st Year',
      section: 'A',
      email: '',
      phone: ''
    });
    setIsAddEditModalOpen(true);
  };

  const openEditModal = (student) => {
    setCurrentStudent(student);
    setFormData({
      name: student.name,
      rollNumber: student.rollNumber,
      department: student.department,
      year: student.year,
      section: student.section,
      email: student.email,
      phone: student.phone
    });
    setIsAddEditModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validations
    if (!formData.name || !formData.rollNumber || !formData.email || !formData.phone) {
      setToast({ message: 'Please fill in all fields', type: 'error' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setToast({ message: 'Invalid email format', type: 'error' });
      return;
    }

    try {
      if (currentStudent) {
        // Edit student
        const res = await api.put(`/students/${currentStudent._id}`, formData);
        setToast({ message: `Student '${res.data.name}' updated successfully`, type: 'success' });
      } else {
        // Add student
        const res = await api.post('/students', formData);
        setToast({ message: `Student '${res.data.name}' enrolled successfully`, type: 'success' });
      }
      setIsAddEditModalOpen(false);
      fetchStudents();
    } catch (error) {
      console.error('Submit student error:', error);
      const msg = error.response?.data?.message || 'Database error occurred';
      setToast({ message: msg, type: 'error' });
    }
  };

  const openDeleteModal = (id) => {
    setDeleteTargetId(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/students/${deleteTargetId}`);
      setToast({ message: 'Student and related attendance history deleted', type: 'success' });
      setIsDeleteModalOpen(false);
      fetchStudents();
    } catch (error) {
      console.error('Delete student error:', error);
      setToast({ message: 'Failed to delete student records', type: 'error' });
    }
  };

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
    setPage(1);
  };

  return (
    <div className="flex-1 p-6 lg:p-8 overflow-y-auto space-y-6 animate-fade-in-up transition-colors duration-300">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white transition-colors duration-300">Student Directory</h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm mt-1 transition-colors duration-300">Manage enrollments, assign classes, and maintain records</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-sm font-bold shadow-lg shadow-blue-600/10 active:scale-[0.98] transition-all self-start sm:self-auto"
        >
          <UserPlus className="h-5 w-5" />
          Enroll Student
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-gray-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 transition-colors duration-300">
        {/* Search */}
        <div className="relative lg:col-span-2">
          <Search className="absolute inset-y-0 left-0 pl-3.5 h-full w-5 text-slate-400 dark:text-gray-500 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name or roll number..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="block w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-2xl text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-semibold transition-all"
          />
        </div>

        {/* Filter Department */}
        <select
          value={department}
          onChange={(e) => { setDepartment(e.target.value); setPage(1); }}
          className="block w-full px-4 py-3 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-2xl text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-semibold transition-all"
        >
          <option value="">All Departments</option>
          {departments.map(d => <option key={d} value={d}>{d}</option>)}
        </select>

        {/* Filter Year */}
        <select
          value={year}
          onChange={(e) => { setYear(e.target.value); setPage(1); }}
          className="block w-full px-4 py-3 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-2xl text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-semibold transition-all"
        >
          <option value="">All Years</option>
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>

        {/* Filter Section */}
        <select
          value={section}
          onChange={(e) => { setSection(e.target.value); setPage(1); }}
          className="block w-full px-4 py-3 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-2xl text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-semibold transition-all"
        >
          <option value="">All Sections</option>
          {sections.map(s => <option key={s} value={s}>Section {s}</option>)}
        </select>
      </div>

      {/* Main Roster Panel */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-slate-100 dark:border-gray-800 overflow-hidden flex flex-col justify-between min-h-[400px] transition-colors duration-300">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-gray-800/50 border-b border-slate-100 dark:border-gray-800 transition-colors duration-300">
                <th 
                  onClick={() => toggleSort('rollNumber')}
                  className="px-6 py-4 text-xs font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wider cursor-pointer hover:text-slate-700 dark:hover:text-gray-300 transition-colors select-none"
                >
                  <div className="flex items-center gap-1.5">
                    Roll Number
                    <ArrowUpDown className="h-3.5 w-3.5 text-slate-400 dark:text-gray-600" />
                  </div>
                </th>
                <th 
                  onClick={() => toggleSort('name')}
                  className="px-6 py-4 text-xs font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wider cursor-pointer hover:text-slate-700 dark:hover:text-gray-300 transition-colors select-none"
                >
                  <div className="flex items-center gap-1.5">
                    Full Name
                    <ArrowUpDown className="h-3.5 w-3.5 text-slate-400 dark:text-gray-600" />
                  </div>
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wider">Class</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wider">Email Address</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wider">Contact No</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-slate-100 dark:divide-gray-800 text-sm transition-colors duration-300">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-8 w-8 animate-spin rounded-full border-3 border-blue-600 border-t-transparent"></div>
                      <span className="text-xs font-bold text-slate-400 dark:text-gray-500">Loading student roster...</span>
                    </div>
                  </td>
                </tr>
              ) : students.length > 0 ? (
                students.map((student) => (
                  <tr key={student._id} className="hover:bg-slate-50/50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white transition-colors duration-300">{student.rollNumber}</td>
                    <td className="px-6 py-4 font-semibold text-slate-700 dark:text-gray-300 transition-colors duration-300">{student.name}</td>
                    <td className="px-6 py-4 font-medium text-slate-500 dark:text-gray-400 transition-colors duration-300">
                      {student.department} • {student.year.split(' ')[0]} • Sec {student.section}
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-gray-400 font-medium transition-colors duration-300">{student.email}</td>
                    <td className="px-6 py-4 text-slate-500 dark:text-gray-400 font-medium transition-colors duration-300">{student.phone}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditModal(student)}
                          className="p-2 hover:bg-slate-100 dark:hover:bg-gray-700 rounded-xl text-slate-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          title="Edit details"
                        >
                          <Edit3 className="h-4.5 w-4.5" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(student._id)}
                          className="p-2 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-xl text-slate-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                          title="Delete student"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-20 text-center">
                    <div className="flex flex-col items-center gap-1 text-slate-400 dark:text-gray-500 transition-colors duration-300">
                      <p className="text-sm font-bold">No students found</p>
                      <p className="text-xs">Adjust your search keyword or add a new record.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Paginate Row */}
        {students.length > 0 && (
          <div className="px-6 py-4 bg-slate-50/70 dark:bg-gray-800/70 border-t border-slate-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm font-semibold text-slate-500 dark:text-gray-400 transition-colors duration-300">
            <span>Showing {students.length} of {totalStudents} student entries</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="p-2 bg-white dark:bg-gray-800 hover:bg-slate-50 dark:hover:bg-gray-700 rounded-xl border border-slate-200 dark:border-gray-700 transition-colors disabled:opacity-45 shadow-sm active:scale-[0.97]"
              >
                <ChevronLeft className="h-4.5 w-4.5" />
              </button>
              <span className="px-4 py-1.5 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl shadow-sm text-slate-700 dark:text-gray-300 transition-colors duration-300">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="p-2 bg-white dark:bg-gray-800 hover:bg-slate-50 dark:hover:bg-gray-700 rounded-xl border border-slate-200 dark:border-gray-700 transition-colors disabled:opacity-45 shadow-sm active:scale-[0.97]"
              >
                <ChevronRight className="h-4.5 w-4.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Enroll / Edit Modal */}
      {isAddEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-slate-900/60 dark:bg-gray-900/80 backdrop-blur-sm" 
            onClick={() => setIsAddEditModalOpen(false)}
          ></div>
          
          {/* Form Card */}
          <div className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-xl w-full max-w-xl overflow-hidden animate-fade-in-up border border-slate-100 dark:border-gray-800 z-10 transition-colors duration-300">
            <div className="px-6 py-5 border-b border-slate-100 dark:border-gray-800 flex items-center justify-between transition-colors duration-300">
              <h2 className="text-xl font-extrabold text-slate-800 dark:text-white transition-colors duration-300">
                {currentStudent ? 'Edit Student Details' : 'Enroll New Student'}
              </h2>
              <button 
                onClick={() => setIsAddEditModalOpen(false)} 
                className="p-1.5 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-full transition-colors text-slate-400 hover:text-slate-600 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-1.5 transition-colors duration-300">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-2.5 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-semibold transition-all"
                    placeholder="E.g. John Doe"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-1.5 transition-colors duration-300">Roll Number</label>
                  <input
                    type="text"
                    name="rollNumber"
                    value={formData.rollNumber}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-2.5 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-semibold transition-all uppercase disabled:opacity-50"
                    placeholder="E.g. 23CSE01"
                    disabled={!!currentStudent} // Disable rollNumber change to prevent integrity issues
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-1.5 transition-colors duration-300">Department</label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-2.5 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-semibold transition-all"
                  >
                    {departments.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-1.5 transition-colors duration-300">Academic Year</label>
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-2.5 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-semibold transition-all"
                  >
                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-1.5 transition-colors duration-300">Section</label>
                  <select
                    name="section"
                    value={formData.section}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-2.5 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-semibold transition-all"
                  >
                    {sections.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-1.5 transition-colors duration-300">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-2.5 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-semibold transition-all"
                    placeholder="john@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-1.5 transition-colors duration-300">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-2.5 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-semibold transition-all"
                    placeholder="E.g. 9876543210"
                    required
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-gray-800 flex justify-end gap-3 font-bold text-sm transition-colors duration-300">
                <button
                  type="button"
                  onClick={() => setIsAddEditModalOpen(false)}
                  className="px-5 py-2.5 border border-slate-200 dark:border-gray-700 text-slate-600 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-800 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md shadow-blue-600/10 active:scale-[0.98] transition-all"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 dark:bg-gray-900/80 backdrop-blur-sm" onClick={() => setIsDeleteModalOpen(false)}></div>
          <div className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-xl w-full max-w-sm overflow-hidden animate-fade-in-up border border-slate-100 dark:border-gray-800 z-10 p-6 flex flex-col items-center text-center transition-colors duration-300">
            <div className="bg-rose-50 dark:bg-red-900/30 text-rose-600 dark:text-red-500 p-4 rounded-full mb-4 transition-colors duration-300">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-800 dark:text-white mb-2 transition-colors duration-300">Delete Student Account?</h3>
            <p className="text-slate-500 dark:text-gray-400 text-xs font-semibold leading-relaxed mb-6 transition-colors duration-300">
              This action cannot be undone. It will delete the student and delete all cascading daily attendance logs.
            </p>
            <div className="flex gap-3 w-full text-sm font-bold">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 py-3 border border-slate-200 dark:border-gray-700 text-slate-600 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-800 rounded-xl transition-colors"
              >
                No, Keep
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-md shadow-red-600/10 transition-all active:scale-[0.98]"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Alert */}
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

export default StudentManagement;

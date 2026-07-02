import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Pages
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import StudentManagement from './pages/StudentManagement';
import AttendanceMarking from './pages/AttendanceMarking';
import Reports from './pages/Reports';
import Profile from './pages/Profile';
import Contact from './pages/Contact';

// Components
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';

// Layout wrapper that includes Sidebar for authenticated routes
const AppLayout = ({ children }) => (
  <div className="flex h-screen bg-slate-50 dark:bg-gray-950 overflow-hidden transition-colors duration-300">
    <Sidebar />
    <main className="flex-1 overflow-y-auto flex flex-col min-h-screen lg:min-h-0">
      {children}
    </main>
  </div>
);

// Page-view tracker that fires on route changes
const PageTracker = () => {
  const location = useLocation();
  const { trackPageView } = useContext(AuthContext);

  useEffect(() => {
    if (trackPageView) trackPageView(location.pathname + location.search);
  }, [location, trackPageView]);

  return null;
};

// Root redirect based on auth state
const RootRedirect = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50 dark:bg-gray-950 transition-colors duration-300">
        <div className="flex flex-col items-center gap-3">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <span className="text-sm font-semibold text-slate-500 dark:text-gray-400">Loading ClassTrack...</span>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === 'admin' ? '/admin-dashboard' : '/student-dashboard'} replace />;
};

const AppRoutes = () => (
  <>
    <PageTracker />
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />

      {/* Admin Protected Routes */}
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AppLayout><AdminDashboard /></AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/students"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AppLayout><StudentManagement /></AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/mark-attendance"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AppLayout><AttendanceMarking /></AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AppLayout><Reports /></AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Student Protected Routes */}
      <Route
        path="/student-dashboard"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <AppLayout><StudentDashboard /></AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Shared Authenticated Routes */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute allowedRoles={['admin', 'student']}>
            <AppLayout><Profile /></AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/contact"
        element={
          <ProtectedRoute allowedRoles={['admin', 'student']}>
            <AppLayout><Contact /></AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<RootRedirect />} />
    </Routes>
  </>
);

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

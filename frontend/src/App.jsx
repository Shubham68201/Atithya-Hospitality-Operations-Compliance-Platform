import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchMe } from "./features/auth/authSlice";

// Layouts
import PublicLayout  from "./components/common/PublicLayout";
import AdminLayout   from "./components/common/AdminLayout";

// Auth pages
import LoginPage          from "./pages/auth/LoginPage";
import RegisterPage       from "./pages/auth/RegisterPage";
import VerifyOTPPage      from "./pages/auth/VerifyOTPPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage  from "./pages/auth/ResetPasswordPage";

// Public pages
import HomePage     from "./pages/public/HomePage";
import AboutPage    from "./pages/public/AboutPage";
import SolutionsPage from "./pages/public/SolutionsPage";
import CareersPage  from "./pages/public/CareersPage";
import ContactPage  from "./pages/public/ContactPage";

// Admin / Staff pages
import DashboardPage        from "./pages/admin/DashboardPage";
import UsersPage            from "./pages/admin/UsersPage";
import DemoRequestsPage     from "./pages/admin/DemoRequestsPage";
import ContactMessagesPage  from "./pages/admin/ContactMessagesPage";
import JobsAdminPage        from "./pages/admin/JobsAdminPage";
import ApplicationsPage     from "./pages/admin/ApplicationsPage";
import ContentManagerPage   from "./pages/admin/ContentManagerPage";
import PropertiesPage       from "./pages/admin/PropertiesPage";
import CompliancePage       from "./pages/admin/CompliancePage";
import NotificationsPage    from "./pages/admin/NotificationsPage";
import ProfilePage          from "./pages/admin/ProfilePage";
import InternalMessagesPage from "./pages/admin/InternalMessagesPage";
import CustomerPortalPage   from "./pages/admin/CustomerPortalPage";

// Guards
import ProtectedRoute from "./components/common/ProtectedRoute";
import AdminRoute     from "./components/common/AdminRoute";
import PageLoader     from "./components/common/PageLoader";

const STAFF = ["super_admin","admin","operations_manager","compliance_manager","staff"];
const ADMIN  = ["super_admin","admin"];

export default function App() {
  const dispatch = useDispatch();
  const { checked } = useSelector((s) => s.auth);

  useEffect(() => { dispatch(fetchMe()); }, [dispatch]);

  if (!checked) return <PageLoader />;

  return (
    <BrowserRouter>
      <Routes>
        {/* ── Public ── */}
        <Route element={<PublicLayout />}>
          <Route path="/"          element={<HomePage />} />
          <Route path="/about"     element={<AboutPage />} />
          <Route path="/solutions" element={<SolutionsPage />} />
          <Route path="/careers"   element={<CareersPage />} />
          <Route path="/contact"   element={<ContactPage />} />
        </Route>

        {/* ── Auth ── */}
        <Route path="/login"           element={<LoginPage />} />
        <Route path="/register"        element={<RegisterPage />} />
        <Route path="/verify-otp"      element={<VerifyOTPPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password"  element={<ResetPasswordPage />} />

        {/* ── Protected ── */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>

            {/* Dashboard — staff get full dashboard, customers get portal */}
            <Route path="/dashboard" element={<DashboardRedirect />} />

            {/* Customer portal */}
            <Route path="/portal" element={<CustomerPortalPage />} />

            {/* Admin-only */}
            <Route path="/admin/users"         element={<AdminRoute roles={ADMIN}><UsersPage /></AdminRoute>} />
            <Route path="/admin/demo-requests" element={<AdminRoute roles={ADMIN}><DemoRequestsPage /></AdminRoute>} />
            <Route path="/admin/messages"      element={<AdminRoute roles={ADMIN}><ContactMessagesPage /></AdminRoute>} />
            <Route path="/admin/jobs"          element={<AdminRoute roles={ADMIN}><JobsAdminPage /></AdminRoute>} />
            <Route path="/admin/applications"  element={<AdminRoute roles={ADMIN}><ApplicationsPage /></AdminRoute>} />
            <Route path="/admin/content"       element={<AdminRoute roles={ADMIN}><ContentManagerPage /></AdminRoute>} />

            {/* Operations */}
            <Route path="/admin/properties" element={<AdminRoute roles={[...ADMIN,"operations_manager"]}><PropertiesPage /></AdminRoute>} />

            {/* Compliance */}
            <Route path="/admin/compliance" element={<AdminRoute roles={[...ADMIN,"compliance_manager"]}><CompliancePage /></AdminRoute>} />

            {/* Staff messaging */}
            <Route path="/admin/internal-messages" element={<AdminRoute roles={STAFF}><InternalMessagesPage /></AdminRoute>} />

            {/* All authenticated */}
            <Route path="/admin/notifications" element={<NotificationsPage />} />
            <Route path="/admin/profile"       element={<ProfilePage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

// Redirect to correct dashboard based on role
function DashboardRedirect() {
  const { user } = useSelector((s) => s.auth);
  const STAFF = ["super_admin","admin","operations_manager","compliance_manager","staff"];
  if (!user) return <Navigate to="/login" replace />;
  if (STAFF.includes(user.role)) return <DashboardPage />;
  return <Navigate to="/portal" replace />;
}

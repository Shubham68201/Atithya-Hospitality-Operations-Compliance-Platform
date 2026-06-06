// ProtectedRoute.jsx
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { user } = useSelector((s) => s.auth);
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;

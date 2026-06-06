import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ roles, children }) => {
  const { user } = useSelector((s) => s.auth);
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return children;
};

export default AdminRoute;

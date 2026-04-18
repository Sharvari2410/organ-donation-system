import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function ProtectedRoute({ children, roles = [] }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;

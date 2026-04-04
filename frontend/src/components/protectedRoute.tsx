import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAppData } from "../context/AppContext"

const ProtectedRoute = () => {
  const { isAuth, user, loading } = useAppData();
  const location = useLocation();

  if (loading) return <div>Loading...</div>;

  // ❌ Not logged in
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  // ❌ User exists but role not selected
  if (isAuth && user && !user.role) {
    if (location.pathname !== "/select-role") {
      return <Navigate to="/select-role" replace />;
    }
  }

  // ❌ User already has role → block select-role page
  if (isAuth && user && user.role) {
    if (location.pathname === "/select-role") {
      return <Navigate to="/" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
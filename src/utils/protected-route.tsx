import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { selectUser } from "store/userSlice";

export const ProtectedRoutes = () => {
  const user = useSelector(selectUser);
  const location = useLocation();

  return user ? (
    <Outlet />
  ) : (
    <Navigate to="/auth/login" state={{ from: location }} replace />
  );
};

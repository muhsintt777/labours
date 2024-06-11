
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { selectUser } from "../store/userSlice";
// import { selectUser } from "../../features/userSlice";
export const ProtectedRoutes = () => {
  const user = useSelector(selectUser);
  const location = useLocation();

  return user ? (
    <Outlet />
  ) : (
    <Navigate to="/auth/login" state={{ from: location }} replace />
  );
};
import "./App.css";
import { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "configs/firebase";
import { useAppDispatch, useAppSelector } from "store/store";
import { fetchUserInfo, logout, selectUserApiStatus } from "store/userSlice";
import { PrimaryLayout } from "layouts/primary-layout";
import { AuthLayout } from "layouts/auth-layout";
import { ProtectedRoutes } from "utils/protected-route";
import { RegisterPage } from "pages/register/register-page";
import { Home } from "pages/home/home-page";
import { Login } from "pages/login/login-page";

function App() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const userApiStatus = useAppSelector(selectUserApiStatus);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(fetchUserInfo({ uid: user.uid, email: user.email || "" }));
      } else {
        dispatch(logout());
      }
    });
    return () => {
      unsub();
    };
  }, [dispatch]);

  useEffect(() => {
    if (userApiStatus === "failed") {
      dispatch(logout());
      setTimeout(() => {
        navigate("auth/login");
      }, 3 * 1000);
    }
  }, [userApiStatus, dispatch, navigate]);

  return (
    <>
      {userApiStatus === "loading" && (
        <div className="loaderWrap">
          <div className="company">
            <h1>Labor Link Connect</h1>
          </div>
          <div className="loader"></div>
        </div>
      )}

      {(userApiStatus === "successfull" || userApiStatus === "idle") && (
        <Routes>
          <Route path="/" element={<PrimaryLayout />}>
            <Route element={<ProtectedRoutes />}>
              <Route index element={<Home />} />
            </Route>
          </Route>
          <Route path="/auth" element={<AuthLayout />}>
            <Route index path="login" element={<Login />} />
            <Route path="register" element={<RegisterPage />} />
          </Route>
          <Route path="*" element={<p>page not found</p>} />
        </Routes>
      )}

      {userApiStatus === "failed" && (
        <div className="loaderWrap">
          <p>fetch user failed. Redirecting to login...</p>
        </div>
      )}
    </>
  );
}

export default App;

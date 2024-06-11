import { Route, Routes } from "react-router-dom";
import "./App.css";
import { AuthLayout } from "./layouts/auth-layout";
import { PrimaryLayout } from "./layouts/primary-layout";
import { Home } from "./pages/home/home-page";
import { Login } from "./pages/login/login-page";
import { RegisterPage } from "./pages/register/register-page";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/firebaseConfig";
import { fetchUserInfo, logout, selectUserApiStatus } from "./store/userSlice";
import { ProtectedRoutes } from "./utils/protected-route";
import { useAppDispatch, useAppSelector } from "./store/store";

function App() {
  const dispatch = useAppDispatch();
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
            <Route path="login" element={<Login />} />
            <Route path="register" element={<RegisterPage />} />
          </Route>
          <Route path="*" element={<p>page not found</p>} />
        </Routes>
      )}

      {userApiStatus === "failed" && (
        <div className="loaderWrap">
          <p>fetch user failed.</p>
        </div>
      )}
    </>
  );
}

export default App;

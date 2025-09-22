import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import About from "./pages/About";
import Profile from "./pages/Profile";
import FaQ from "./pages/FaQ";
import POS from "./pages/POS";
import AccountInformation from "./pages/AccountInformation";
import Login from "./pages/Login";
// import Register from "./pages/Register";
import Notification from "./pages/Notification";
import { useThemeStore } from "./store/themeStore";
import { ProtectedRoute, PublicRoute } from "./components/ProtectedRoute";

function App() {
  const { isDark } = useThemeStore();

  return (
    <div className={isDark ? "dark" : ""}>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route
              index
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="about"
              element={
                <ProtectedRoute>
                  <About />
                </ProtectedRoute>
              }
            />
            <Route
              path="profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="account-information"
              element={
                <ProtectedRoute>
                  <AccountInformation />
                </ProtectedRoute>
              }
            />
            <Route
              path="faq"
              element={
                <ProtectedRoute>
                  <FaQ />
                </ProtectedRoute>
              }
            />
            <Route
              path="pos"
              element={
                <ProtectedRoute>
                  <POS />
                </ProtectedRoute>
              }
            />
            <Route
              path="login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            {/* <Route
              path="register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            /> */}
            <Route
              path="notification"
              element={
                <ProtectedRoute>
                  <Notification />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;

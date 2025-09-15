import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import About from "./pages/About";
import Profile from "./pages/Profile";
import FaQ from "./pages/FaQ";
import POS from "./pages/POS";
import AccountInformation from "./pages/AccountInformation";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Notification from "./pages/Notification";
import { useThemeStore } from "./store/themeStore";

function App() {
  const { isDark } = useThemeStore();

  return (
    <div className={isDark ? "dark" : ""}>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="profile" element={<Profile />} />
            <Route
              path="account-information"
              element={<AccountInformation />}
            />
            <Route path="faq" element={<FaQ />} />
            <Route path="pos" element={<POS />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="notification" element={<Notification />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;

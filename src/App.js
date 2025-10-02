import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import MainBeforeLogin from "./pages/home/MainBeforeLogin";
import MainAfterLogin from "./pages/home/MainAfterLogin";
import Login from "./pages/user/auth/Login";
import Register from "./pages/user/auth/Register";
import FindId from "./pages/user/auth/FindId";
import FindPw from "./pages/user/auth/FindPw";
import EmailVerification from "./pages/user/auth/EmailVerification";

function App() {
  return (
    <Router>
      <Routes>
        {/* 메인화면 */}
        <Route path="/home/before" element={<MainBeforeLogin />} />
        <Route path="/home/after" element={<MainAfterLogin />} />

        {/* 인증 관련 */}
        <Route path="/user/auth/Login" element={<Login />} />
        <Route path="/user/auth/Register" element={<Register />} />
        <Route path="/user/auth/FindId" element={<FindId />} />
        <Route path="/user/auth/FindPw" element={<FindPw />} />
        <Route path="/user/auth/EmailVerification" element={<EmailVerification />} />

        {/* 기본 루트 → 로그인 전 메인 리다이렉트 */}
        <Route path="*" element={<MainBeforeLogin />} />
      </Routes>
    </Router>
  );
}

export default App;

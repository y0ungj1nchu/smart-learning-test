import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import MainBeforeLogin from "./pages/home/MainBeforeLogin";
import MainAfterLogin from "./pages/home/MainAfterLogin";
import Login from "./pages/user/auth/Login";
import Register from "./pages/user/auth/Register";
import FindId from "./pages/user/auth/FindId";
import FindPw from "./pages/user/auth/FindPw";
import EmailVerification from "./pages/user/auth/EmailVerification";
import CalendarPage from "./pages/user/calendar/CalendarPage";
import ProfileView from "./pages/user/profile/ProfileView";
import NoticeDetail from "./pages/user/profile/tabs/NoticeDetail";
import Community from "./pages/user/community/CommunityPage";

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

        {/* 내 정보 */}
        <Route path="/user/profile/view" element={<ProfileView />} />
        
        {/* 캘린더 페이지 */}
        <Route path="/user/calendar" element={<CalendarPage />} />

        {/* 커뮤니티 페이지 */}
        <Route path="/user/community" element={<Community />} />

        {/* 기본 루트 → 로그인 전 메인 리다이렉트 */}
        <Route path="/user/profile/notice-detail" element={<NoticeDetail />} />
        <Route path="*" element={<MainBeforeLogin />} />
      </Routes>
    </Router>
  );
}

export default App;

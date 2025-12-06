import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

/* AuthContext 훅 */
import { useAuth } from "./context/useAuth";

import MainBeforeLogin from "./pages/home/MainBeforeLogin";
import MainAfterLogin from "./pages/home/MainAfterLogin";

import Login from "./pages/user/auth/Login";
import Register from "./pages/user/auth/Register";
import FindId from "./pages/user/auth/FindId";
import FindPw from "./pages/user/auth/FindPw";
import EmailVerification from "./pages/user/auth/EmailVerification";

import ProfileView from "./pages/user/profile/ProfileView";
import Community from "./pages/user/community/CommunityPage";
import CalendarPage from "./pages/user/calendar/CalendarPage";
import CharacterPage from "./pages/user/character/CharacterPage";
import RankingPage from "./pages/user/ranking/RankingPage";
import StudyPage from "./pages/user/study/StudyPage";

import GamePage from "./pages/user/game/GamePage";
import WordGamePageBasic from "./pages/user/game/WordGamePageBasic";
import WordGamePageCustom from "./pages/user/game/WordGamePageCustom";
import WordQuizPage from "./pages/user/game/WordQuizPage";
import ResultPage from "./pages/user/game/ResultPage";
import AcidRainPage from "./pages/user/game/AcidRainPage";

import MainAdmin from "./pages/admin/MainAdmin";
import AdminProfilePage from "./pages/admin/profile/AdminProfilePage";
import AdminCommunity from "./pages/admin/AdminCommunity";
import AdminCharacter from "./pages/admin/AdminCharacter";
import AdminGame from "./pages/admin/AdminGame";
import AdminRanking from "./pages/admin/AdminRanking";
import AdminSettingsTab from "./pages/admin/profile/AdminSettingsTab";

import { ThemeProvider } from "./context/ThemeContext";

import "./index.css";


/* 🔥 로그인 보호 */
function UserRoute({ element }) {
  const { user, authLoaded } = useAuth();

  if (!authLoaded) return <div>Loading...</div>;
  return user ? element : <Navigate to="/user/auth/Login" replace />;
}

/* 🔥 관리자 보호 */
function AdminRoute({ element }) {
  const { user, role, authLoaded } = useAuth();

  if (!authLoaded) return <div>Loading...</div>;
  return user && role === "ADMIN"
    ? element
    : <Navigate to="/home/before" replace />;
}


/* ================================
   ⭐ App 전체 라우팅 + 테마 모드 적용
   ================================ */
export default function App() {
  const { role } = useAuth();

  /* 🚀 role이 바뀔 때마다 user-mode / admin-mode 적용 */
  useEffect(() => {
    const root = document.documentElement;

    root.classList.remove("user-mode", "admin-mode");

    if (role === "ADMIN") root.classList.add("admin-mode");
    else if (role === "USER") root.classList.add("user-mode");
  }, [role]);

  return (
    <ThemeProvider>
      <Router>
        <Routes>

          {/* 메인 */}
          <Route path="/home/before" element={<MainBeforeLogin />} />
          <Route path="/home/after" element={<UserRoute element={<MainAfterLogin />} />} />

          {/* 관리자 */}
          <Route path="/admin/main" element={<AdminRoute element={<MainAdmin />} />} />
          <Route path="/admin/profile" element={<AdminRoute element={<AdminProfilePage />} />} />
          <Route path="/admin/community" element={<AdminRoute element={<AdminCommunity />} />} />
          <Route path="/admin/character" element={<AdminRoute element={<AdminCharacter />} />} />
          <Route path="/admin/game" element={<AdminRoute element={<AdminGame />} />} />
          <Route path="/admin/ranking" element={<AdminRoute element={<AdminRanking />} />} />
          <Route path="/admin/setting" element={<AdminRoute element={<AdminSettingsTab />} />} />

          {/* 인증 */}
          <Route path="/user/auth/Login" element={<Login />} />
          <Route path="/user/auth/Register" element={<Register />} />
          <Route path="/user/auth/FindId" element={<FindId />} />
          <Route path="/user/auth/FindPw" element={<FindPw />} />
          <Route path="/user/auth/EmailVerification" element={<EmailVerification />} />

          {/* 사용자 */}
          <Route path="/user/profile/view" element={<UserRoute element={<ProfileView />} />} />
          <Route path="/user/calendar" element={<UserRoute element={<CalendarPage />} />} />
          <Route path="/user/community/*" element={<UserRoute element={<Community />} />} />
          <Route path="/user/character" element={<UserRoute element={<CharacterPage />} />} />
          <Route path="/user/ranking" element={<UserRoute element={<RankingPage />} />} />
          <Route path="/user/study" element={<UserRoute element={<StudyPage />} />} />

          {/* 게임 */}
          <Route path="/user/game" element={<UserRoute element={<GamePage />} />} />
          <Route path="/user/game/word" element={<UserRoute element={<WordGamePageBasic />} />} />
          <Route path="/user/game/upload" element={<UserRoute element={<WordGamePageCustom />} />} />
          <Route path="/user/game/quiz" element={<UserRoute element={<WordQuizPage />} />} />
          <Route path="/user/game/result" element={<UserRoute element={<ResultPage />} />} />
          <Route path="/user/game/acid-rain" element={<UserRoute element={<AcidRainPage />} />} />

          {/* 기본 */}
          <Route path="*" element={<Navigate to="/home/before" replace />} />

        </Routes>
      </Router>
    </ThemeProvider>
  );
}

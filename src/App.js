import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

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

// 🔥 관리자 라우트 보호
function AdminRoute({ children }) {
  const role = localStorage.getItem("role");
  return role === "ADMIN" ? children : <Navigate to="/home/before" />;
}

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/home/before" element={<MainBeforeLogin />} />
        <Route path="/home/after" element={<MainAfterLogin />} />

        {/* 관리자 전용 */}
        <Route
          path="/admin/main"
          element={
            <AdminRoute>
              <MainAdmin />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/profile"
          element={
            <AdminRoute>
              <AdminProfilePage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/community"
          element={
            <AdminRoute>
              <AdminCommunity />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/character"
          element={
            <AdminRoute>
              <AdminCharacter />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/game"
          element={
            <AdminRoute>
              <AdminGame />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/ranking"
          element={
            <AdminRoute>
              <AdminRanking />
            </AdminRoute>
          }
        />

        {/* 인증 */}
        <Route path="/user/auth/Login" element={<Login />} />
        <Route path="/user/auth/Register" element={<Register />} />
        <Route path="/user/auth/FindId" element={<FindId />} />
        <Route path="/user/auth/FindPw" element={<FindPw />} />
        <Route path="/user/auth/EmailVerification" element={<EmailVerification />} />

        {/* 사용자 기능 */}
        <Route path="/user/profile/view" element={<ProfileView />} />
        <Route path="/user/calendar" element={<CalendarPage />} />
        <Route path="/user/community/*" element={<Community />} />
        <Route path="/user/character" element={<CharacterPage />} />
        <Route path="/user/game" element={<GamePage />} />
        <Route path="/user/game/word" element={<WordGamePageBasic />} />
        <Route path="/user/game/upload" element={<WordGamePageCustom />} />
        <Route path="/user/game/quiz" element={<WordQuizPage />} />
        <Route path="/user/game/result" element={<ResultPage />} />
        <Route path="/user/game/acid-rain" element={<AcidRainPage />} />
        <Route path="/user/ranking" element={<RankingPage />} />
        <Route path="/user/study" element={<StudyPage />} />

        {/* 기본 */}
        <Route path="*" element={<MainBeforeLogin />} />
      </Routes>
    </Router>
  );
}

export default App;

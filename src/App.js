import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

/* 메인화면 */
import MainBeforeLogin from "./pages/home/MainBeforeLogin";
import MainAfterLogin from "./pages/home/MainAfterLogin";

/* 로그인/회원가입 */
import Login from "./pages/user/auth/Login";
import Register from "./pages/user/auth/Register";
import FindId from "./pages/user/auth/FindId";
import FindPw from "./pages/user/auth/FindPw";
import EmailVerification from "./pages/user/auth/EmailVerification";

/* 사용자 페이지 */
import ProfileView from "./pages/user/profile/ProfileView";
import Community from "./pages/user/community/CommunityPage";
import CalendarPage from "./pages/user/calendar/CalendarPage";
import CharacterPage from "./pages/user/character/CharacterPage";
import RankingPage from "./pages/user/ranking/RankingPage";
import StudyPage from "./pages/user/study/StudyPage";

/* 단어 게임 */
import GamePage from "./pages/user/game/GamePage";
import WordGamePageBasic from "./pages/user/game/WordGamePageBasic";
import WordGamePageCustom from "./pages/user/game/WordGamePageCustom";
import WordQuizPage from "./pages/user/game/WordQuizPage";
import ResultPage from "./pages/user/game/ResultPage";
import AcidRainPage from "./pages/user/game/AcidRainPage";

/* 관리자 페이지 */
import MainAdmin from "./pages/admin/MainAdmin";
import AdminProfilePage from "./pages/admin/profile/AdminProfilePage";
import AdminCommunity from "./pages/admin/AdminCommunity";
import AdminCharacter from "./pages/admin/AdminCharacter";
import AdminGame from "./pages/admin/AdminGame";
import AdminRanking from "./pages/admin/AdminRanking";

function App() {
  const isAdmin = localStorage.getItem("role") === "admin";

  return (
    <Router>
      <Routes>

        {/* 메인 */}
        <Route path="/home/before" element={<MainBeforeLogin />} />
        <Route path="/home/after" element={<MainAfterLogin />} />

        {/* 관리자 */}
        <Route path="/admin/main" element={isAdmin ? <MainAdmin /> : <Navigate to="/home/before" />} />
        <Route path="/admin/profile" element={isAdmin ? <AdminProfilePage /> : <Navigate to="/home/before" />} />
        <Route path="/admin/character" element={isAdmin ? <AdminCharacter /> : <Navigate to="/home/before" />} />
        <Route path="/admin/game" element={isAdmin ? <AdminGame /> : <Navigate to="/home/before" />} />
        <Route path="/admin/ranking" element={isAdmin ? <AdminRanking /> : <Navigate to="/home/before" />} />
        <Route path="/admin/community" element={isAdmin ? <AdminCommunity /> : <Navigate to="/home/before" />} />

        {/* 인증 */}
        <Route path="/user/auth/Login" element={<Login />} />
        <Route path="/user/auth/Register" element={<Register />} />
        <Route path="/user/auth/FindId" element={<FindId />} />
        <Route path="/user/auth/FindPw" element={<FindPw />} />
        <Route path="/user/auth/EmailVerification" element={<EmailVerification />} />

        {/* 프로필 */}
        <Route path="/user/profile/view" element={<ProfileView />} />

        {/* 캘린더 */}
        <Route path="/user/calendar" element={<CalendarPage />} />

        {/* 커뮤니티 (⭐ 내부 라우팅은 CommunityPage에서 처리) */}
        <Route path="/user/community/*" element={<Community />} />

        {/* 캐릭터 */}
        <Route path="/user/character" element={<CharacterPage />} />

        {/* 게임 */}
        <Route path="/user/game" element={<GamePage />} />
        <Route path="/user/game/word" element={<WordGamePageBasic />} />
        <Route path="/user/game/upload" element={<WordGamePageCustom />} />
        <Route path="/user/game/quiz" element={<WordQuizPage />} />
        <Route path="/user/game/result" element={<ResultPage />} />
        <Route path="/user/game/acid-rain" element={<AcidRainPage />} />

        {/* 순위 */}
        <Route path="/user/ranking" element={<RankingPage />} />

        {/* 공부 */}
        <Route path="/user/study" element={<StudyPage />} />

        {/* 기본 라우트 */}
        <Route path="*" element={<MainBeforeLogin />} />

      </Routes>
    </Router>
  );
}

export default App;

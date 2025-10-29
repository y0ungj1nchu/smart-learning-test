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
import NoticeDetail from "./pages/user/community/tabs/NoticeDetail";
import Community from "./pages/user/community/CommunityPage";
import CharacterPage from "./pages/user/character/CharacterPage";
import RankingPage from "./pages/user/ranking/RankingPage";
import StudyPage from "./pages/user/study/StudyPage";
import GamePage from "./pages/user/game/GamePage";
import WordGamePage from "./pages/user/game/WordGamePage";
import WordQuizPage from "./pages/user/game/WordQuizPage";
import ResultPage from "./pages/user/game/ResultPage";
import WordGameUpload from "./pages/user/game/WordGameUpload";

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

        {/* 캐릭터 페이지 */}
        <Route path="/user/character" element={<CharacterPage/>} />

        {/* 단어 게임 페이지 */}
        <Route path="/user/game" element={<GamePage />} />
        <Route path="/user/game/word" element={<WordGamePage />} />
        <Route path="/user/game/upload" element={<WordGameUpload />} />
        <Route path="/user/game/quiz" element={<WordQuizPage />} />
        <Route path="/user/game/result" element={<ResultPage />} />

        {/* 사용자 레벨 순위 페이지 */}
        <Route path="/user/ranking" element={<RankingPage/>} />

        {/* 순공시간 페이지 */}
        <Route path="/user/study" element={<StudyPage/>} />

        {/* 기본 루트 → 로그인 전 메인 리다이렉트 */}
        <Route path="/user/profile/notice-detail" element={<NoticeDetail />} />
        <Route path="*" element={<MainBeforeLogin />} />
      </Routes>
    </Router>
  );
}

export default App;

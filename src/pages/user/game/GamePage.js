import React from "react";
import Header1 from "../../../components/common/Header1";
import Header2 from "../../../components/common/Header2";
import { useNavigate } from "react-router-dom";
import "../../../styles/game/WordGame.css";

export default function GamePage() {
  const navigate = useNavigate();

  return (
    <>
      {/* 헤더 */}
      <Header1 isLoggedIn={true} />
      <Header2 isLoggedIn={true} />

      {/* 전체 페이지 */}
      <div className="wordgame-page">
          <h2 className="wordgame-title">게임 선택</h2>

          {/* 카드 목록 */}
          <div className="wordgame-list">
            <div
              className="wordgame-card"
              onClick={() => navigate("/user/game/word")}
            >
              <h3>기본 제공 단어퀴즈</h3>
              <p>단어퀴즈를 풀어보자!</p>
            </div>
            <div
              className="wordgame-card"
              onClick={() => navigate("/user/game/upload")}
            >
              <h3>업로드 단어퀴즈</h3>
              <p>직접 만드는 퀴즈!</p>
            </div>
          </div>
        </div>
    </>
  );
}

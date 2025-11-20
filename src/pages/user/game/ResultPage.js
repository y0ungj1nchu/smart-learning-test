import React from "react";
import Header1 from "../../../components/common/Header1";
import Header2 from "../../../components/common/Header2";
import { useLocation, useNavigate } from "react-router-dom";
import "../../../styles/game/WordGame.css";

export default function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // WordQuizPage에서 넘어온 값들
  const results = location.state?.results || [];
  const setName = location.state?.setName || "";
  const setId = location.state?.setId;   // ⭐ 산성비 / 다시풀기에 둘 다 필요

  const correctCount = results.filter((r) => r.isCorrect).length;

  // ✅ 다시 풀기 → 같은 세트로 퀴즈 재시작
  const handleRetry = () => {
    if (!setId) {
      alert("단어장 정보가 없습니다.");
      navigate("/user/game/custom");
      return;
    }

    navigate("/user/game/quiz", {
      state: { setId, setName },
    });
  };

  // 산성비 모드 시작
  const handleAcidRain = () => {
    if (!setId) {
      alert("단어장 정보가 없습니다.");
      return;
    }

    navigate("/user/game/acid-rain", {
      state: { setId, setName },
    });
  };

  // 게임 종료 → 게임 메인
  const handleExit = () => {
    navigate("/user/game");
  };

  return (
    <>
      <Header1 isLoggedIn={true} />
      <Header2 isLoggedIn={true} />

      <div className="wordgame-page">
        <div className="wordgame-result">
          <h2>결과 확인</h2>

          <p>
            맞은 개수: {correctCount} / {results.length}
          </p>

          <table className="result-table">
            <thead>
              <tr>
                <th>단어</th>
                <th>정답</th>
                <th>내 답</th>
              </tr>
            </thead>

            <tbody>
              {results.map((r, i) => (
                <tr
                  key={i}
                  className={r.isCorrect ? "correct-row" : "wrong-row"}
                >
                  <td>{r.word}</td>
                  <td>{r.correct}</td>
                  <td>{r.selected}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 버튼 영역 */}
          <div className="wordgame-result-btns">
            <button className="wordgame-nav-btn" onClick={handleRetry}>
              다시 풀기
            </button>

            <button className="wordgame-nav-btn" onClick={handleAcidRain}>
              산성비 모드
            </button>

            <button className="wordgame-nav-btn" onClick={handleExit}>
              게임 종료
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

import React from "react";
import Header1 from "../../../components/common/Header1";
import Header2 from "../../../components/common/Header2";
import { useLocation, useNavigate } from "react-router-dom";
import "../../../styles/game/WordGame.css";

export default function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const results = location.state?.results || [];
  const setName = location.state?.setName || "단어장";
  const setId = location.state?.setId || null;
  const origin = location.state?.origin || "user";
  const wordList = location.state?.wordList || [];

  const correctCount = results.filter((r) => r.isCorrect).length;

  /* ---------------------------------------------------------
     1) 다시 풀기
  --------------------------------------------------------- */
  const handleRetry = () => {
    if (!setId) {
      alert("다시 풀 수 있는 단어장 정보가 없습니다.");
      return;
    }

    navigate("/user/game/quiz", {
      state: { setId, setName, origin },
    });
  };

  /* ---------------------------------------------------------
     2) 목록으로
  --------------------------------------------------------- */
  const handleGoList = () => {
    navigate("/user/game/word");
  };

  /* ---------------------------------------------------------
     3) 산성비 게임 전환
  --------------------------------------------------------- */
  const handleAcidRain = () => {
    if (results.length === 0) {
      alert("산성비 모드로 전환할 단어 데이터가 없습니다.");
      return;
    }

    navigate("/user/game/acid-rain", {
      state: { wordList: results, setName, origin, setId },
    });
  };

  return (
    <>
      <Header1 isLoggedIn={true} />
      <Header2 isLoggedIn={true} />

      <div className="wordgame-page">
        <div className="wordgame-result">
          <h2>{setName} 결과</h2>

          <p>
            맞은 개수: <strong>{correctCount}</strong> / {results.length}
          </p>

          <table className="result-table">
            <thead>
              <tr>
                <th>문제</th>
                <th>정답</th>
                <th>선택한 답</th>
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

          <div className="wordgame-result-btns">
            <button className="wordgame-nav-btn" onClick={handleRetry}>
              다시 풀기
            </button>

            <button className="wordgame-nav-btn" onClick={handleGoList}>
              목록으로
            </button>

            <button className="wordgame-nav-btn" onClick={handleAcidRain}>
              산성비
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

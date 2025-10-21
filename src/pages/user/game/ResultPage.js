import React from "react";
import Header1 from "../../../components/common/Header1";
import Header2 from "../../../components/common/Header2";
import { useLocation, useNavigate } from "react-router-dom";
import reIcon from "../../../assets/re.png";
import noIcon from "../../../assets/no.png";
import "../../../styles/game/WordGame.css";

export default function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const results = location.state?.results || [];

  const correctCount = results.filter((r) => r.isCorrect).length;

  const handleRetry = () => {
    navigate("/user/game/word");
  };

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
          <p>맞은 개수: {correctCount} / {results.length}</p>

          <table className="result-table">
            <thead>
              <tr>
                <th>단어</th>
                <th>정답</th>
                <th>답변</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r, i) => (
                <tr key={i} className={r.isCorrect ? "correct-row" : "wrong-row"}>
                  <td>{r.word}</td>
                  <td>{r.correct}</td>
                  <td>{r.selected}</td>
                </tr>
              ))}
            </tbody>
          </table>

        <div className="wordgame-result-btns">
          <button className="wordgame-nav-btn" onClick={handleRetry}>다시 풀기</button>
          <button className="wordgame-nav-btn" onClick={handleExit}>게임 종료</button>
        </div>
      </div>
      </div>
    </>
  );
}
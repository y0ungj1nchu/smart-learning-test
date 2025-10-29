import React, { useState, useEffect } from "react";
import Header1 from "../../../components/common/Header1";
import Header2 from "../../../components/common/Header2";
import { useNavigate, useLocation } from "react-router-dom";
import "../../../styles/game/WordGame.css";

export default function WordQuizPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const wordList = location.state?.wordList || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [autoNext, setAutoNext] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const current = wordList[currentIndex];
  const selectedAnswer = answers.find((a) => a.word === current.word)?.selected;

  // 보기 선택 시
  const handleSelectOption = (option) => {
    const isCorrect = option === current.correct;
    const updated = [
      ...answers.filter((a) => a.word !== current.word),
      { word: current.word, selected: option, correct: current.correct, isCorrect },
    ];
    setAnswers(updated);


    // 마지막 문제 제외 나머지 자동으로
    if (currentIndex < wordList.length - 1) {
      setAutoNext(true);
    }
  };

  // 자동 이동
  useEffect(() => {
    if (autoNext) {
      const timer = setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        setAutoNext(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [autoNext]);

  // 결과 페이지로 이동
  const handleResultClick = () => {
    if (answers.length < wordList.length) {
      setShowModal(true);
      return;
    }
    navigate("/user/game/result", { state: { results: answers } });
  };

  return (
    <>
      <Header1 isLoggedIn={true} />
      <Header2 isLoggedIn={true} />

      <div className="wordgame-page">
        <div className="wordgame-quiz-container">
          <div className="quiz-status">
            문제 {currentIndex + 1} / {wordList.length}
          </div>

          <h3 className="wordgame-question">{current.word}</h3>

          {/* 보기 버튼 */}
          <div className="wordgame-options">
            {current.options.map((opt) => (
              <button
                key={opt}
                className={`wordgame-option-btn ${
                  selectedAnswer
                    ? opt === current.correct && selectedAnswer === opt
                      ? "correct"
                      : selectedAnswer === opt
                      ? "wrong"
                      : ""
                    : ""
                }`}
                onClick={() => handleSelectOption(opt)}
                disabled={!!selectedAnswer}
              >
                {opt}
              </button>
            ))}
          </div>

          {/* 마지막 문제일 때만 결과 확인 버튼 */}
          {currentIndex === wordList.length - 1 && (
            <div className="wordgame-result-btns">
              <button className="wordgame-nav-btn" onClick={handleResultClick}>
                결과 확인
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 모달창 */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <p>문제를 풀고 결과를 확인하세요!</p>
            <button className="modal-btn" onClick={() => setShowModal(false)}>
              확인
            </button>
          </div>
        </div>
      )}
    </>
  );
}

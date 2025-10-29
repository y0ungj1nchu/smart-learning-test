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

    // 결과확인 빼고 자동 이동
    if (currentIndex < wordList.length - 1) {
      setAutoNext(true);
    }
  };

  // 정답 선택 시 2초 후 자동으로 이동
  useEffect(() => {
    if (autoNext) {
      const timer = setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        setAutoNext(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [autoNext]);
  
  // 이전 문제
  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  // 다음 문제 (수동 이동)
  const handleNext = () => {
    const answered = answers.find((a) => a.word === current.word);
    if (!answered) {
      alert("먼저 정답을 선택해주세요!");
      return;
    }

    if (currentIndex < wordList.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      navigate("/user/game/result", { state: { results: answers } });
    }
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

          {/* 뜻 버튼들 */}
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

          {/* 이전 / 다음 버튼 */}
          <div className="wordgame-nav">
            <button
              className="wordgame-nav-btn"
              onClick={handlePrev}
              disabled={currentIndex === 0}
            >
              ◀ 이전
            </button>

            <button
              className="wordgame-nav-btn"
              onClick={handleNext}
              disabled={!selectedAnswer} // 정답 선택 전 비활성화
            >
              {currentIndex === wordList.length - 1 ? "결과 확인" : "다음 ▶"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

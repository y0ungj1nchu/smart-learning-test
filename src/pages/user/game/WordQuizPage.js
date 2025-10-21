import React, { useState } from "react";
import Header1 from "../../../components/common/Header1";
import Header2 from "../../../components/common/Header2";
import { useNavigate, useLocation } from "react-router-dom";
import "../../../styles/game/WordGame.css";

export default function WordQuizPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const wordList =
      location.state?.wordList || [
        { word: "abandon", correct: "버리다", options: ["버리다", "잡다", "도망가다", "지키다"] },
        { word: "benefit", correct: "이익", options: ["이익", "손실", "계획", "조건"] },
        { word: "consider", correct: "고려하다", options: ["고려하다", "잊다", "결정하다", "돕다"] },
      ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState([]);

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
  };

  // 이전 문제
  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  // 다음 문제 (마지막 문제 시 결과 페이지 이동)
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
                disabled={!!selectedAnswer} // 한 번 선택하면 다시 선택 불가
              >
                {opt}
              </button>
            ))}
          </div>

          <div className="wordgame-nav">
            <button
              className="wordgame-nav-btn"
              onClick={handlePrev}
              disabled={currentIndex === 0}
            >
              ◀ 이전
            </button>
            <button className="wordgame-nav-btn" onClick={handleNext}>
              {currentIndex === wordList.length - 1 ? "결과 확인" : "다음 ▶"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
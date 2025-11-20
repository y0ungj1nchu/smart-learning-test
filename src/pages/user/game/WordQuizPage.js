import React, { useState, useEffect } from "react";
import Header1 from "../../../components/common/Header1";
import Header2 from "../../../components/common/Header2";
import { useNavigate, useLocation } from "react-router-dom";
import "../../../styles/game/WordGame.css";

import { getWordsForSetAPI } from "../../../utils/api";

export default function WordQuizPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const setId = location.state?.setId;
  const setName = location.state?.setName;

  const [wordList, setWordList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [autoNext, setAutoNext] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const current = wordList[currentIndex];
  const selectedAnswer = answers.find((a) => a.word === current?.word)?.selected;

  // ⭐ 배열 셔플 함수 (Fisher–Yates)
  const shuffleArray = (arr) => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  /* ---------------------------------------------------------
     1) 단어장 로딩 (백엔드 API 호출)
  --------------------------------------------------------- */
  useEffect(() => {
    if (!setId) {
      alert("잘못된 접근입니다.");
      navigate("/user/game/custom");
      return;
    }

    const loadWords = async () => {
      try {
        const data = await getWordsForSetAPI(setId); // { setName, wordList }

        // ⭐ 문제 순서 및 보기 순서 랜덤 셔플
        const shuffledQuestions = shuffleArray(data.wordList).map((q) => ({
          ...q,
          options: shuffleArray(q.options),
        }));

        setWordList(shuffledQuestions);
        setCurrentIndex(0);
        setAnswers([]);
        setAutoNext(false);
        setShowModal(false);
      } catch (err) {
        console.error("단어 불러오기 실패:", err);
        alert("단어장을 불러오는 중 오류 발생");
        navigate("/user/game/custom");
      } finally {
        setLoading(false);
      }
    };

    loadWords();
  }, [setId, navigate]);

  /* ---------------------------------------------------------
     2) 보기 선택
  --------------------------------------------------------- */
  const handleSelectOption = (option) => {
    if (!current) return;

    const isCorrect = option === current.correct;

    const updated = [
      ...answers.filter((a) => a.word !== current.word),
      { word: current.word, selected: option, correct: current.correct, isCorrect },
    ];

    setAnswers(updated);

    if (currentIndex < wordList.length - 1) {
      setAutoNext(true);
    }
  };

  /* ---------------------------------------------------------
     3) 자동 다음 문제 이동
  --------------------------------------------------------- */
  useEffect(() => {
    if (autoNext) {
      const timer = setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        setAutoNext(false);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [autoNext]);

  /* ---------------------------------------------------------
     4) 결과 페이지로 이동
  --------------------------------------------------------- */
  const handleResultClick = () => {
    if (answers.length < wordList.length) {
      setShowModal(true);
      return;
    }

    navigate("/user/game/result", {
      state: {
        results: answers,
        setName,
        setId,   // ⭐ ResultPage에서 다시 풀기 / 산성비에 사용
      },
    });
  };

  /* ---------------------------------------------------------
     5) 로딩 중
  --------------------------------------------------------- */
  if (loading || !current) {
    return (
      <>
        <Header1 isLoggedIn={true} />
        <Header2 isLoggedIn={true} />
        <div className="wordgame-page">
          <div className="loading-box">불러오는 중...</div>
        </div>
      </>
    );
  }

  /* ---------------------------------------------------------
     6) UI 렌더링
  --------------------------------------------------------- */
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
                disabled={!!selectedAnswer}
              >
                {opt}
              </button>
            ))}
          </div>

          {currentIndex === wordList.length - 1 && (
            <div className="wordgame-result-btns">
              <button className="wordgame-nav-btn" onClick={handleResultClick}>
                결과 확인
              </button>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <p>문제를 전부 풀어야 합니다!</p>
            <button className="modal-btn" onClick={() => setShowModal(false)}>
              확인
            </button>
          </div>
        </div>
      )}
    </>
  );
}

import React, { useState, useEffect, useRef } from "react";
import Header1 from "../../../components/common/Header1";
import Header2 from "../../../components/common/Header2";
import { useNavigate, useLocation } from "react-router-dom";
import "../../../styles/game/WordGame.css";

import { getWordsForSetAPI, getAdminWordSetQuiz } from "../../../utils/api";

export default function WordQuizPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // 전달받은 값
  const setId = location.state?.setId;
  const setName = location.state?.setName;
  const origin = location.state?.origin; // "admin" 또는 undefined

  const [wordList, setWordList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);

  const [autoNext, setAutoNext] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const loadedRef = useRef(false);
  const autoNextRef = useRef(false);

  const current = wordList[currentIndex];
  const selectedAnswer =
    answers.find((a) => a.word === current?.word)?.selected;

  // 배열 셔플
  const shuffleArray = (arr) => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  /* ---------------------------------------------------------
     1) 단어장 로딩 (관리자 / 사용자 자동 분기)
  --------------------------------------------------------- */
  useEffect(() => {
    if (loadedRef.current) return; // StrictMode 2회 렌더링 방지
    loadedRef.current = true;

    if (!setId) {
      alert("잘못된 접근입니다.");
      navigate("/user/game/word");
      return;
    }

    const loadWords = async () => {
      try {
        let data;

        // (1) 관리자 제공 단어장 사용
        if (origin === "admin") {
          data = await getAdminWordSetQuiz(setId);
        }
        // (2) 사용자 업로드 단어장
        else {
          data = await getWordsForSetAPI(setId);
        }

        // 백엔드에서 오는 구조를 통일하기 위한 정규화
        const normalized = data.wordList.map((w) => ({
          word: w.word ?? w.question ?? "",
          correct: w.correct ?? w.answer ?? "",
          options: w.options ?? [],
        }));

        // 문제 순서 + 보기 순서 셔플
        const shuffled = shuffleArray(normalized).map((q) => ({
          ...q,
          options: shuffleArray(q.options),
        }));

        setWordList(shuffled);
      } catch (err) {
        console.error("단어장 로딩 실패:", err);
        alert("단어장을 불러오는 중 오류 발생했습니다.");
        navigate("/user/game/word");
      } finally {
        setLoading(false);
      }
    };

    loadWords();
  }, [setId, origin, navigate]);

  /* ---------------------------------------------------------
     2) 옵션 선택
  --------------------------------------------------------- */
  const handleSelectOption = (option) => {
    if (!current) return;

    const updated = [
      ...answers.filter((a) => a.word !== current.word),
      {
        word: current.word,
        selected: option,
        correct: current.correct,
        isCorrect: option === current.correct,
      },
    ];

    setAnswers(updated);

    // 자동 다음 문제 준비
    if (currentIndex < wordList.length - 1) {
      setAutoNext(true);
    }
  };

  /* ---------------------------------------------------------
     3) 자동으로 다음 문제로 이동
  --------------------------------------------------------- */
  useEffect(() => {
    if (!autoNext) return;

    if (autoNextRef.current) return;
    autoNextRef.current = true;

    const timer = setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
      setAutoNext(false);
      autoNextRef.current = false;
    }, 1200);

    return () => clearTimeout(timer);
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
        setId,
      },
    });
  };

  /* ---------------------------------------------------------
     5) 로딩 화면
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
     6) UI 렌더링 — 기존 UI와 100% 동일
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

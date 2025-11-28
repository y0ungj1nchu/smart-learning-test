import React, { useState, useEffect, useMemo, useRef } from "react";
import Header1 from "../../../components/common/Header1";
import Header2 from "../../../components/common/Header2";
import { useLocation, useNavigate } from "react-router-dom";
import "../../../styles/game/WordGame.css";

import timerIcon from "../../../assets/alarm.png";
import heartIcon from "../../../assets/favorite.png";
import heartBrokenIcon from "../../../assets/heart_broken.png";

const GAME_WIDTH = 600;
const GAME_HEIGHT = 420;

const SPAWN_INTERVAL = 1400;
const MIN_SPEED = 1.2;
const MAX_SPEED = 2.4;

const LIMIT_SECONDS = 30;
const MAX_MISS = 6;

export default function AcidRainPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  // 🔥 WordQuiz에서 넘어온 wordList 그대로 사용 (중요!)
  const baseList = useMemo(() => state?.wordList || [], [state]);

  /* 시작 안내 모달 */
  const [showStartGuide, setShowStartGuide] = useState(true);

  /* 단어세트 보기 모달 */
  const [showSetModal, setShowSetModal] = useState(false);

  /* 게임 상태 */
  const [seconds, setSeconds] = useState(LIMIT_SECONDS);
  const [miss, setMiss] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [input, setInput] = useState("");
  const [drops, setDrops] = useState([]);
  const [resultText, setResultText] = useState("");

  const spawnTimer = useRef(null);
  const raf = useRef(null);

  /* 게임 시작 */
  const startGame = () => {
    setShowStartGuide(false);
    setPlaying(true);
  };

  /* 재시작 */
  const restartGame = () => {
    setSeconds(LIMIT_SECONDS);
    setMiss(0);
    setDrops([]);
    setInput("");
    setResultText("");
    setPlaying(true);
  };

  /* 타이머 */
  useEffect(() => {
    if (!playing || showStartGuide) return;

    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setPlaying(false);

          if (miss < MAX_MISS) setResultText("GAME CLEAR");
          else setResultText("GAME OUT");

          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [playing, miss, showStartGuide]);

  /* 단어 생성 */
  useEffect(() => {
    if (!playing || showStartGuide) return;

    spawnTimer.current = setInterval(() => {
      setDrops((prev) => {
        if (prev.length > 0) return prev;
        if (baseList.length === 0) return prev;

        const rand = baseList[Math.floor(Math.random() * baseList.length)];
        const x = Math.random() * (GAME_WIDTH - 80);
        const speed = MIN_SPEED + Math.random() * (MAX_SPEED - MIN_SPEED);

        return [
          {
            id: Math.random().toString(36).slice(2),
            word: rand.word,
            correct: rand.correct,
            x,
            y: -30,
            speed,
          },
        ];
      });
    }, SPAWN_INTERVAL);

    return () => clearInterval(spawnTimer.current);
  }, [playing, baseList, showStartGuide]);

  /* 단어 낙하 */
  useEffect(() => {
    if (!playing || showStartGuide) return;

    const tick = () => {
      setDrops((prev) => {
        if (prev.length === 0) return prev;

        const d = prev[0];
        const newY = d.y + d.speed;

        if (newY > GAME_HEIGHT - 30) {
          setMiss((m) => {
            const newMiss = m + 1 >= MAX_MISS ? MAX_MISS : m + 1;
            if (newMiss >= MAX_MISS) {
              setPlaying(false);
              setResultText("GAME OUT");
            }
            return newMiss;
          });

          return [];
        }

        return [{ ...d, y: newY }];
      });

      raf.current = requestAnimationFrame(tick);
    };

    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [playing, showStartGuide]);

  /* 정답 제출 */
  const onSubmit = (e) => {
    e.preventDefault();
    const answer = input.trim();
    if (!answer) return;

    setDrops((prev) => {
      if (prev.length === 0) return prev;
      if (prev[0].correct === answer) return [];
      return prev;
    });

    setInput("");
  };

  return (
    <>
      <Header1 isLoggedIn={true} />
      <Header2 isLoggedIn={true} />

      <div className="wordgame-page">

        {/* 시작 안내 모달 — UI 100% 동일 */}
        {showStartGuide && (
          <div className="game-out-wrapper">
            <div className="game-out-text" style={{ color: "#333", fontSize: "18px" }}>
              기회는 총 3번!<br />
              떨어지는 단어의 짝을 입력하여<br />
              30초를 버티시오!<br />
              <button className="wordgame-nav-btn" onClick={startGame} style={{ marginTop: "15px" }}>
                게임 시작
              </button>
            </div>
          </div>
        )}

        <div className="acid-container" style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}>

          {/* HUD (UI 동일) */}
          <div className="acid-hud">
            <span>
              <img src={timerIcon} className="hud-icon" alt="timer" /> {seconds}s
            </span>
            <span>
              <img src={heartIcon} className="hud-icon" alt="heart" /> {Math.max(0, MAX_MISS - miss)}
            </span>
            <span>
              <img src={heartBrokenIcon} className="hud-icon" alt="broken" /> {miss}
            </span>
          </div>

          {/* 낙하 단어 */}
          {drops.map((d) => (
            <div key={d.id} className="acid-drop" style={{ transform: `translate(${d.x}px, ${d.y}px)` }}>
              {d.word}
            </div>
          ))}

          {/* 결과 */}
          {resultText && (
            <div className="game-out-wrapper">
              <div className="game-out-text">{resultText}</div>
            </div>
          )}
        </div>

        {/* 입력창 */}
        {!showStartGuide && (
          <form className="acid-input-row" onSubmit={onSubmit}>
            <input
              className="acid-input"
              placeholder="뜻을 입력하고 Enter"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={!playing}
            />
            <button className="wordgame-nav-btn" disabled={!playing}>
              확인
            </button>
          </form>
        )}

        {/* 버튼들 — UI 완전 동일 */}
        {!showStartGuide && (
          <div className="wordgame-result-btns">
            <button className="wordgame-nav-btn" onClick={restartGame}>
              재시작하기
            </button>

            {playing && resultText === "" && (
              <button className="wordgame-nav-btn" onClick={() => setPlaying(false)}>
                일시정지
              </button>
            )}

            {!playing && resultText === "" && (
              <button className="wordgame-nav-btn" onClick={() => setPlaying(true)}>
                다시 진행
              </button>
            )}

            {!playing && resultText === "" && (
              <button className="wordgame-nav-btn" onClick={() => setShowSetModal(true)}>
                단어세트 보기
              </button>
            )}

            <button className="wordgame-nav-btn" onClick={() => navigate("/user/game")}>
              나가기
            </button>
          </div>
        )}

        {/* 단어세트 보기 모달 — UI 동일 */}
        {showSetModal && (
          <div className="modal-overlay">
            <div className="modal-box" style={{ maxHeight: "450px", overflowY: "auto" }}>
              <h2>단어</h2>
              <ul style={{ marginTop: "20px", textAlign: "left", lineHeight: "1.7" }}>
                {baseList.map((w, i) => (
                  <li key={i}>
                    <strong>{w.word}</strong> : {w.correct}
                  </li>
                ))}
              </ul>
              <button className="modal-btn" onClick={() => setShowSetModal(false)}>
                닫기
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

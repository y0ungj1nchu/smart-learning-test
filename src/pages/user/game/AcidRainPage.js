// src/pages/user/game/AcidRainPage.js
import React, { useEffect, useRef, useState } from "react";
import Header1 from "../../../components/common/Header1";
import Header2 from "../../../components/common/Header2";
import { useLocation, useNavigate } from "react-router-dom";
import "../../../styles/game/WordGame.css";

import { getWordsForSetAPI } from "../../../utils/api";

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

  const setId = state?.setId;
  const setName = state?.setName;

  const [baseList, setBaseList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [seconds, setSeconds] = useState(LIMIT_SECONDS);
  const [miss, setMiss] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [input, setInput] = useState("");

  const [drops, setDrops] = useState([]);

  const [resultText, setResultText] = useState("");

  const spawnTimer = useRef(null);
  const raf = useRef(null);

  // ⭐ miss 중복 방지용 flag
  const missedRef = useRef(false);

  /* -------------------------------------------------------
     1) 단어장 로드(API)
  ------------------------------------------------------- */
  useEffect(() => {
    if (!setId) {
      alert("잘못된 접근입니다.");
      navigate("/user/game/custom");
      return;
    }

    const loadWords = async () => {
      try {
        const data = await getWordsForSetAPI(setId);

        setBaseList(
          data.wordList.map((w) => ({
            word: w.word,
            correct: w.correct,
          }))
        );
      } catch (err) {
        console.error("Error loading words:", err);
        alert("단어 로딩 실패");
        navigate("/user/game/custom");
      } finally {
        setLoading(false);
      }
    };

    loadWords();
  }, [setId, navigate]);

  /* -------------------------------------------------------
     2) 타이머
  ------------------------------------------------------- */
  useEffect(() => {
    if (!playing) return;

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
  }, [playing, miss]);

  /* -------------------------------------------------------
     3) 단어 스폰
  ------------------------------------------------------- */
  useEffect(() => {
    if (!playing || baseList.length === 0) return;

    spawnTimer.current = setInterval(() => {
      // 새 단어 등장 → miss 중복 방지 초기화
      missedRef.current = false;

      setDrops((prev) => {
        if (prev.length > 0) return prev;

        const index = Math.floor(Math.random() * baseList.length);
        const rand = baseList[index];

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
  }, [playing, baseList]);

  /* -------------------------------------------------------
     4) 낙하 + MISS 처리
  ------------------------------------------------------- */
  useEffect(() => {
    if (!playing) return;

    const tick = () => {
      setDrops((prev) => {
        if (prev.length === 0) return prev;

        const d = prev[0];
        const newY = d.y + d.speed;

        // 바닥 도달
        if (newY > GAME_HEIGHT - 30) {
          if (!missedRef.current) {
            missedRef.current = true; // ⭐ 즉시 막음 (핵심)

            setMiss((prev) => {
              const nm = Math.min(prev + 1, MAX_MISS);
              if (nm >= MAX_MISS) {
                setPlaying(false);
                setResultText("GAME OUT");
              }
              return nm;
            });
          }

          return []; // 단어 제거
        }

        return [{ ...d, y: newY }];
      });

      raf.current = requestAnimationFrame(tick);
    };

    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [playing]);

  /* -------------------------------------------------------
     5) 정답 입력 처리
  ------------------------------------------------------- */
  const onSubmit = (e) => {
    e.preventDefault();
    const answer = input.trim();
    if (!answer) return;

    setDrops((prev) => {
      if (prev.length === 0) return prev;

      // 맞춘 경우 → drop 제거
      if (prev[0].correct === answer) {
        return [];
      }

      return prev;
    });

    setInput("");
  };

  /* -------------------------------------------------------
     6) 로딩 화면
  ------------------------------------------------------- */
  if (loading) {
    return (
      <>
        <Header1 isLoggedIn={true} />
        <Header2 isLoggedIn={true} />
        <div className="wordgame-page">
          <div className="loading-box">단어 불러오는 중...</div>
        </div>
      </>
    );
  }

  /* -------------------------------------------------------
     7) UI 렌더링
  ------------------------------------------------------- */
  return (
    <>
      <Header1 isLoggedIn={true} />
      <Header2 isLoggedIn={true} />

      <div className="wordgame-page">
        <div className="acid-container" style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}>

          {/* HUD */}
          <div className="acid-hud">
            <span>
              <img src={timerIcon} className="hud-icon" alt="timer" /> {seconds}s
            </span>
            <span>
              <img src={heartIcon} className="hud-icon" alt="heart" /> {MAX_MISS - miss}
            </span>
            <span>
              <img src={heartBrokenIcon} className="hud-icon" alt="broken" /> {miss}
            </span>
          </div>

          {/* 단어 */}
          {drops.map((d) => (
            <div
              key={d.id}
              className="acid-drop"
              style={{ transform: `translate(${d.x}px, ${d.y}px)` }}
            >
              {d.word}
            </div>
          ))}

          {/* 결과 표시 */}
          {resultText && (
            <div className="game-out-wrapper">
              <div className="game-out-text">{resultText}</div>
            </div>
          )}
        </div>

        {/* 입력 */}
        <form className="acid-input-row" onSubmit={onSubmit}>
          <input
            className="acid-input"
            placeholder="뜻을 입력하고 Enter"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={!playing}
          />
          <button className="wordgame-nav-btn" disabled={!playing}>확인</button>
        </form>

        {/* 버튼 */}
        <div className="wordgame-result-btns">
          <button
            className="wordgame-nav-btn"
            onClick={() => {
              setSeconds(LIMIT_SECONDS);
              setMiss(0);
              setDrops([]);
              setInput("");
              setResultText("");
              setPlaying(true);
              missedRef.current = false;
            }}
          >
            재시작하기
          </button>

          <button className="wordgame-nav-btn" onClick={() => navigate("/user/game")}>
            나가기
          </button>
        </div>
      </div>
    </>
  );
}

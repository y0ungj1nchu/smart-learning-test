import React, { useState, useEffect, useRef } from "react";
import Header1 from "../../../components/common/Header1";
import Header2 from "../../../components/common/Header2";
import "../../../styles/study/StudyPage.css";

function StudyPage() {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [todayStudy, setTodayStudy] = useState(0);
  const [weekStudy, setWeekStudy] = useState(0);
  const timerRef = useRef(null);

  // 
  const getTodayKey = () => new Date().toISOString().split("T")[0];
  const getWeekKey = () => {
    const now = new Date();
    const monday = new Date(now.setDate(now.getDate() - now.getDay() + 1));
    return monday.toISOString().split("T")[0];
  };

  // 
  useEffect(() => {
    const weekKey = getWeekKey();
    const todayKey = getTodayKey();

    const storedWeek = JSON.parse(localStorage.getItem("weekStudy") || "{}");
    const storedToday = JSON.parse(localStorage.getItem("todayStudy") || "{}");

    if (storedWeek.date !== weekKey) {
      localStorage.setItem("weekStudy", JSON.stringify({ date: weekKey, time: 0 }));
      setWeekStudy(0);
    } else setWeekStudy(storedWeek.time || 0);

    if (storedToday.date !== todayKey) {
      localStorage.setItem("todayStudy", JSON.stringify({ date: todayKey, time: 0 }));
      setTodayStudy(0);
    } else setTodayStudy(storedToday.time || 0);

    
  }, []);

  // 
  useEffect(() => {
    if (running) {
      timerRef.current = setInterval(() => setTime((t) => t + 10), 10);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [running]);

  //
  useEffect(() => {
    if (!running || time === 0) return;

    const todayKey = getTodayKey();
    const weekKey = getWeekKey();

    if (time % 1000 === 0) {
      setWeekStudy((prev) => {
        const updated = prev + 1;
        localStorage.setItem("weekStudy", JSON.stringify({ date: weekKey, time: updated }));
        return updated;
      });
      setTodayStudy((prev) => {
        const updated = prev + 1;
        localStorage.setItem("todayStudy", JSON.stringify({ date: todayKey, time: updated }));
        return updated;
      });
    }
  }, [time, running]);

  //
  const formatTime = (seconds) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const formatTimer = (t) => {
    const ms = String(Math.floor((t / 10) % 100)).padStart(2, "0");
    const s = String(Math.floor((t / 1000) % 60)).padStart(2, "0");
    const m = String(Math.floor((t / 60000) % 60)).padStart(2, "0");
    const h = String(Math.floor((t / 3600000) % 60)).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  //
  const colors = ["#FFD400", "#4DA3FF", "#6DD56C", "#FF6B81", "#B26EFF"];
  const colorCount = colors.length;
  const fullCycle = 3600000; // 1시간 (ms)
  const currentHour = Math.floor(time / fullCycle);
  const nextColorIndex = (currentHour + 1) % colorCount;
  const currentColorIndex = currentHour % colorCount;
  const progressRatio = (time % fullCycle) / fullCycle;
  const progress = progressRatio * 360;

  //
  const hexToRgb = (hex) => {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return [r, g, b];
  };

  const [r1, g1, b1] = hexToRgb(colors[currentColorIndex]);
  const [r2, g2, b2] = hexToRgb(colors[nextColorIndex]);
  const blendedColor = `rgb(${Math.round(r1 + (r2 - r1) * progressRatio)}, 
                             ${Math.round(g1 + (g2 - g1) * progressRatio)}, 
                             ${Math.round(b1 + (b2 - b1) * progressRatio)})`;

  return (
    <>
      <Header1 isLoggedIn={true} />
      <Header2 isLoggedIn={true} />

      <div className="study-container">
        <div className="timer-box">
          <div
            className="timer-circle"
            style={{
              background: `conic-gradient(${blendedColor} ${progress}deg, #fff 0deg)`,
            }}
          >
            <div className="timer-inner">
              <div className="timer-text">{formatTimer(time)}</div>
            </div>
          </div>

          <div className="timer-btns">
            <button className="timer-btn" onClick={() => setRunning(!running)}>
              {running ? "STOP" : "START"}
            </button>
          </div>
        </div>

        <div className="record-box">
          <div className="record-title">공부 기록</div>
          <div className="record-item">
            <span>이번 주 공부 시간</span>
            <span>{formatTime(weekStudy)}</span>
          </div>
          <div className="record-item">
            <span>오늘의 공부 시간</span>
            <span>{formatTime(todayStudy)}</span>
          </div>
        </div>
      </div>
    </>
  );
}

export default StudyPage;

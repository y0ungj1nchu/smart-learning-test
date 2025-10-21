import React, { useState, useEffect, useRef } from "react";
import Header1 from "../../../components/common/Header1";
import Header2 from "../../../components/common/Header2";
import "../../../styles/study/StudyPage.css";

function StudyPage() {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  const timerRef = useRef(null);

  useEffect(() => {
    if (running) {
      timerRef.current = setInterval(() => setTime((t) => t + 10), 10);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [running]);

  const formatTime = (t) => {
    const ms = String(Math.floor((t / 10) % 100)).padStart(2, "0");
    const s = String(Math.floor((t / 1000) % 60)).padStart(2, "0");
    const m = String(Math.floor((t / 60000) % 60)).padStart(2, "0");
    return `${m}:${s}:${ms}`;
  };

  const handleLap = () => {
    setLaps([...laps, time]);
  };

  const handleReset = () => {
    setRunning(false);
    setTime(0);
    setLaps([]);
  };

  return (
    <>
      <Header1 isLoggedIn={true} />
      <Header2 isLoggedIn={true} />

      <div className="study-container">
        {/* 타이머 */}
        <div className="timer-box">
          <div className="timer-circle">
            <div className="timer-inner">
              <div className="timer-text">{formatTime(time)}</div>
            </div>
          </div>
          <div className="timer-btns">
            <button
              className="timer-btn"
              onClick={() => setRunning(!running)}
            >
              {running ? "STOP" : "START"}
            </button>
            <button className="timer-btn" onClick={handleLap}>LAP</button>
          </div>
        </div>

        {/* 기록 */}
        <div className="record-box">
          <div className="record-title">시간 기록</div>
          <div className="record-list">
            {laps.map((lap, i) => (
              <div className="record-item" key={i}>
                <span>{i + 1}Lap</span>
                <span>{Math.floor(lap / 1000)}s</span>
              </div>
            ))}
          </div>
          <button className="reset-btn" onClick={handleReset}>
            reset
          </button>
        </div>
      </div>
    </>
  );
}

export default StudyPage;

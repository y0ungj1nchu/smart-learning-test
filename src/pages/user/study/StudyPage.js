import React, { useState, useEffect, useRef, useCallback } from "react";
import Header1 from "../../../components/common/Header1";
import Header2 from "../../../components/common/Header2";
import "../../../styles/study/StudyPage.css";
import { startStudySession, stopStudySession, getStudySummary, getCurrentStudySession } from "../../../utils/api";

function StudyPage() {
  const [time, setTime] = useState(0); 
  const [running, setRunning] = useState(false);
  const [logId, setLogId] = useState(null); 
  const [todayStudy, setTodayStudy] = useState(0);
  const [weekStudy, setWeekStudy] = useState(0);
  
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  // --- 🔥 수정된 부분 (페이지 로드 시 상태 복원) ---
  useEffect(() => {
    // 1. (기존) 학습 시간 요약 불러오기
    const fetchStudySummary = async () => {
      try {
        const data = await getStudySummary();
        setTodayStudy(data.todayStudy || 0);
        setWeekStudy(data.weekStudy || 0);
      } catch (error) {
        console.error("학습 요약 불러오기 실패:", error);
      }
    };

    // 2. (신규) 진행 중인 세션 확인하기
    const checkActiveSession = async () => {
      try {
        const data = await getCurrentStudySession();
        if (data.activeSession) {
          // 멈추지 않은 세션이 있다면
          const { logId, startTime } = data.activeSession;
          
          // 3. 상태 복원
          setLogId(logId); // DB의 logId로 설정
          setRunning(true); // 타이머 실행
          
          // 4. 경과 시간 계산 및 타이머 시작 시간 설정
          const startTimeMs = new Date(startTime).getTime(); // DB의 시작 시간
          const elapsedTime = Date.now() - startTimeMs;     // 현재까지 경과 시간
          
          startTimeRef.current = startTimeMs; // 타이머 기준 시간 설정
          setTime(elapsedTime);               // 화면 시간 복원
        }
      } catch (error) {
        console.error("진행 중인 세션 확인 실패:", error);
      }
    };

    fetchStudySummary(); // 1. 요약 불러오기
    checkActiveSession(); // 2. 진행 중인 세션 확인 (매우 중요)

  }, []); // 페이지 로드 시 1회만 실행 (의존성 배열 비움)
  // ----------------------------------------------------

  // 타이머 로직 (100ms마다 화면 갱신)
  useEffect(() => {
    if (running) {
      timerRef.current = setInterval(() => {
        const elapsedTime = Date.now() - startTimeRef.current;
        setTime(elapsedTime);
      }, 100); 
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [running]); 

  const handleStartStop = async () => {
    if (running) {
      // --- STOP 로직 ---
      try {
        setRunning(false); 
        setTime(0);      
        
        const data = await stopStudySession(logId); // API 호출
        setLogId(null);
        alert(data.message || "공부 기록이 저장되었습니다.");
        
        // 요약 정보 즉시 갱신
        const summaryData = await getStudySummary();
        setTodayStudy(summaryData.todayStudy || 0);
        setWeekStudy(summaryData.weekStudy || 0);
        
      } catch (error) {
        alert(error.message || "기록 중지에 실패했습니다.");
        setRunning(true); 
      }

    } else {
      // --- START 로직 ---
      try {
        const data = await startStudySession(); // API 호출
        setLogId(data.logId);
        
        startTimeRef.current = Date.now(); 
        
        setTime(0);
        setRunning(true);
      } catch (error) {
        // (409 Conflict 에러는 이제 발생하지 않음)
        alert(error.message || "기록 시작에 실패했습니다.");
      }
    }
  };

  // (시간 포맷 함수 및 렌더링 로직... 생략)
  const formatTime = (seconds) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };
  const formatTimer = (t_ms) => {
    const totalSeconds = Math.floor(t_ms / 1000);
    const h = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
    const s = String(totalSeconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };
  const colors = ["#FFD400", "#4DA3FF", "#6DD56C", "#FF6B81", "#B26EFF"];
  const colorCount = colors.length;
  const fullCycle = 3600000;
  const currentHour = Math.floor(time / fullCycle);
  const nextColorIndex = (currentHour + 1) % colorCount;
  const currentColorIndex = currentHour % colorCount;
  const progressRatio = (time % fullCycle) / fullCycle;
  const progress = progressRatio * 360;
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
            <button className="timer-btn" onClick={handleStartStop}>
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
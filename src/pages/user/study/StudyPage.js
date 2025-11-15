import React, { useState, useEffect, useRef, useCallback } from "react";
import Header1 from "../../../components/common/Header1";
import Header2 from "../../../components/common/Header2";
import "../../../styles/study/StudyPage.css";
import { startStudySession, stopStudySession, getStudySummary, getCurrentStudySession } from "../../../utils/api";

// Normalize seconds from API (handles seconds/ms and alt fields)
const normalizeSec = (v) => {
  if (v == null) return 0;
  const n = Number(v);
  return n > 7 * 24 * 3600 * 10 ? Math.floor(n / 1000) : Math.floor(n);
};

// Day/Week boundary helpers
const startOfTodayMs = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};
const startOfWeekMs = () => {
  const d = new Date();
  const day = (d.getDay() + 6) % 7; // Mon=0 ... Sun=6
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - day);
  return d.getTime();
};

function StudyPage() {
  const [time, setTime] = useState(0); 
  const [running, setRunning] = useState(false);
  const [logId, setLogId] = useState(null); 
  const [todayStudy, setTodayStudy] = useState(0);
  const [weekStudy, setWeekStudy] = useState(0);
  
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);
  const boundaryRef = useRef({
    dayStart: startOfTodayMs(),
    weekStart: startOfWeekMs(),
  });

  // --- 🔥 수정된 부분 (페이지 로드 시 상태 복원) ---
  useEffect(() => {
    // 1. (기존) 학습 시간 요약 불러오기
    const fetchStudySummary = async () => {
      try {
        const data = await getStudySummary();
        const today = normalizeSec(data?.todaySeconds ?? data?.todayStudy);
        const week = normalizeSec(data?.weekSeconds ?? data?.weekStudy);
        setTodayStudy(today);
        setWeekStudy(week);
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

          // 서버 요약 값이 진행 중 세션의 경과를 포함했을 가능성 방지: 베이스 보정
          const now = Date.now();
          const elapsedSec = Math.floor((now - startTimeMs) / 1000);
          let addToday = elapsedSec;
          let addWeek = elapsedSec;
          const todayOffset = Math.ceil((startOfTodayMs() - startTimeMs) / 1000);
          if (todayOffset > 0) addToday = Math.max(0, elapsedSec - todayOffset);
          const weekOffset = Math.ceil((startOfWeekMs() - startTimeMs) / 1000);
          if (weekOffset > 0) addWeek = Math.max(0, elapsedSec - weekOffset);
          setTodayStudy((prev) => Math.max(0, normalizeSec(prev) - addToday));
          setWeekStudy((prev) => Math.max(0, normalizeSec(prev) - addWeek));
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
        const now = Date.now();
        const elapsedTime = now - startTimeRef.current;
        setTime(elapsedTime);

        // Reset base totals when day/week boundary rolls over
        const ds = startOfTodayMs();
        const ws = startOfWeekMs();
        if (boundaryRef.current.dayStart !== ds) {
          setTodayStudy(0);
          boundaryRef.current.dayStart = ds;
        }
        if (boundaryRef.current.weekStart !== ws) {
          setWeekStudy(0);
          boundaryRef.current.weekStart = ws;
        }
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
        setTodayStudy(normalizeSec(summaryData?.todaySeconds ?? summaryData?.todayStudy));
        setWeekStudy(normalizeSec(summaryData?.weekSeconds ?? summaryData?.weekStudy));
        
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

  // Live today/week accumulation while running (exclude pre-boundary portion)
  const elapsedSec = Math.floor(time / 1000);
  let addToday = elapsedSec;
  let addWeek = elapsedSec;
  if (running && startTimeRef.current) {
    const todayOffset = Math.ceil((startOfTodayMs() - startTimeRef.current) / 1000);
    if (todayOffset > 0) addToday = Math.max(0, elapsedSec - todayOffset);
    const weekOffset = Math.ceil((startOfWeekMs() - startTimeRef.current) / 1000);
    if (weekOffset > 0) addWeek = Math.max(0, elapsedSec - weekOffset);
  }
  const liveToday = todayStudy + addToday;
  const liveWeek = weekStudy + addWeek;

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
            <span>{formatTime(liveWeek)}</span>
          </div>
          <div className="record-item">
            <span>오늘의 공부 시간</span>
            <span>{formatTime(liveToday)}</span>
          </div>
        </div>
      </div>
    </>
  );
}

export default StudyPage;

import React, { useState, useEffect, useRef } from "react";
import Header1 from "../../../components/common/Header1";
import Header2 from "../../../components/common/Header2";
import "../../../styles/study/StudyPage.css";

import {
  startStudySession,
  stopStudySession,
  getStudySummary,
  getCurrentStudySession,
  getCategories,
  addCategory,
  deleteCategory,
  getStudyStatsToday,
} from "../../../utils/api";

function StudyPage() {
  const [time, setTime] = useState(0); // ms 단위 타이머
  const [running, setRunning] = useState(false);
  const [logId, setLogId] = useState(null);

  const [todayStudy, setTodayStudy] = useState(0); // 초
  const [weekStudy, setWeekStudy] = useState(0); // 초

  const [subjects, setSubjects] = useState([]);
  const [subjectInput, setSubjectInput] = useState("");
  const [currentSubject, setCurrentSubject] = useState(null); // categoryId

  const [subjectTimes, setSubjectTimes] = useState({}); // { "수학": 3600, ... }

  const [showModal, setShowModal] = useState(false);

  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  /* ===========================================================
      시간 포맷 (초 → HH:MM:SS)
  =========================================================== */
  const formatTime = (sec) => {
    const h = String(Math.floor(sec / 3600)).padStart(2, "0");
    const m = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const formatTimerMS = (ms) => formatTime(Math.floor(ms / 1000));

  /* ===========================================================
      초기 로드
  =========================================================== */
  useEffect(() => {
    loadCategories();
    loadSummary();
    restoreSession();
    loadCategoryStatsToday();
  }, []);

  /* 🔥 카테고리 가져오기 */
  const loadCategories = async () => {
    try {
      const list = await getCategories();
      setSubjects(list);
    } catch (err) {
      console.error("카테고리 조회 실패:", err);
    }
  };

  /* 🔥 오늘/주간 공부 시간 (초 단위) */
  const loadSummary = async () => {
    try {
      const data = await getStudySummary(); // { today: 초, week: 초 }
      setTodayStudy(Number(data.today || 0));
      setWeekStudy(Number(data.week || 0));
    } catch (err) {
      console.error("요약 조회 실패:", err);
    }
  };

  /* 🔥 카테고리별 오늘 공부시간 (seconds 단위) */
  const loadCategoryStatsToday = async () => {
    try {
      const stats = await getStudyStatsToday();
      // stats.seconds = [3600, 1800]

      const map = {};
      stats.labels.forEach((label, i) => {
        map[label] = stats.seconds[i] || 0; // ⬅ 초 그대로
      });

      setSubjectTimes(map);
    } catch (err) {
      console.error("카테고리별 시간 조회 실패:", err);
    }
  };

  /* 🔥 진행 중 세션 복원 */
  const restoreSession = async () => {
    try {
      const data = await getCurrentStudySession();
      if (data.activeSession) {
        const { logId, categoryId, startTime } = data.activeSession;

        setLogId(logId);
        setCurrentSubject(categoryId);
        setRunning(true);

        const startMs = new Date(startTime).getTime();
        startTimeRef.current = startMs;
        setTime(Date.now() - startMs);
      }
    } catch (err) {
      console.error("세션 복원 실패:", err);
    }
  };

  /* ===========================================================
      타이머
  =========================================================== */
  useEffect(() => {
    if (running) {
      timerRef.current = setInterval(() => {
        setTime(Date.now() - startTimeRef.current);
      }, 100);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [running]);

  /* ===========================================================
      카테고리 클릭
  =========================================================== */
  const handleSelectSubject = (item) => {
    setCurrentSubject(item.id);
    if (!running) setTime(0);
  };

  /* ===========================================================
      카테고리 추가
  =========================================================== */
  const handleAddCategory = async () => {
    if (!subjectInput.trim()) return;

    await addCategory(subjectInput.trim());
    setSubjectInput("");

    await loadCategories();
    await loadCategoryStatsToday();
  };

  /* ===========================================================
      카테고리 삭제
  =========================================================== */
  const handleDeleteCategory = async (id, e) => {
    e.stopPropagation();
    await deleteCategory(id);

    if (currentSubject === id) setCurrentSubject(null);

    await loadCategories();
    await loadCategoryStatsToday();
  };

  /* ===========================================================
      START / STOP
  =========================================================== */
  const handleStartStop = async () => {
    if (!running) {
      if (!currentSubject) {
        setShowModal(true);
        return;
      }

      const res = await startStudySession({ categoryId: currentSubject });
      setLogId(res.logId);

      startTimeRef.current = Date.now();
      setTime(0);
      setRunning(true);
    } else {
      await stopStudySession(logId);

      setRunning(false);
      setLogId(null);
      setTime(0);

      await loadSummary();
      await loadCategoryStatsToday();
    }
  };

  /* ===========================================================
      실시간 반영
  =========================================================== */
  const elapsedSec = Math.floor(time / 1000);
  const liveToday = running ? todayStudy + elapsedSec : todayStudy;
  const liveWeek = running ? weekStudy + elapsedSec : weekStudy;

  const selectedCategory =
    subjects.find((s) => s.id === currentSubject)?.categoryName || "없음";

  /* ===========================================================
      렌더링
  =========================================================== */
  return (
    <>
      <Header1/>
      <Header2/>

      <div className="page-content" style={{ paddingTop: "93px" }}>
        <div className="study-container">

          {/* 카테고리 */}
          <div className="subject-box">
            <div className="subject-title">카테고리 관리</div>

            <div className="subject-add-row">
              <input
                value={subjectInput}
                placeholder="카테고리 입력"
                onChange={(e) => setSubjectInput(e.target.value)}
              />
              <button onClick={handleAddCategory}>추가</button>
            </div>

            <div className="subject-list">
              {subjects.map((s) => (
                <div
                  key={s.id}
                  className={`subject-item ${
                    currentSubject === s.id ? "active" : ""
                  }`}
                  onClick={() => handleSelectSubject(s)}
                >
                  <span>{s.categoryName}</span>
                  <button
                    className="delete-btn"
                    onClick={(e) => handleDeleteCategory(s.id, e)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 타이머 */}
          <div className="timer-box">
            <div className="timer-circle">
              <div className="timer-inner">
                <div className="timer-text">{formatTimerMS(time)}</div>
              </div>
            </div>

            <div className="current-subject">
              현재 선택된 카테고리: <b>{selectedCategory}</b>
            </div>

            <div className="timer-btns">
              <button className="timer-btn" onClick={handleStartStop}>
                {running ? "STOP" : "START"}
              </button>
            </div>
          </div>

          {/* 기록 */}
          <div className="record-box">
            <div className="record-title">공부 기록</div>

            <div className="record-item">
              <span>오늘 공부 시간</span>
              <span>{formatTime(liveToday)}</span>
            </div>

            <div className="record-item">
              <span>이번 주 공부 시간</span>
              <span>{formatTime(liveWeek)}</span>
            </div>

            <div className="record-title">카테고리별 누적 시간</div>

            <div className="subject-time-list">
              {subjects.map((s) => (
                <div key={s.id} className="record-item">
                  <span>{s.categoryName}</span>
                  <span>{formatTime(subjectTimes[s.categoryName] || 0)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 카테고리 선택 모달 */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">카테고리 선택 필요</div>
            <div className="modal-text">먼저 공부할 카테고리를 선택해주세요.</div>
            <button className="modal-btn" onClick={() => setShowModal(false)}>
              확인
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default StudyPage;

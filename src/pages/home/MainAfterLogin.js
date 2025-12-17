import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../../styles/home/MainAfterLogin.css";
import Header1 from "../../components/common/Header1";
import Header2 from "../../components/common/Header2";
import Footer from "../../components/common/Footer";

import basicUser from "../../assets/basicUser.png";

import {
  getMyProfile,
  getCalendarData,
  getRanking,
  getStudyStatsToday,
  getStudyStatsLast7,
} from "../../utils/api";

import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

/* ================= 날짜 유틸 ================= */
function pad(n) {
  return n.toString().padStart(2, "0");
}

function ymdLabel(date) {
  const localDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  return `${localDate.getUTCFullYear()}년 ${pad(
    localDate.getUTCMonth() + 1
  )}월 ${pad(localDate.getUTCDate())}일`;
}

function ymdKey(date) {
  return date.toISOString().split("T")[0];
}

/* ================= 컴포넌트 ================= */
function MainAfterLogin() {
  /* ---------- 상태 ---------- */
  const [todayTodos, setTodayTodos] = useState([]);
  const [ranking, setRanking] = useState([]);

  const [userChar, setUserChar] = useState({
    name: "캐릭터",
    level: 1,
    image: null,
  });

  const [subjectLabels, setSubjectLabels] = useState([]);
  const [subjectHours, setSubjectHours] = useState([]);
  const [last7Labels, setLast7Labels] = useState([]);
  const [last7Hours, setLast7Hours] = useState([]);

  /* ---------- 데이터 로드 ---------- */
  useEffect(() => {
    const loadAll = async () => {
      try {
        /* 1. 프로필 */
        const profile = await getMyProfile();
        setUserChar({
          name: profile.characterNickname || profile.nickname,
          level: profile.level,
          image: profile.characterImage
            ? `http://localhost:3001/uploads/characters/${profile.characterImage}`
            : null,
        });

        /* 2. 오늘 할 일 */
        const todayKey = ymdKey(new Date());
        const cal = await getCalendarData(todayKey);
        setTodayTodos(cal.todos || []);

        /* 3. 랭킹 */
        const rank = await getRanking();
        setRanking(rank.slice(0, 5));

        /* 4. 공부 통계 */
        const todayStats = await getStudyStatsToday();
        setSubjectLabels(todayStats.labels || []);
        setSubjectHours(
          (todayStats.seconds || []).map((sec) =>
            Number((sec / 3600).toFixed(2))
          )
        );

        const last7Stats = await getStudyStatsLast7();
        setLast7Labels(last7Stats.labels || []);
        setLast7Hours(
          (last7Stats.seconds || []).map((sec) =>
            Number((sec / 3600).toFixed(2))
          )
        );
      } catch (err) {
        console.error("메인 데이터 로드 실패:", err);
      }
    };

    loadAll();
  }, []);

  /* ---------- 차트 옵션 ---------- */
  function getHourStep(maxHour) {
    if (maxHour <= 3) return 1;
    if (maxHour <= 10) return 2;
    if (maxHour <= 20) return 5;
    return 10;
  }

  const subjectStep = getHourStep(Math.max(...subjectHours, 0));
  const dailyStep = getHourStep(Math.max(...last7Hours, 0));

  const baseLineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    elements: { line: { tension: 0.3, borderWidth: 3 } },
    plugins: { legend: { display: false } },
  };

  const subjectLineOptions = {
    ...baseLineOptions,
    scales: {
      y: {
        beginAtZero: true,
        suggestedMax: Math.max(...subjectHours, 0) + subjectStep,
        ticks: { stepSize: subjectStep, callback: (v) => `${v}h` },
      },
    },
  };

  const dailyLineOptions = {
    ...baseLineOptions,
    scales: {
      y: {
        beginAtZero: true,
        suggestedMax: Math.max(...last7Hours, 0) + dailyStep,
        ticks: { stepSize: dailyStep, callback: (v) => `${v}h` },
      },
    },
  };

  /* ================= JSX ================= */
  return (
    <>
      <Header1 isLoggedIn />
      <Header2 isLoggedIn />

      <div className="page-content" style={{ paddingTop: "93px" }}>
        <div className="afterlogin-container">
          {/* ===== 오늘의 할 일 ===== */}
          <div className="card-group">
            <div className="uniform-card">
              <p className="card-date-inside">{ymdLabel(new Date())}</p>

              <h3>
                오늘의 할 일{" "}
                <span className="todo-count">({todayTodos.length})</span>
              </h3>

              <ul className="todo-ul">
                {todayTodos.length === 0 ? (
                  <li>오늘의 일정이 없습니다.</li>
                ) : (
                  todayTodos.slice(0, 3).map((t) => (
                    <li key={t.id}>
                      {t.isCompleted ? <s>{t.title}</s> : t.title}
                    </li>
                  ))
                )}
              </ul>

              <div className="card-bottom">
                <Link to="/user/calendar" className="more-link">
                  바로가기 →
                </Link>
              </div>
            </div>
          </div>

          {/* ===== 캐릭터 ===== */}
          <div className="card-group">
            <div className="uniform-card char-section">
              <div className="character-image-box">
                <img
                  src={userChar.image || basicUser}
                  alt="캐릭터"
                  className="character-img-home"
                />
              </div>

              <p className="char-name">{userChar.name}</p>
              <p className="char-level">Lv.{userChar.level}</p>

              <div className="card-bottom">
                <Link to="/user/character" className="more-link">
                  바로가기 →
                </Link>
              </div>
            </div>
          </div>

          {/* ===== 랭킹 ===== */}
          <div className="card-group">
            <div className="uniform-card">
              <p className="card-date-inside">{ymdLabel(new Date())}</p>

              <h3>주간 순위</h3>

              <ol>
                {ranking.length === 0 ? (
                  <li>순위 데이터가 없습니다.</li>
                ) : (
                  ranking.map((u, i) => (
                    <li key={i}>
                      {u.userNickname} — Lv.{u.level}
                    </li>
                  ))
                )}
              </ol>

              <div className="card-bottom">
                <Link to="/user/ranking" className="more-link">
                  바로가기 →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ===== 공부 통계 ===== */}
        <div className="study-stat-big">
          <p className="card-title">공부 통계</p>

          <div className="stats-inner-row">
            <div className="stats-small-card today">
              <h3 className="graph-title">오늘 과목별 공부시간</h3>
              <div className="chart-container">
                <Line
                  data={{
                    labels: subjectLabels,
                    datasets: [
                      {
                        data: subjectHours,
                        borderColor: "#FFD400",
                        backgroundColor: "rgba(255,212,0,0.3)",
                        pointBackgroundColor: "#FFD400",
                      },
                    ],
                  }}
                  options={subjectLineOptions}
                />
              </div>
            </div>

            <div className="stats-small-card week">
              <h3 className="graph-title">최근 7일 공부시간</h3>
              <div className="chart-container">
                <Line
                  data={{
                    labels: last7Labels,
                    datasets: [
                      {
                        data: last7Hours,
                        borderColor: "#4DA3FF",
                        backgroundColor: "rgba(77,163,255,0.3)",
                        pointBackgroundColor: "#4DA3FF",
                      },
                    ],
                  }}
                  options={dailyLineOptions}
                />
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}

export default MainAfterLogin;

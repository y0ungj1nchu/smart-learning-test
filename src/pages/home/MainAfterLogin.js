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
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);


// 날짜 유틸
function pad(n) {
  return n.toString().padStart(2, "0");
}
function ymd(date) {
  const localDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  return `${localDate.getUTCFullYear()}-${pad(localDate.getUTCMonth() + 1)}-${pad(localDate.getUTCDate())}`;
}


function MainAfterLogin() {
  const [todayTodos, setTodayTodos] = useState([]);
  const [ranking, setRanking] = useState([]);

  const [characterName, setCharacterName] = useState("캐릭터");
  const [characterLevel, setCharacterLevel] = useState(1);
  const [characterImage, setCharacterImage] = useState(null);

  const [subjectLabels, setSubjectLabels] = useState([]);
  const [subjectHours, setSubjectHours] = useState([]);
  const [last7Labels, setLast7Labels] = useState([]);
  const [last7Hours, setLast7Hours] = useState([]);

  const chartOption = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true } },
  };

  // 데이터 로드
  useEffect(() => {
    const loadAll = async () => {
      try {
        const profile = await getMyProfile();
        setCharacterName(profile.characterNickname || profile.nickname);
        setCharacterLevel(profile.level);
        if (profile.characterImage) setCharacterImage(profile.characterImage);

        const todayStr = ymd(new Date());
        const cal = await getCalendarData(todayStr);
        setTodayTodos(cal.todos || []);

        const rank = await getRanking();
        setRanking(rank.slice(0, 5));

        const sToday = await getStudyStatsToday();
        setSubjectLabels(sToday.labels);
        setSubjectHours(sToday.seconds.map(sec => (sec / 3600).toFixed(2)));

        const s7 = await getStudyStatsLast7();
        setLast7Labels(s7.labels);
        setLast7Hours(s7.seconds.map(sec => (sec / 3600).toFixed(2)));
      } catch (err) {
        console.error("데이터 로드 실패:", err);
      }
    };
    loadAll();
  }, []);


  return (
    <>
      <Header1 />
      <Header2 />

      <div className="afterlogin-wrapper">
        <div className="afterlogin-container">

          {/* ===================== 캘린더 ===================== */}
          <div className="card-group">
            <p className="card-title">캘린더</p>

            <div className="uniform-card">
              <h3>오늘의 할 일</h3>
              <p className="date">{new Date().toLocaleDateString("ko-KR")}</p>

              {todayTodos.length === 0 ? (
                <ul><li>오늘의 일정이 없습니다.</li></ul>
              ) : (
                <ul>
                  {todayTodos.slice(0, 3).map(t => (
                    <li key={t.id}>
                      {t.isCompleted ? <s>{t.title}</s> : t.title}
                    </li>
                  ))}
                </ul>
              )}

              <Link to="/user/calendar" className="more-link">바로가기 →</Link>
            </div>
          </div>


          {/* ===================== 캐릭터 ===================== */}
          <div className="card-group">
            <p className="card-title">캐릭터</p>

            <div className="uniform-card char-section">
              <div className="character-image-box">
                <img
                  className="character-img-home"
                  src={
                    characterImage
                      ? `http://localhost:3001/uploads/characters/${characterImage}`
                      : basicUser
                  }
                  alt="캐릭터"
                />
              </div>

              <p className="char-name">{characterName}</p>
              <p className="char-level">Lv.{characterLevel}</p>

              <Link to="/user/character" className="more-link">바로가기 →</Link>
            </div>
          </div>


          {/* ===================== 사용자 레벨 ===================== */}
          <div className="card-group">
            <p className="card-title">사용자 레벨 순위</p>

            <div className="uniform-card">
              <h3>주간 순위</h3>
              <p className="date">{new Date().toLocaleDateString("ko-KR")}</p>

              {ranking.length === 0 ? (
                <ul><li>순위 데이터가 없습니다.</li></ul>
              ) : (
                <ol>
                  {ranking.map((u, i) => (
                    <li key={i}>
                      {u.userNickname} — Lv.{u.level}
                    </li>
                  ))}
                </ol>
              )}

              <Link to="/user/ranking" className="more-link">바로가기 →</Link>
            </div>
          </div>

        </div>


        {/* ===================== 공부 통계 ===================== */}
        <div className="study-stat-big">
          <p className="card-title" style={{marginLeft:"6px"}}>공부 통계</p>

          <div className="stats-inner-row">

            {/* 오늘 */}
            <div className="stats-small-card today">
              <h3 className="graph-title">오늘 과목별 공부시간</h3>

              <Line
                data={{
                  labels: subjectLabels,
                  datasets: [
                    {
                      data: subjectHours,
                      borderColor: "#FFD400",
                      backgroundColor: "rgba(255,212,0,0.3)",
                    },
                  ],
                }}
                options={chartOption}
              />
            </div>

            {/* 7일 */}
            <div className="stats-small-card week">
              <h3 className="graph-title">최근 7일 공부시간</h3>

              <Line
                data={{
                  labels: last7Labels,
                  datasets: [
                    {
                      data: last7Hours,
                      borderColor: "#4DA3FF",
                      backgroundColor: "rgba(77,163,255,0.3)",
                    },
                  ],
                }}
                options={chartOption}
              />
            </div>

          </div>
        </div>

        <Footer />

      </div>
    </>
  );
}

export default MainAfterLogin;

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../../styles/home/MainAfterLogin.css";
import Header1 from "../../components/common/Header1";
import Header2 from "../../components/common/Header2";
import Footer from "../../components/common/Footer";
import { sortedRanking } from "../../data/rankingData";

function pad(n) {
  return n.toString().padStart(2, "0");
}
function ymd(date) {
  const localDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  const y = localDate.getUTCFullYear();
  const m = pad(localDate.getUTCMonth() + 1);
  const d = pad(localDate.getUTCDate());
  return `${y}년 ${m}월 ${d}일`;
}

function MainAfterLogin() {
  const [todayTodos, setTodayTodos] = useState([]);
  const [ranking, setRanking] = useState([]);

  useEffect(() => {
    const today = new Date();
    const todayKey = `todos:${ymd(today)}`;

    const stored = JSON.parse(localStorage.getItem(todayKey) || "[]");
    setTodayTodos(stored);

    setRanking(sortedRanking.slice(0, 5));
  }, []);

  return (
    <>
      <Header1 isLoggedIn={true} />
      <Header2 isLoggedIn={true} />

      <div className="afterlogin-container">
        {/* 캘린더 */}
        <div className="card-group">
          <p className="card-title">캘린더</p>
          <div className="card">
            <h3>오늘의 할 일</h3>
            <p className="date">{ymd(new Date())}</p>
            {todayTodos.length === 0 ? (
              <ul>
                <li>오늘의 일정이 없습니다.</li>
              </ul>
            ) : (
              <ul>
                {todayTodos.slice(0, 3).map((t, i) => (
                  <li key={i}>
                    {t.done ? <s>{t.title}</s> : t.title}
                  </li>
                ))}
              </ul>
            )}
            <Link to="/user/calendar" className="more-link">
              바로가기 →
            </Link>
          </div>
        </div>

        {/* 캐릭터 */}
        <div className="card-group">
          <p className="card-title">캐릭터</p>
          <div className="card">
            <div className="character-box">캐릭터 이미지</div>
            <p className="character-name">캐릭터 이름</p>
          </div>
        </div>

        {/* 사용자 레벨 순위 */}
        <div className="card-group">
          <p className="card-title">사용자 레벨 순위</p>
          <div className="card">
            <h3>주간 순위</h3>
            <p className="date">{ymd(new Date())}</p>
            {ranking.length === 0 ? (
              <ul>
                <li>순위 데이터가 없습니다.</li>
              </ul>
            ) : (
              <ol>
                {ranking.map((user, i) => (
                  <li key={i}>
                    {i + 1}. {user.nickname}  —  Lv.{user.level}
                  </li>
                ))}
              </ol>
            )}
            <Link to="/user/ranking" className="more-link">
              바로가기 →
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default MainAfterLogin;

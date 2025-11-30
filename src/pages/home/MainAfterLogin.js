import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../../styles/home/MainAfterLogin.css";
import Header1 from "../../components/common/Header1";
import Header2 from "../../components/common/Header2";
import Footer from "../../components/common/Footer";

// API
import { getMyProfile, getCalendarData, getRanking } from "../../utils/api";

// 기본 이미지
import basicUser from "../../assets/basicUser.png";

// 날짜 함수
function pad(n) {
  return n.toString().padStart(2, "0");
}
function ymd(date) {
  const localDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  const y = localDate.getUTCFullYear();
  const m = pad(localDate.getUTCMonth() + 1);
  const d = pad(localDate.getUTCDate());
  return `${y}-${m}-${d}`;
}

function MainAfterLogin() {
  const [todayTodos, setTodayTodos] = useState([]);
  const [ranking, setRanking] = useState([]);
  const [characterName, setCharacterName] = useState("캐릭터");
  const [characterLevel, setCharacterLevel] = useState(1);
  const [characterImage, setCharacterImage] = useState(null); // 서버 파일명

  useEffect(() => {
    // ▼ 1. 프로필
    const fetchProfile = async () => {
      try {
        const profile = await getMyProfile();

        setCharacterName(profile.characterNickname || profile.nickname);
        setCharacterLevel(profile.level);

        // DB에 저장된 이미지 파일명 그대로 사용
        if (profile.characterImage && typeof profile.characterImage === "string") {
          setCharacterImage(profile.characterImage);
        } else {
          setCharacterImage(null);
        }
      } catch (e) {
        console.error("프로필 로드 실패:", e);
      }
    };

    // ▼ 2. 오늘 일정
    const fetchCalendar = async () => {
      try {
        const todayStr = ymd(new Date());
        const cal = await getCalendarData(todayStr);
        setTodayTodos(cal.todos || []);
      } catch (e) {
        console.error("캘린더 로드 실패:", e);
      }
    };

    // ▼ 3. 랭킹
    const fetchRanking = async () => {
      try {
        const rank = await getRanking();
        setRanking(rank.slice(0, 5));
      } catch (e) {
        console.error("랭킹 로드 실패:", e);
        setRanking([]);
      }
    };

    fetchProfile();
    fetchCalendar();
    fetchRanking();
  }, []);

  return (
    <>
      <Header1 isLoggedIn={true} />
      <Header2 isLoggedIn={true} />

      <div className="afterlogin-container">
        {/* ===================== 캘린더 ===================== */}
        <div className="card-group">
          <p className="card-title">캘린더</p>
          <div className="card">
            <h3>오늘의 할 일</h3>
            <p className="date">{new Date().toLocaleDateString("ko-KR")}</p>

            {todayTodos.length === 0 ? (
              <ul>
                <li>오늘의 일정이 없습니다.</li>
              </ul>
            ) : (
              <ul>
                {todayTodos.slice(0, 3).map((t) => (
                  <li key={t.id}>{t.isCompleted ? <s>{t.title}</s> : t.title}</li>
                ))}
              </ul>
            )}

            <Link to="/user/calendar" className="more-link">
              바로가기 →
            </Link>
          </div>
        </div>

        {/* ===================== 캐릭터 ===================== */}
        <div className="card-group">
          <p className="card-title">캐릭터</p>

          <div className="card">
            <div className="character-box">
              <img
                className="character-image"
                alt="캐릭터"
                src={
                  characterImage
                    ? `http://localhost:3001/uploads/characters/${characterImage}` // ★ 수정완료
                    : basicUser
                }
              />
              <span className="character-level">Lv.{characterLevel}</span>
            </div>
            <p className="character-name">{characterName}</p>
          </div>
        </div>

        {/* ===================== 사용자 레벨 순위 ===================== */}
        <div className="card-group">
          <p className="card-title">사용자 레벨 순위</p>

          <div className="card">
            <h3>주간 순위</h3>
            <p className="date">{new Date().toLocaleDateString("ko-KR")}</p>

            {ranking.length === 0 ? (
              <ul>
                <li>순위 데이터가 없습니다.</li>
              </ul>
            ) : (
              <ol>
                {ranking.map((user, i) => (
                  <li key={user.userId || i}>
                    {i + 1}. {user.characterNickname || user.nickname} — Lv.
                    {user.level}
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

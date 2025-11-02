import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom"; // useNavigate 임포트
import "../../styles/home/MainAfterLogin.css";
import Header1 from "../../components/common/Header1";
import Header2 from "../../components/common/Header2";
import Footer from "../../components/common/Footer"; // Footer 임포트

// --- 🔥 1. API (프로필, 캘린더) + 더미 랭킹 임포트 ---
import { getMyProfile, getCalendarData } from "../../utils/api";
import { sortedRanking } from "../../data/rankingData"; // 랭킹은 더미 데이터 사용
// ---------------------------------------------

// (날짜 함수 - YYYY-MM-DD 형식)
function pad(n) { return n.toString().padStart(2, "0"); }
function ymd(date) {
  const localDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  const y = localDate.getUTCFullYear();
  const m = pad(localDate.getUTCMonth() + 1);
  const d = pad(localDate.getUTCDate());
  return `${y}-${m}-${d}`;
}

function MainAfterLogin() {
  const navigate = useNavigate(); // Link 대신 navigate 사용을 위해 추가
  
  const [todayTodos, setTodayTodos] = useState([]);
  const [todayDiary, setTodayDiary] = useState(null); // 🔥 일기 상태 추가
  
  // --- 🔥 2. 랭킹은 API가 아닌 useState로 관리 ---
  const [ranking, setRanking] = useState([]);
  const [characterName, setCharacterName] = useState("캐릭터"); 
  const [characterLevel, setCharacterLevel] = useState(1);
  // ---------------------------------------

  // --- 🔥 3. API 및 더미 데이터 호출 ---
  useEffect(() => {
    // 1. 프로필 정보 (캐릭터) 불러오기
    const fetchProfile = async () => {
      try {
        const data = await getMyProfile();
        setCharacterName(data.nickname);
        setCharacterLevel(data.level);
      } catch (error) {
        console.error("메인 닉네임 로드 실패:", error);
      }
    };

    // 2. 캘린더 (오늘 할 일 + 일기) 불러오기
    const loadCalendar = async () => {
      try {
        const todayStr = ymd(new Date());
        const data = await getCalendarData(todayStr); 
        setTodayTodos(data.todos || []);
        setTodayDiary(data.diary || null); // 🔥 오늘 일기 상태 설정
      } catch (error) {
        console.error("메인 캘린더 로드 실패:", error);
      }
    };

    // 3. 랭킹 (더미 데이터 사용)
    const loadRanking = () => {
        setRanking(sortedRanking.slice(0, 5)); // 더미 데이터 사용
    };

    fetchProfile();   // API 호출
    loadCalendar();   // API 호출
    loadRanking();    // 더미 데이터 사용
    
  }, []);
  // ------------------------------------

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
            <p className="date">{new Date().toLocaleDateString("ko-KR")}</p> 
            
            {todayTodos.length === 0 ? (
              <ul>
                <li>오늘의 일정이 없습니다.</li>
              </ul>
            ) : (
              <ul>
                {todayTodos.slice(0, 3).map((t) => (
                  <li key={t.id}>
                    {t.isCompleted ? <s>{t.title}</s> : t.title}
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
            {/* --- 🔥 4. 캐릭터 데이터 바인딩 --- */}
            <div className="character-box">캐릭터 이미지 (Lv.{characterLevel})</div>
            <p className="character-name">{characterName}</p>
            {/* ------------------------------- */}
          </div>
        </div>

        {/* 사용자 레벨 순위 */}
        <div className="card-group">
          <p className="card-title">사용자 레벨 순위</p>
          <div className="card">
            <h3>주간 순위</h3>
            <p className="date">{new Date().toLocaleDateString("ko-KR")}</p>
            
            {/* --- 🔥 5. 랭킹 데이터 바인딩 (더미) --- */}
            {ranking.length === 0 ? (
              <ul>
                <li>순위 데이터가 없습니다.</li>
              </ul>
            ) : (
              <ol>
                {ranking.map((user, i) => (
                  // (더미 데이터는 id가 없으므로 key=i 사용)
                  <li key={i}> 
                    {i + 1}. {user.nickname}  —  Lv.{user.level}
                  </li>
                ))}
              </ol>
            )}
            {/* ----------------------------------- */}
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
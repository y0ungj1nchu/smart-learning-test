import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../../styles/home/MainAfterLogin.css";
import Header1 from "../../components/common/Header1";
import Header2 from "../../components/common/Header2";
import Footer from "../../components/common/Footer";

// --- API Imports ---
import { getMyProfile, getCalendarData, getRanking } from "../../utils/api";

// --- Image Imports ---
import basicUser from "../../assets/basicUser.png";
import snoopy1 from "../../assets/snoopy1.png";
import snoopy2 from "../../assets/snoopy2.png";
import snoopy3 from "../../assets/snoopy3.png";
import snoopy4 from "../../assets/snoopy4.png";
import snoopy5 from "../../assets/snoopy5.png";

// --- Image Mapping ---
const characterImages = {
  snoopy1,
  snoopy2,
  snoopy3,
  snoopy4,
  snoopy5,
};

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
  const [todayTodos, setTodayTodos] = useState([]);
  const [ranking, setRanking] = useState([]);
  const [characterName, setCharacterName] = useState("캐릭터");
  const [characterLevel, setCharacterLevel] = useState(1);
  const [characterImage, setCharacterImage] = useState(null); // 캐릭터 이미지 상태

  useEffect(() => {
    // 1. 프로필 정보 (캐릭터) 불러오기
    const fetchProfile = async () => {
      try {
        const profileData = await getMyProfile();
        setCharacterName(profileData.characterNickname || profileData.nickname);
        setCharacterLevel(profileData.level);
        
        // characterImage가 유효한 문자열인지 확인
        if (profileData.characterImage && typeof profileData.characterImage === 'string') {
          setCharacterImage(profileData.characterImage);
        } else {
          setCharacterImage(null); // 유효하지 않으면 null로 설정
        }
      } catch (error) {
        console.error("프로필 정보 로드 실패:", error);
      }
    };

    // 2. 캘린더 (오늘 할 일) 불러오기
    const fetchCalendar = async () => {
      try {
        const todayStr = ymd(new Date());
        const calendarData = await getCalendarData(todayStr);
        setTodayTodos(calendarData.todos || []);
      } catch (error) {
        console.error("캘린더 정보 로드 실패:", error);
      }
    };

    // 3. 랭킹 불러오기
    const fetchRanking = async () => {
      try {
        const rankingData = await getRanking();
        setRanking(rankingData.slice(0, 5)); // 상위 5개만 표시
      } catch (error) {
        console.error("랭킹 정보 로드 실패:", error);
        // 에러 발생 시 더미 데이터 대신 빈 배열 유지
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
            <div className="character-box">
              <img
                src={characterImage ? characterImages[characterImage] : basicUser}
                alt="캐릭터"
                className="character-image"
              />
              <span className="character-level">Lv.{characterLevel}</span>
            </div>
            <p className="character-name">{characterName}</p>
          </div>
        </div>

        {/* 사용자 레벨 순위 */}
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
                    {i + 1}. {user.characterNickname || user.nickname} — Lv.{user.level}
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
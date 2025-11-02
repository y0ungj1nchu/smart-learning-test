import React, { useState, useEffect } from "react"; // 1. useState, useEffect 임포트
import { useNavigate } from "react-router-dom";
import "./Header1.css";
import userIcon from "../../assets/basicUser.png";

// --- 🔥 2. API 임포트 ---
import { getMyProfile } from "../../utils/api"; 
// -----------------------

function Header1({ isLoggedIn = false }) {
  const navigate = useNavigate();
  const loggedIn = isLoggedIn || localStorage.getItem("isLoggedIn") === "true";

  // --- 🔥 3. 닉네임 상태 추가 ---
  const [nickname, setNickname] = useState("");
  // --------------------------

  // --- 🔥 4. API 호출 로직 추가 ---
  useEffect(() => {
    // 로그인 상태일 때만 프로필 정보를 가져옴
    if (loggedIn) {
      const fetchProfile = async () => {
        try {
          const data = await getMyProfile(); // API 호출
          setNickname(data.nickname); // DB 닉네임으로 상태 업데이트
        } catch (error) {
          // (예: 토큰 만료)
          console.error("헤더 닉네임 로드 실패:", error.message);
          // 토큰이 유효하지 않으면 강제 로그아웃
          localStorage.clear();
          navigate("/user/auth/Login");
        }
      };
      fetchProfile();
    }
  }, [loggedIn, navigate]); // loggedIn 상태가 변경될 때마다 실행
  // --------------------------

  // --- 🔥 5. 로그아웃 핸들러 수정 ---
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("authToken"); // (중요) 인증 토큰 삭제
    navigate("/home/before");
    window.location.reload(); // 상태 초기화를 위해 새로고침
  };
  // -------------------------------

  const handleLogoClick = () => {
    if (loggedIn) {
      navigate("/home/after");
    } else {
      navigate("/home/before");
    }
  };

  const handleProfileClick = () => {
    if (loggedIn) {
      navigate("/user/profile/view");
    } else {
      alert("로그인이 필요합니다.");
      navigate("/user/auth/Login");
    }
  };

  return (
    <header className="header1">
      <div className="logo" onClick={handleLogoClick}>
        스마트 학습 도우미
      </div>

      <nav className="menu">
        {loggedIn ? (
          <>
            {/* --- 🔥 6. 닉네임 표시 --- */}
            <span className="welcome-msg">{nickname}님 환영합니다!</span>
            {/* ----------------------- */}
            <button className="menu-btn gray" onClick={handleLogout}>
              로그아웃
            </button>
            <img
              src={userIcon}
              alt="user"
              className="user-icon"
              onClick={handleProfileClick}
            />
          </>
        ) : (
          <>
            <button
              className="menu-btn"
              onClick={() => navigate("/user/auth/Login")}
            >
              로그인
            </button>
            <button
              className="menu-btn"
              onClick={() => navigate("/user/auth/Register")}
            >
              회원가입
            </button>
            <img src={userIcon} alt="user" className="user-icon disabled" />
          </>
        )}
      </nav>
    </header>
  );
}

export default Header1;
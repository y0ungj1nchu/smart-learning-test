import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Header1.css";
import userIcon from "../../assets/basicUser.png";

import { getMyProfile } from "../../utils/api";

function Header1({ isLoggedIn = false }) {
  const navigate = useNavigate();
  const loggedIn = isLoggedIn || localStorage.getItem("isLoggedIn") === "true";

  const [nickname, setNickname] = useState("");

  useEffect(() => {
    if (loggedIn) {
      const fetchProfile = async () => {
        try {
          const data = await getMyProfile();
          setNickname(data.nickname);
        } catch (error) {
          console.error("헤더 닉네임 로드 실패:", error.message);
          localStorage.clear();
          navigate("/user/auth/Login");
        }
      };
      fetchProfile();
    }
  }, [loggedIn, navigate]);

  // 최종 선택된 로그아웃 함수 (HEAD 버전)
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("authToken");
    navigate("/home/before");
    window.location.reload();
  };

  const handleLogoClick = () => {
    navigate(loggedIn ? "/home/after" : "/home/before");
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
            <span className="welcome-msg">{nickname}님 환영합니다!</span>
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

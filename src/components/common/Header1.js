import React from "react";
import { useNavigate } from "react-router-dom";
import "./Header1.css";
import userIcon from "../../assets/basicUser.png";

function Header1({ isLoggedIn = false }) {
  const navigate = useNavigate();

  const loggedIn = isLoggedIn || localStorage.getItem("isLoggedIn") === "true";

  const handleLogoClick = () => {
    if (loggedIn) {
      navigate("/home/after");
    } else {
      navigate("/home/before");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/home/before");
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
            <button className="menu-btn gray" onClick={handleProfileClick}>
              내 정보
            </button>
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

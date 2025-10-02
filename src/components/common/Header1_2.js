import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import basicUser from "../../assets/basicUser.png";

function Header1_2() {
  return (
    <header className="header">
      <div className="logo">스마트 학습 도우미</div>

      <div className="auth-links">
        <Link to="/profile" className="auth-text">내 프로필</Link>
        <span className="divider">|</span>
        <Link to="/logout" className="auth-text">로그아웃</Link>
      </div>

      <img src={basicUser} alt="기본 유저" className="profile-icon" />
    </header>
  );
}

export default Header1_2;

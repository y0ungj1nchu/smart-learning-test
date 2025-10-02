import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import searchIcon from "../../assets/search.png";
import basicUser from "../../assets/basicUser.png";

function Header1() {
  return (
    <header className="header">
      {/* 로고 */}
      <div className="logo">스마트 학습 도우미</div>

      {/* 검색창 (비활성) */}
      <div className="search-box">
        <input type="text" placeholder="검색하세요" disabled />
        <button disabled>
          <img src={searchIcon} alt="검색" />
        </button>
      </div>

      {/* 로그인/회원가입 */}
      <div className="auth-links">
        <Link to="/user/auth/Login" className="auth-text">로그인</Link>
        <span className="divider">|</span>
        <Link to="/user/auth/Register" className="auth-text">회원가입</Link>
      </div>

      {/* 프로필 아이콘 */}
      <img src={basicUser} alt="기본 유저" className="profile-icon" />
    </header>
  );
}

export default Header1;

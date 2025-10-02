import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

function Header2({ isLoggedIn }) {
  return (
    <nav className="header2">
      {isLoggedIn ? (
        <>
          <Link to="/calendar">캘린더</Link>
          <Link to="/study">순공시간 타이머</Link>
          <Link to="/character">캐릭터</Link>
          <Link to="/games">게임</Link>
          <Link to="/ranking">사용자 레벨 순위</Link>
        </>
      ) : (
        <>
          <span className="disabled">캘린더</span>
          <span className="disabled">순공시간 타이머</span>
          <span className="disabled">캐릭터</span>
          <span className="disabled">게임</span>
          <span className="disabled">사용자 레벨 순위</span>
        </>
      )}
    </nav>
  );
}

export default Header2;

import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Header2.css";

function Header2({ isLoggedIn }) {
  const location = useLocation();
  const path = location.pathname;

  return (
    <nav className="header2">
      {isLoggedIn ? (
        <>
          <Link to="/user/calendar" className={path.includes("/calendar") ? "active" : ""}>캘린더</Link>
          <Link to="/user/study" className={path.includes("/study") ? "active" : ""}>순공시간 타이머</Link>
          <Link to="/user/character" className={path.includes("/character") ? "active" : ""}>캐릭터</Link>
          <Link to="/user/game" className={path.includes("/game") ? "active" : ""}>게임</Link>
          <Link to="/user/ranking" className={path.includes("/ranking") ? "active" : ""}>사용자 레벨 순위</Link>
          <Link to="/user/community" className={path.includes("/community") ? "active" : ""}>커뮤니티</Link>
          
          
          {/*<Link to="/user/calendar" className>캘린더</Link>
          <Link to="/user/study">순공시간 타이머</Link>
          <Link to="/user/character">캐릭터</Link>
          <Link to="/user/game">게임</Link>
          <Link to="/user/ranking">사용자 레벨 순위</Link>
          <Link to="/user/community">커뮤니티</Link>*/}
        </>
      ) : (
        <>
          <span className="disabled">캘린더</span>
          <span className="disabled">순공시간 타이머</span>
          <span className="disabled">캐릭터</span>
          <span className="disabled">게임</span>
          <span className="disabled">사용자 레벨 순위</span>
          <span className="disabled">커뮤니티</span>
        </>
      )}
    </nav>
  );
}

export default Header2;
import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Header2.css";

function AdminHeader2({ isLoggedIn }) {
  const location = useLocation();
  const path = location.pathname;

  return (
    <nav className="header2">
      {isLoggedIn ? (
        <>
          <Link to="/admin/character" className={path.includes("/character") ? "active" : ""}>캐릭터</Link>
          <Link to="/admin/game" className={path.includes("/game") ? "active" : ""}>게임</Link>
          <Link to="/admin/ranking" className={path.includes("/ranking") ? "active" : ""}>레벨순위</Link>
          <Link to="/admin/community" className={path.includes("/community") ? "active" : ""}>커뮤니티</Link>
        </>
      ) : (
        <>
          <span className="disabled">캐릭터</span>
          <span className="disabled">게임</span>
          <span className="disabled">레벨순위</span>
          <span className="disabled">커뮤니티</span>
        </>
      )}
    </nav>
  );
}

export default AdminHeader2;

import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Header2.css";
import { useAuth } from "../../context/useAuth";   // 🔥 AuthContext 사용

function Header2() {
  const location = useLocation();
  const { user } = useAuth();  // 🔥 user가 있으면 로그인 상태
  const path = location.pathname;

  const loggedIn = Boolean(user);

  return (
    <nav className="header2">
      {loggedIn ? (
        <>
          <Link
            to="/user/calendar"
            className={path.includes("/calendar") ? "active" : ""}
          >
            캘린더
          </Link>

          <Link
            to="/user/study"
            className={path.includes("/study") ? "active" : ""}
          >
            순공시간 타이머
          </Link>

          <Link
            to="/user/character"
            className={path.includes("/character") ? "active" : ""}
          >
            캐릭터
          </Link>

          <Link
            to="/user/game"
            className={path.includes("/game") ? "active" : ""}
          >
            게임
          </Link>

          <Link
            to="/user/ranking"
            className={path.includes("/ranking") ? "active" : ""}
          >
            사용자 레벨 순위
          </Link>

          <Link
            to="/user/community/notice"
            className={
              path.includes("/community") ||
              path.startsWith("/user/community/notice-detail") ||
              path.startsWith("/user/community")
                ? "active"
                : ""
            }
          >
            공지 및 문의
          </Link>
        </>
      ) : (
        <>
          <span className="disabled">캘린더</span>
          <span className="disabled">순공시간 타이머</span>
          <span className="disabled">캐릭터</span>
          <span className="disabled">게임</span>
          <span className="disabled">사용자 레벨 순위</span>
          <span className="disabled">공지 및 문의</span>
        </>
      )}
    </nav>
  );
}

export default Header2;

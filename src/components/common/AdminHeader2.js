import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Header2.css";
import { AuthContext } from "../../context/AuthContext";

function AdminHeader2() {
  const location = useLocation();
  const path = location.pathname;

  // AuthContext 사용
  const { isLoggedIn, role, authLoaded } = useContext(AuthContext);

  // authLoaded 전에는 렌더링 안함 (깜박임 방지)
  if (!authLoaded) return null;

  // ADMIN 이 아니면 헤더 표시하지 않음
  if (!isLoggedIn || role !== "ADMIN") return null;

  return (
    <nav className="header2">
      <Link
        to="/admin/character"
        className={path.startsWith("/admin/character") ? "active" : ""}
      >
        캐릭터
      </Link>

      <Link
        to="/admin/game"
        className={path.startsWith("/admin/game") ? "active" : ""}
      >
        게임
      </Link>

      <Link
        to="/admin/ranking"
        className={path.startsWith("/admin/ranking") ? "active" : ""}
      >
        레벨순위
      </Link>

      <Link
        to="/admin/community"
        className={
          path.startsWith("/admin/community") ||
          path.startsWith("/admin/community/detail")
            ? "active"
            : ""
        }
      >
        공지 및 문의
      </Link>
    </nav>
  );
}

export default AdminHeader2;

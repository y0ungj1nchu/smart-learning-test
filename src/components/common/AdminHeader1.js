import React from "react";
import { useNavigate } from "react-router-dom";
import "./Header1.css";
import adminIcon from "../../assets/basicUser.png"

function AdminHeader1() {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/admin/main");
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("role");
    navigate("/home/before");
  };

  const handleProfileClick = () => {
    navigate("/admin/profile");
  };

  return (
    <header className="header1">
      {/* 로고 */}
      <div className="logo" onClick={handleLogoClick}>
        스마트 학습 도우미
      </div>

      {/* 메뉴 */}
      <nav className="menu">
        <button className="menu-btn gray" onClick={handleLogout}>
          로그아웃
        </button>
        <img
          src={adminIcon}
          alt="admin"
          className="user-icon"
          onClick={handleProfileClick}
        />
      </nav>
    </header>
  );
}

export default AdminHeader1;

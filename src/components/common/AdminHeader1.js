import React, { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./Header1.css";
import adminIcon from "../../assets/basicUser.png";
import { Bell } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";

function AdminHeader1({ onOpenProfile, onOpenSetting, onOpenNotification }) {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [open, setOpen] = useState(false);

  // AuthContext 사용
  const { user, role, logout, authLoaded } = useContext(AuthContext);

  // 로딩 전에 렌더링 방지
  if (!authLoaded) return null;

  // ADMIN이 아니면 헤더 숨김
  if (!user || role !== "ADMIN") return null;

  const handleLogoClick = () => navigate("/admin/main");

  const handleToggleDropdown = () => setOpen((prev) => !prev);

  // 외부 클릭 시 드롭다운 닫기

  // 로그아웃
  const handleLogout = () => {
    logout();
    navigate("/home/before");
    setOpen(false);
  };

  return (
    <header className="header1">
      {/* 로고 */}
      <div className="logo" onClick={handleLogoClick}>
        스마트 학습 도우미
      </div>

      {/* 메뉴 */}
      <nav className="menu" ref={dropdownRef}>
        <Bell
          size={22}
          className="alarm-icon"
          onClick={() =>
            onOpenNotification
              ? onOpenNotification()
              : navigate("/admin/profile?tab=notification")
          }
        />

        <img
          src={adminIcon}
          alt="admin"
          className="user-icon"
          onClick={handleToggleDropdown}
        />

        {open && (
          <div className="dropdown-menu">
            <p
              onClick={() => {
                onOpenProfile
                  ? onOpenProfile()
                  : navigate("/admin/profile");
                setOpen(false);
              }}
            >
              프로필
            </p>

            <p
              onClick={() => {
                onOpenSetting
                  ? onOpenSetting()
                  : navigate("/admin/profile?tab=setting");
                setOpen(false);
              }}
            >
              설정
            </p>

            <p onClick={handleLogout}>로그아웃</p>
          </div>
        )}
      </nav>
    </header>
  );
}

export default AdminHeader1;

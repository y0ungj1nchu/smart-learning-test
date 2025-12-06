import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Header1.css";
import userIcon from "../../assets/basicUser.png";
import { Bell } from "lucide-react";
import { useAuth } from "../../context/useAuth";  // 🔥 AuthContext 사용

function Header1({
  onOpenProfile,
  onOpenSetting,
  onOpenNotification,
}) {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [open, setOpen] = useState(false);

  const { user, role, logout } = useAuth(); // 🔥 Context에서 로그인 상태/role 가져오기

  // 실제 로그인 여부 판별
  const loggedIn = Boolean(user);

  // 로고 클릭 시 이동
  const handleLogoClick = () => {
    if (loggedIn) navigate("/home/after");
    else navigate("/home/before");
  };

  const handleToggleDropdown = () => setOpen(!open);

  // 드롭다운 외부 클릭 감지
  useEffect(() => {
    const clickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, []);

  // 🔥 로그아웃 (AuthContext logout() 사용)
  const handleLogout = () => {
    logout();               // Context로 상태 초기화 + localStorage 초기화
    setOpen(false);
    navigate("/home/before");
  };

  // 🔥 관리자 헤더 숨김
  if (role && role.toUpperCase() === "ADMIN") return null;

  return (
    <header className="header1">
      <div className="logo" onClick={handleLogoClick}>
        스마트 학습 도우미
      </div>

      <nav className="menu" ref={dropdownRef}>
        {loggedIn ? (
          <>
            <Bell
              size={22}
              className="alarm-icon"
              onClick={() => {
                if (onOpenNotification) onOpenNotification();
                else navigate("/user/profile/view?tab=notification");
              }}
            />

            <img
              src={userIcon}
              alt="user"
              className="user-icon"
              onClick={handleToggleDropdown}
            />

            {open && (
              <div className="dropdown-menu">
                <p
                  onClick={() => {
                    if (onOpenProfile) onOpenProfile();
                    else navigate("/user/profile/view?tab=profile");
                    setOpen(false);
                  }}
                >
                  프로필
                </p>

                <p
                  onClick={() => {
                    if (onOpenSetting) onOpenSetting();
                    else navigate("/user/profile/view?tab=setting");
                    setOpen(false);
                  }}
                >
                  설정
                </p>

                <p onClick={handleLogout}>로그아웃</p>
              </div>
            )}
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

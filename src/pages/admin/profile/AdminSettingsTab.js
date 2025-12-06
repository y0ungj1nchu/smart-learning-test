import React, { useState, useContext, useEffect } from "react";
import "../../../styles/profile/Tabs.css";
import { Bell } from "lucide-react";
import { ThemeContext } from "../../../context/ThemeContext";

function AdminSettingsTab() {
  const [isAllowed, setIsAllowed] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(null);

  const { themeColor, applyTheme } = useContext(ThemeContext);

  const themes = [
    "#BFC0C4", "#F9C4C4", "#FFC1E7", "#FFEEB5",
    "#6C7A89", "#D9C9D9", "#BFD6ED", "#C1FFCE",
  ];

  // ❗ 현재 테마 불러와 선택 표시
  useEffect(() => {
    if (themeColor) {
      setSelectedTheme(themeColor);
    }
  }, [themeColor]);

  const toggleNotification = () => setIsAllowed(prev => !prev);

  const handleThemeSelect = (color) => {
    setSelectedTheme(color);
    applyTheme(color); // ⭐ ThemeContext → CSS + DB 저장
  };

  return (
    <div className="tab-inner setting-tab">
      <h3>관리자 알림 설정</h3>

      <div className="setting-card">
        <div className="setting-item">
          <div className="setting-label">
            <Bell size={18} />
            <span>관리자 알림 수신 동의</span>
          </div>

          <div
            className={`toggle-switch ${isAllowed ? "on" : ""}`}
            onClick={toggleNotification}
          >
            <div className={`toggle-circle ${isAllowed ? "on" : ""}`} />
          </div>
        </div>
      </div>

      {/* 테마 색 변경 */}
      <h3>테마 색 변경</h3>

      <div className="theme-card">
        <div className="theme-grid">
          {themes.map((color, idx) => (
            <div
              key={idx}
              className={`theme-box ${selectedTheme === color ? "selected" : ""}`}
              style={{ backgroundColor: color }}
              onClick={() => handleThemeSelect(color)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminSettingsTab;

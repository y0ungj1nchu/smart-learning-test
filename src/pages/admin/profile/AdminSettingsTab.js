import React, { useState } from "react";
import "../../../styles/profile/Tabs.css";
import { Bell } from "lucide-react";

function AdminSettingTab() {
  const [isAllowed, setIsAllowed] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState("#9CA2AE");

  const themes = [
    "#BFC0C4", "#F9C4C4", "#FFE5C1", "#FFF9BF",
    "#6C7A89", "#D9C9D9", "#E6F2F8", "#BFEDE0",
  ];

  const toggleNotification = () => {
    setIsAllowed((prev) => !prev);
  };

  const handleThemeSelect = (color) => {
    setSelectedTheme(color);
    document.body.style.backgroundColor = color + "20";  
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
              className={`theme-box ${
                selectedTheme === color ? "selected" : ""
              }`}
              style={{ backgroundColor: color }}
              onClick={() => handleThemeSelect(color)}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminSettingTab;

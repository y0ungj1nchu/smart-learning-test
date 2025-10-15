import React, { useState } from "react";
import "../../../../styles/profile/Tabs.css";
import { Bell } from "lucide-react";

function SettingTab() {
  const [isAllowed, setIsAllowed] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState("#9CA2AE");

  const themes = [
    "#BFC0C4", // 회색
    "#F9C4C4", // 핑크
    "#FFE5C1", // 살구
    "#FFF9BF", // 연노랑
    "#6C7A89", // 남색
    "#D9C9D9", // 연보라
    "#E6F2F8", // 하늘
    "#BFEDE0", // 민트
  ];

  const toggleNotification = () => {
    setIsAllowed((prev) => !prev);
  };

  const handleThemeSelect = (color) => {
    setSelectedTheme(color);
    document.body.style.backgroundColor = color + "20"; // 투명하게 배경 반영
  };

  return (
    <div className="tab-inner setting-tab">
      {/* 알림 설정 */}
      <h3>알림 설정</h3>
      <div className="setting-card">
        <div className="setting-item">
          <div className="setting-label">
            <Bell size={18} />
            <span>알림 수신 동의</span>
          </div>

          <div className="toggle-switch" onClick={toggleNotification}>
            <div className={`toggle-circle ${isAllowed ? "on" : ""}`}></div>
            <span className="toggle-text">{isAllowed ? "ON" : "OFF"}</span>
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

export default SettingTab;

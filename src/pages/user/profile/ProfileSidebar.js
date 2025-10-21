import React from "react";
import "../../../styles/profile/ProfileView.css";
import { User, Settings, Bell } from "lucide-react";

function ProfileSidebar({ activeTab, setActiveTab }) {
  return (
    <div className="profile-sidebar">
      <p className="sidebar-title">내 정보</p>
      <ul>
        <li
          className={activeTab === "profile" ? "active" : ""}
          onClick={() => setActiveTab("profile")}
        >
          <User size={16} /> 프로필
        </li>

        <li
          className={activeTab === "setting" ? "active" : ""}
          onClick={() => setActiveTab("setting")}
        >
          <Settings size={16} /> 설정
        </li>

        <li
          className={activeTab === "notification" ? "active" : ""}
          onClick={() => setActiveTab("notification")}
        >
          <Bell size={16} /> 알림
          <span className="new-badge">New</span>
        </li>
      </ul>
    </div>
  );
}

export default ProfileSidebar;

import React from "react";
import "../../../styles/profile/ProfileView.css";
import { User, Settings, Bell, MessageSquare, FileText } from "lucide-react";

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

        <li
          className={activeTab === "faq" ? "active" : ""}
          onClick={() => setActiveTab("faq")}
        >
          <MessageSquare size={16} /> 1:1 문의 및 FAQ
        </li>

        <li
          className={activeTab === "notice" ? "active" : ""}
          onClick={() => setActiveTab("notice")}
        >
          <FileText size={16} /> 공지사항
        </li>
      </ul>
    </div>
  );
}

export default ProfileSidebar;

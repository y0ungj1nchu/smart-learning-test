import React from "react";
import "../../../styles/profile/ProfileView.css";
import { User, Settings } from "lucide-react";

function AdminSidebar({ activeTab, goToTab }) {
  return (
    <div className="profile-sidebar">
      <p className="sidebar-title">관리자 설정</p>
      <ul>
        <li
          className={activeTab === "profile" ? "active" : ""}
          onClick={() => goToTab("profile")}
        >
          <User size={16} /> 프로필
        </li>

        <li
          className={activeTab === "setting" ? "active" : ""}
          onClick={() => goToTab("setting")}
        >
          <Settings size={16} /> 설정
        </li>
      </ul>
    </div>
  );
}

export default AdminSidebar;

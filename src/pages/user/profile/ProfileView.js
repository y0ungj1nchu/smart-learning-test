import React, { useState, useEffect } from "react";
import "../../../styles/profile/ProfileView.css";
import Header1 from "../../../components/common/Header1";
import ProfileSidebar from "./ProfileSidebar";
import ProfileTab from "./tabs/ProfileTab";
import PasswordTab from "./tabs/PasswordTab";
import NotificationTab from "./tabs/NotificationTab";
import SettingsTab from "./tabs/SettingsTab";
import FaqQnaTab from "./tabs/FaqQnaTab";
import NoticeTab from "./tabs/NoticeTab";

function ProfileView() {
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loginStatus = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loginStatus);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <ProfileTab
            onNavigatePassword={() => setActiveTab("password")}
            setActiveTab={setActiveTab}
          />
        );
      case "password":
        return <PasswordTab onBack={() => setActiveTab("profile")} />;
      case "setting":
        return <SettingsTab setActiveTab={setActiveTab} />;
      case "notification":
        return <NotificationTab setActiveTab={setActiveTab} />;
      case "faq":
        return <FaqQnaTab setActiveTab={setActiveTab} />;
      case "notice":
        return <NoticeTab setActiveTab={setActiveTab} />;
      default:
        return <ProfileTab setActiveTab={setActiveTab} />;
    }
  };

  return (
    <>
      {/* 상단 헤더만 표시 */}
      <Header1 isLoggedIn={isLoggedIn} />

      <div className="profile-container">
        {/* 왼쪽 사이드 */}
        <ProfileSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* 오른쪽 본문 */}
        <div className="profile-content">{renderContent()}</div>
      </div>
    </>
  );
}

export default ProfileView;

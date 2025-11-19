import React, { useState, useEffect } from "react";
import "../../../styles/profile/ProfileView.css";
import "../../../styles/profile/Tabs.css";
import AdminHeader1 from "../../../components/common/AdminHeader1";
import AdminHeader2 from "../../../components/common/AdminHeader2";
import ProfileSidebar from "../../user/profile/ProfileSidebar";
import PasswordTab from "../../user/profile/tabs/PasswordTab";
import AdminProfileTab from "./AdminProfileTab";
import AdminNotificationTab from "./AdminNotificationTab";
import AdminSettingsTab from "./AdminSettingsTab";

export default function AdminProfilePage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  useEffect(() => {
    const loginStatus = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loginStatus);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <AdminProfileTab onNavigatePassword={() => setActiveTab("password")} />;
      case "password":
        return <PasswordTab onBack={() => setActiveTab("profile")} />;
      case "setting":
        return <AdminSettingsTab setActiveTab={setActiveTab} />;
      case "notification":
        return <AdminNotificationTab />;
      default:
        return <AdminProfileTab />;
    }
  };

  return (
    <>
      <AdminHeader1 />
      <AdminHeader2 isLoggedIn={isLoggedIn} />

      <div className="profile-wrapper">
        <aside className="profile-sidebar-container">
          <ProfileSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </aside>

        <main className="profile-main-content">{renderContent()}</main>
      </div>
    </>
  );
}

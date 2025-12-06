import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../../styles/profile/ProfileView.css";
import "../../../styles/profile/Tabs.css";

import AdminHeader1 from "../../../components/common/AdminHeader1";
import AdminHeader2 from "../../../components/common/AdminHeader2";

import AdminSidebar from "./AdminSidebar";
import AdminProfileTab from "./AdminProfileTab";
import AdminNotificationTab from "./AdminNotificationTab";
import AdminSettingsTab from "./AdminSettingsTab";
import AdminPasswordTab from "./AdminPasswordTab";

export default function AdminProfilePage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("profile");
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // 로그인 상태 확인
  useEffect(() => {
    const loginStatus = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loginStatus);
  }, []);

  // URL 변화 감지 → 탭 자동 반영
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get("tab");

    if (tabParam === "notification") setActiveTab("notification");
    else if (tabParam === "password") setActiveTab("password");
    else if (tabParam === "setting") setActiveTab("setting");
    else setActiveTab("profile");

  }, [location.search]);

  // 탭 이동 공통 함수
  const goToTab = (tabName) => {
    if (tabName === "profile") {
      navigate("/admin/profile");
    } else {
      navigate(`/admin/profile?tab=${tabName}`);
    }
  };

  // 탭에 따라 내용 반환
  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <AdminProfileTab onNavigatePassword={() => goToTab("password")} />;
      case "password":
        return <AdminPasswordTab goToTab={goToTab} />;
      case "setting":
        return <AdminSettingsTab />;
      case "notification":
        return <AdminNotificationTab />;
      default:
        return <AdminProfileTab onNavigatePassword={() => goToTab("password")} />;
    }
  };

  return (
    <>
      <AdminHeader1
        isLoggedIn={isLoggedIn}
        onOpenProfile={() => goToTab("profile")}
        onOpenSetting={() => goToTab("setting")}
        onOpenNotification={() => goToTab("notification")}
      />

      <AdminHeader2 isLoggedIn={isLoggedIn} />

      <div
        className="page-content"
        style={{
          paddingTop: "93px",
          minHeight: "calc(100vh - 93px)",
          boxSizing: "border-box",
        }}
      >
        <div className="profile-wrapper">

          {/* 알림 탭일 때는 Sidebar 감추고 가운데 정렬 */}
          {activeTab !== "notification" && (
            <aside className="profile-sidebar-container">
              <AdminSidebar activeTab={activeTab} goToTab={goToTab} />
            </aside>
          )}

          {/* 메인 콘텐츠 영역 */}
          <main
            className="profile-main-content"
            style={
              activeTab === "notification"
                ? { width: "100%", maxWidth: "600px", margin: "0 auto" }
                : {}
            }
          >
            {renderContent()}
          </main>
        </div>
      </div>
    </>
  );
}

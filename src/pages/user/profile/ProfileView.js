import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../../styles/profile/ProfileView.css";
import Header1 from "../../../components/common/Header1";
import Header2 from "../../../components/common/Header2";
import ProfileSidebar from "./ProfileSidebar";
import ProfileTab from "./tabs/ProfileTab";
import PasswordTab from "./tabs/PasswordTab";
import NotificationTab from "./tabs/NotificationTab";
import SettingsTab from "./tabs/SettingsTab";

function ProfileView() {
  const location = useLocation();
  const navigate = useNavigate();

  // URL에서 tab 값을 읽기
  const getTabFromURL = useCallback(() => {
    const params = new URLSearchParams(location.search);
    return params.get("tab") || "profile";
  }, [location.search]);

  const [activeTab, setActiveTab] = useState(getTabFromURL());
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 🔄 URL 변경 시 activeTab 업데이트
  useEffect(() => {
    setActiveTab(getTabFromURL());
  }, [location.search, getTabFromURL]);

  // 로그인 여부 확인
  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
  }, []);

  // 📌 공통 탭 이동 함수
  const goToTab = (tabName) => {
    navigate(`/user/profile/view?tab=${tabName}`);
    setActiveTab(tabName); // 즉시 UI 반영
  };

  // 📌 탭별 렌더링
  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <ProfileTab
            onNavigatePassword={() => goToTab("password")}
            setActiveTab={setActiveTab}
          />
        );
      case "password":
        return <PasswordTab onBack={() => goToTab("profile")} />;
      case "setting":
        return <SettingsTab setActiveTab={setActiveTab} />;
      case "notification":
        return <NotificationTab />;
      default:
        return <ProfileTab setActiveTab={setActiveTab} />;
    }
  };

  const isNotification = activeTab === "notification";

  return (
    <>
      <Header1
        isLoggedIn={isLoggedIn}
        onOpenProfile={() => goToTab("profile")}
        onOpenSetting={() => goToTab("setting")}
        onOpenNotification={() => goToTab("notification")}
      />

      <Header2 isLoggedIn={isLoggedIn} />

      <div className="page-content" style={{ paddingTop: "93px" }}>
        <div
          className="profile-wrapper"
          style={
            isNotification
              ? { display: "flex", justifyContent: "center" }
              : {}
          }
        >
          {/* 알림일 때는 사이드바 숨김 */}
          {!isNotification && (
            <aside className="profile-sidebar-container">
              <ProfileSidebar
                activeTab={activeTab}
                goToTab={goToTab}   // ⬅️ 수정 완료
              />
            </aside>
          )}

          <main
            className="profile-main-content"
            style={
              isNotification
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

export default ProfileView;

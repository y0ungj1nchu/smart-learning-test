import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../../../styles/community/Community.css";
import "../../../styles/community/Tabs.css";
import Header1 from "../../../components/common/Header1";
import Header2 from "../../../components/common/Header2";
import FaqQnaTab from "./tabs/FaqQnaTab";
import NoticeTab from "./tabs/NoticeTab";

function CommunityPage() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("faq");

  useEffect(() => {
    if (location.state?.defaultTab === "notice") {
      setActiveTab("notice");
    }
  }, [location.state]);

  const renderContent = () => {
    switch (activeTab) {
      case "faq":
        return <FaqQnaTab />;
      case "notice":
        return <NoticeTab />;
      default:
        return <FaqQnaTab />;
    }
  };

  return (
    <>
      {/* 상단 헤더 */}
      <Header1 isLoggedIn={true} />
      <Header2 isLoggedIn={true} />

      {/* 전체 배경 + 영역 */}
      <div className="community-wrapper">
        {/* 왼쪽 사이드바 */}
        <div className="community-sidebar-container">
          <div className="profile-sidebar">
            <p className="sidebar-title">커뮤니티</p>
            <ul>
              <li
                className={activeTab === "faq" ? "active" : ""}
                onClick={() => setActiveTab("faq")}
              >
                FAQ & 1:1 문의
              </li>
              <li
                className={activeTab === "notice" ? "active" : ""}
                onClick={() => setActiveTab("notice")}
              >
                공지사항
              </li>
            </ul>
          </div>
        </div>

        {/* 오른쪽 탭 콘텐츠 */}
        <div className="community-main-content">{renderContent()}</div>
      </div>
    </>
  );
}

export default CommunityPage;

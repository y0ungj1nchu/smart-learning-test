import React, { useState } from "react";
import "../../../styles/profile/ProfileView.css";
import Header1 from "../../../components/common/Header1";
import Header2 from "../../../components/common/Header2";
import FaqQnaTab from "./tabs/FaqQnaTab";
import NoticeTab from "./tabs/NoticeTab";

function CommunityPage() {
  const [activeTab, setActiveTab] = useState("faq");

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
      <div className="profile-container">
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

        <div className="profile-content">{renderContent()}</div>
      </div>
    </>
  );
}

export default CommunityPage;

import React, { useState } from "react";
import "../../styles/community/Community.css";
import "../../styles/community/Tabs.css";

import AdminHeader1 from "../../components/common/AdminHeader1";
import AdminHeader2 from "../../components/common/AdminHeader2";

import AdminFaqTab from "./adminTabs/AdminFaqTab";
import AdminNoticeTab from "./adminTabs/AdminNoticeTab";
import AdminQnaTab from "./adminTabs/AdminQnaTab";

export default function AdminCommunity() {
  const [activeTab, setActiveTab] = useState("faq");

  const renderContent = () => {
    switch (activeTab) {
      case "faq":
        return <AdminFaqTab />;
      case "notice":
        return <AdminNoticeTab />;
      case "qna":
        return <AdminQnaTab />;
      default:
        return <AdminFaqTab />;
    }
  };

  return (
    <>
      <AdminHeader1 isLoggedIn={true} />
      <AdminHeader2 isLoggedIn={true} />

      <div className="community-wrapper">
        <div className="community-sidebar-container">
          <div className="profile-sidebar">
            <p className="sidebar-title">관리자 커뮤니티</p>
            <ul>
              <li className={activeTab === "notice" ? "active" : ""} onClick={() => setActiveTab("notice")}>
                공지사항 관리
              </li>
              <li className={activeTab === "faq" ? "active" : ""} onClick={() => setActiveTab("faq")}>
                FAQ 관리
              </li>
              <li className={activeTab === "qna" ? "active" : ""} onClick={() => setActiveTab("qna")}>
                1:1 문의 답변
              </li>
            </ul>
          </div>
        </div>

        <div className="community-main-content">{renderContent()}</div>
      </div>
    </>
  );
}

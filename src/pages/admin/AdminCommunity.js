import React, { useState, useEffect } from "react";
import "../../styles/community/Community.css";
import "../../styles/community/Tabs.css";

import { useLocation } from "react-router-dom";

import AdminHeader1 from "../../components/common/AdminHeader1";
import AdminHeader2 from "../../components/common/AdminHeader2";

import AdminFaqTab from "./adminTabs/AdminFaqTab";
import AdminNoticeTab from "./adminTabs/AdminNoticeTab";
import AdminQnaTab from "./adminTabs/AdminQnaTab";

export default function AdminCommunity() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const qnaId = params.get("qna");

  const [activeTab, setActiveTab] = useState(qnaId ? "qna" : "notice");

  const renderContent = () => {
    switch (activeTab) {
      case "notice":
        return <AdminNoticeTab />;
      case "faq":
        return <AdminFaqTab />;
      case "qna":
        return <AdminQnaTab initialSelectId={qnaId} />;
      default:
        return <AdminFaqTab />;
    }
  };

  return (
    <>
      <AdminHeader1 isLoggedIn={true} />
      <AdminHeader2 isLoggedIn={true} />
      <div className="page-content" style={{ paddingTop: "93px", minHeight: "calc(100vh - 93px)", boxSizing: "border-box" }}>
      <div className="community-wrapper">
        <div className="community-sidebar-container">
          <div className="profile-sidebar">
            <p className="sidebar-title">공지 및 문의관리</p>
            <ul>
              <li
                className={activeTab === "notice" ? "active" : ""}
                onClick={() => setActiveTab("notice")}
              >
                공지사항 관리
              </li>
              <li
                className={activeTab === "faq" ? "active" : ""}
                onClick={() => setActiveTab("faq")}
              >
                FAQ 관리
              </li>
              <li
                className={activeTab === "qna" ? "active" : ""}
                onClick={() => setActiveTab("qna")}
              >
                1:1 문의 답변
              </li>
            </ul>
          </div>
        </div>

        <div className="community-main-content">{renderContent()}</div>
      </div>
      </div>
    </>
  );
}

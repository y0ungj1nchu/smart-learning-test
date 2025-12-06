import React from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import "../../../styles/community/Community.css";
import "../../../styles/community/Tabs.css";

import Header1 from "../../../components/common/Header1";
import Header2 from "../../../components/common/Header2";

import FaqQnaTab from "./tabs/FaqQnaTab";
import NoticeTab from "./tabs/NoticeTab";
import NoticeDetail from "./tabs/NoticeDetail";

function CommunityPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const getActiveTab = () => {
  if (location.pathname.includes("notice-detail")) return "notice";
  if (location.pathname.includes("notice")) return "notice";

  // FAQ 경로일 때만 faq 활성화
  if (location.pathname.includes("/user/community")) return "faq";

  return "notice";   // 기본탭: 공지사항
};

  const activeTab = getActiveTab();

  return (
    <>
      <Header1 isLoggedIn={true} />
      <Header2 isLoggedIn={true} />
      <div className="page-content" style={{ paddingTop: "93px", minHeight: "calc(100vh-93px)", boxSizing: "border-box", }}>
        <div className="community-wrapper">

          {/* 사이드바 */}
          <div className="community-sidebar-container">
            <div className="profile-sidebar">
              <p className="sidebar-title">커뮤니티</p>
              <ul>
                <li
                  className={activeTab === "notice" ? "active" : ""}
                  onClick={() => navigate("/user/community/notice")}
                >
                  공지사항
                </li>

                <li
                  className={activeTab === "faq" ? "active" : ""}
                  onClick={() => navigate("/user/community")}
                >
                  FAQ & 1:1 문의
                </li>
              </ul>
            </div>
          </div>

          {/* 오른쪽 메인 영역 */}
          <div className="community-main-content">
            <Routes>
              <Route path="" element={<navigate to="notice" replace />} />
              <Route index element={<FaqQnaTab />} />
              <Route path="notice" element={<NoticeTab />} />
              <Route path="notice-detail/:id" element={<NoticeDetail />} />
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
}

export default CommunityPage;

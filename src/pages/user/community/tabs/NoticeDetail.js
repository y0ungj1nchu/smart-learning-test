import React from "react";
import "../../../../styles/profile/Tabs.css";
import { useLocation, useNavigate } from "react-router-dom";
import Header1 from "../../../../components/common/Header1";
import ProfileSidebar from "../../profile/ProfileSidebar";

function NoticeDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const { title, content, time } = location.state || {};

  const handleBack = () => {
    navigate("/user/profile/view", { state: { tab: "notice" } });
  };


  return (
    <>
      {/* 상단 헤더 */}
      <Header1 isLoggedIn={true} />

      <div className="profile-container">
        {/* 왼쪽 사이드바 */}
        <ProfileSidebar activeTab="notice" setActiveTab={() => {}} />

        {/* 본문 내용 */}
        <div className="profile-content">
          <div className="notice-detail">
            <h2>{title || "공지사항"}</h2>
            <hr />
            <p className="notice-content">
              {content || "공지 내용을 불러올 수 없습니다."}
            </p>

            <div className="notice-footer">
              <span className="notice-time">{time || "작성일 미표시"}</span>
              <div className="nav-links">
                <span onClick={() => navigate(-1)}>{"< 이전글"}</span>
                <span
                  onClick={() =>
                    navigate("/user/profile/view", { state: { tab: "notice" } })
                  }
                >
                  {"다음글 >"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default NoticeDetail;

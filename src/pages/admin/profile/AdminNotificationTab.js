import React, { useState } from "react";
import "../../../styles/profile/Tabs.css";

function AdminNotificationTab() {
  const [notifications] = useState([
    {
      id: 1,
      time: "10분 전",
      title: "새로운 신고가 접수되었습니다.",
      content:
        "사용자 'testuser1'이 부적절한 게시글을 신고했습니다. 커뮤니티 > 신고 관리에서 확인해주세요.",
    },
    {
      id: 2,
      time: "1시간 전",
      title: "FAQ 수정 요청이 등록되었습니다.",
      content:
        "회원이 FAQ 항목 중 ‘비밀번호 변경’에 대한 수정 요청을 보냈습니다. 관리자 페이지에서 검토해주세요.",
    },
    {
      id: 3,
      time: "3시간 전",
      title: "시스템 점검 로그가 기록되었습니다.",
      content:
        "서버 응답 시간이 일시적으로 증가했습니다. 시스템 로그 페이지에서 자세히 확인할 수 있습니다.",
    },
    {
      id: 4,
      time: "6시간 전",
      title: "새 공지사항이 업로드되었습니다.",
      content:
        "관리자 ‘admin02’님이 새로운 공지사항을 등록했습니다. 공지사항 페이지에서 확인할 수 있습니다.",
    },
  ]);

  const [selectedId, setSelectedId] = useState(null);

  const handleClick = (id) => {
    setSelectedId(selectedId === id ? null : id);
  };

  return (
    <div className="tab-inner notification-tab">
      <h3>관리자 알림</h3>

      <div className="notification-list">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`notification-item ${selectedId === n.id ? "open" : ""}`}
            onClick={() => handleClick(n.id)}
          >
            <div className="notification-header">
              <div className="notification-time">{n.time}</div>
              <div className="notification-title">{n.title}</div>
            </div>

            {selectedId === n.id && (
              <div className="notification-content">{n.content}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminNotificationTab;

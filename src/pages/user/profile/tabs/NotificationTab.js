import React, { useState } from "react";
import "../../../../styles/profile/Tabs.css";

function NotificationTab() {
  const [notifications] = useState([
    {
      id: 1,
      time: "1시간 전",
      title: "캐릭터 레벨이 업그레이드 되었습니다.",
      content: "축하합니다! 캐릭터의 레벨이 9에서 10으로 상승했습니다. 더 많은 공부로 캐릭터를 성장시켜보세요!",
    },
    {
      id: 2,
      time: "3시간 전",
      title: "순공시간 5시간 달성",
      content: "오늘 순공시간이 5시간을 돌파했습니다. 꾸준한 학습 습관이 쌓이고 있어요!",
    },
    {
      id: 3,
      time: "5시간 전",
      title: "이달의 이벤트가 게시판에 공유되었습니다.",
      content: "새로운 이벤트가 열렸습니다! 지금 바로 ‘커뮤니티 → 이벤트’ 페이지에서 확인해보세요.",
    },
    {
      id: 4,
      time: "7시간 전",
      title: "1:1 문의에 답변이 등록되었습니다.",
      content: "문의하신 ‘로그인 오류 관련’ 내용에 대한 답변이 등록되었습니다. 내 정보 > 1:1 문의 탭에서 확인 가능합니다.",
    },
  ]);

  const [selectedId, setSelectedId] = useState(null);

  const handleClick = (id) => {
    setSelectedId(selectedId === id ? null : id);
  };

  return (
    <div className="tab-inner notification-tab">
      <h3>알림</h3>

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

export default NotificationTab;

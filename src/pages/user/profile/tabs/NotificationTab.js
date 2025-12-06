import React, { useState, useEffect } from "react";
import "../../../../styles/profile/Tabs.css";

import {
  getNotifications,   // 알림 목록 GET
  readNotification,   // 알림 읽음 처리 PATCH
} from "../../../../utils/api";

function NotificationTab() {
  const [notifications, setNotifications] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  /* ---------------------------------------
      1) 알림 불러오기
  --------------------------------------- */
  const loadNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error("알림 불러오기 실패:", err);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  /* ---------------------------------------
      2) 알림 클릭 → UI 펼치기 + 읽음 처리
  --------------------------------------- */
  const handleClick = async (item) => {
    const id = item.id;

    // 클릭하면 펼치기/닫기
    setSelectedId(selectedId === id ? null : id);

    // 이미 읽은 알림이면 처리 X
    if (item.isRead) return;

    try {
      await readNotification(id);
      loadNotifications(); // 상태 갱신
    } catch (e) {
      console.error("읽음 처리 실패:", e);
    }
  };

  return (
    <div className="tab-inner notification-tab">
      <div className="notification-list">

        {notifications.length === 0 && (
          <p className="empty-text">알림이 없습니다.</p>
        )}

        {notifications.map((n) => (
          <div
            key={n.id}
            className={`notification-item ${selectedId === n.id ? "open" : ""}`}
            onClick={() => handleClick(n)}
          >
            {/* 알림 기본 헤더 */}
            <div className="notification-header">
              <div className="notification-time">
                {new Date(n.createdAt).toLocaleString("ko-KR")}
              </div>
              <div className="notification-title">{n.title}</div>
            </div>

            {/* 펼쳐진 내용 */}
            {selectedId === n.id && (
              <div className="notification-content">{n.message}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default NotificationTab;

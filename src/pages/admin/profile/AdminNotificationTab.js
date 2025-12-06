import React, { useState, useEffect } from "react";
import "../../../styles/profile/Tabs.css";
import { getAdminNotifications } from "../../../utils/api";

function AdminNotificationTab() {
  const [notifications, setNotifications] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  // 🔹 알림 불러오기
  const loadNotifications = async () => {
    try {
      const data = await getAdminNotifications();
      setNotifications(data);
    } catch (err) {
      console.error("관리자 알림 불러오기 실패:", err);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  // 🔹 클릭하면 펼침
  const handleClick = (id) => {
    setSelectedId(selectedId === id ? null : id);
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
            onClick={() => handleClick(n.id)}
          >
            <div className="notification-header">
              <div className="notification-time">
                {new Date(n.createdAt).toLocaleString("ko-KR")}
              </div>
              <div className="notification-title">{n.title}</div>
            </div>

            {selectedId === n.id && (
              <div className="notification-content">{n.message}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminNotificationTab;

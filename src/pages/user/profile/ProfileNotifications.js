import React from "react";
import "../../styles/common.css";

function ProfileNotifications() {
  return (
    <div className="container">
      <div className="card">
        <h2>알림 설정</h2>
        <label>
          <input type="checkbox" /> 이메일 알림
        </label>
        <label>
          <input type="checkbox" /> 푸시 알림
        </label>
      </div>
    </div>
  );
}

export default ProfileNotifications;

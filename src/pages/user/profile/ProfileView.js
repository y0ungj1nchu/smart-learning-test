import React from "react";
import "../../styles/common.css";

function ProfileView() {
  return (
    <div className="container">
      <div className="card">
        <h2>내 프로필</h2>
        <p>닉네임: 사용자1</p>
        <p>이메일: user@example.com</p>
      </div>
    </div>
  );
}

export default ProfileView;

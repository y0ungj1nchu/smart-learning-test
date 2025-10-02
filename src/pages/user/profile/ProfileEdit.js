import React from "react";
import "../../styles/common.css";

function ProfileEdit() {
  return (
    <div className="container">
      <div className="card">
        <h2>프로필 수정</h2>
        <input placeholder="닉네임 변경" />
        <input placeholder="비밀번호 변경" type="password" />
        <button>수정하기</button>
      </div>
    </div>
  );
}

export default ProfileEdit;

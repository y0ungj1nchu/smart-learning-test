import React from "react";
import "../../styles/common.css";

function ProfileInquiry() {
  return (
    <div className="container">
      <div className="card">
        <h2>1:1 문의</h2>
        <textarea placeholder="문의 내용을 입력하세요." rows="5"></textarea>
        <button>문의하기</button>
      </div>
    </div>
  );
}

export default ProfileInquiry;

import React, { useState } from "react";
import "../../../styles/profile/Tabs.css";

export default function AdminPasswordTab({ goToTab }) {
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");

  const adminSavedPw = localStorage.getItem("adminPw") || "admin1234";

  const handleChangePassword = (e) => {
    e.preventDefault();

    if (!currentPw || !newPw || !confirmPw) {
      alert("모든 입력란을 작성해주세요.");
      return;
    }

    if (currentPw !== adminSavedPw) {
      alert("현재 비밀번호가 일치하지 않습니다.");
      return;
    }

    if (newPw.length < 6) {
      alert("새 비밀번호는 최소 6자 이상이어야 합니다.");
      return;
    }

    if (newPw !== confirmPw) {
      alert("새 비밀번호가 서로 일치하지 않습니다.");
      return;
    }

    localStorage.setItem("adminPw", newPw);
    alert("관리자 비밀번호가 변경되었습니다.");

    // 프로필 탭으로 이동
    goToTab("profile");
  };

  const handleCancel = () => {
    goToTab("profile");
  };

  return (
    <div className="tab-inner profile-main">
      <div className="password-box">
        <h2>비밀번호 변경</h2>

        <div className="pw-row">
          <label>현재 비밀번호</label>
          <input
            type="password"
            value={currentPw}
            onChange={(e) => setCurrentPw(e.target.value)}
          />
        </div>

        <div className="pw-row">
          <label>새 비밀번호</label>
          <input
            type="password"
            value={newPw}
            onChange={(e) => setNewPw(e.target.value)}
          />
        </div>

        <div className="pw-row">
          <label>비밀번호 확인</label>
          <input
            type="password"
            value={confirmPw}
            onChange={(e) => setConfirmPw(e.target.value)}
          />
        </div>

        <div className="pw-btns">
          <button className="gray-btn" onClick={handleChangePassword}>
            변경
          </button>
          <button className="gray-btn" onClick={handleCancel}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
}

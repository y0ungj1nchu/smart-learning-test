import React, { useState } from "react";
import "../../../../styles/profile/Tabs.css";

function PasswordTab({ onBack }) {
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!currentPw || !newPw || !confirmPw) {
      alert("모든 항목을 입력해주세요");
      return;
    }
    if (newPw !== confirmPw) {
      alert("새 비밀번호가 일치하지 않습니다");
      return;
    }

    alert("비밀번호가 성공적으로 변경되었습니다");
    setCurrentPw("");
    setNewPw("");
    setConfirmPw("");
    onBack();
  };

  return (
    <div className="tab-inner password-main">
      <h3>비밀번호 변경</h3>

      <form onSubmit={handleSubmit} className="password-box">
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
          <label>새 비밀번호 확인</label>
          <input
            type="password"
            value={confirmPw}
            onChange={(e) => setConfirmPw(e.target.value)}
          />
        </div>

        <div className="pw-btns">
          <button type="submit" className="yellow-btn">변경</button>
          <button type="button" className="gray-btn" onClick={onBack}>
            취소
          </button>
        </div>
      </form>
    </div>
  );
}

export default PasswordTab;

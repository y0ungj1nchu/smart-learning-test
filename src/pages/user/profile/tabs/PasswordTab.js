import React, { useState, useEffect } from "react";
import "../../../../styles/profile/Tabs.css";

function PasswordTab({ onBack }) {
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [savedPw, setSavedPw] = useState("1234"); //기본 비밀번호

  // localStorage에서 기존 비밀번호 불러오기
  useEffect(() => {
    const storedPw = localStorage.getItem("password");
    if (storedPw) {
      setSavedPw(storedPw);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // 1. 모든 입력 필드 확인
    if (!currentPw || !newPw || !confirmPw) {
      alert("모든 항목을 입력해주세요");
      return;
    }

    // 현재 비밀번호 일치 여부
    if (currentPw !== savedPw) {
      alert("현재 비밀번호가 일치하지 않습니다");
      return;
    }

    // 새 비밀번호와 확인 비밀번호 일치 여부
    if (newPw !== confirmPw) {
      alert("새 비밀번호가 일치하지 않습니다");
      return;
    }

    // 조건이 모두 맞으면 변경
    localStorage.setItem("password", newPw);
    alert("비밀번호가 성공적으로 변경되었습니다");

    // 입력 초기화
    setCurrentPw("");
    setNewPw("");
    setConfirmPw("");

    // 프로필 화면으로 복귀
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

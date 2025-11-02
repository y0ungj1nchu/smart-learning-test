import React, { useState, useEffect } from "react";
import "../../../../styles/profile/Tabs.css";

// --- 수정된 부분 ---
import { updatePassword } from "../../../../utils/api";
// ------------------

function PasswordTab({ onBack }) {
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  
  // --- 수정된 부분 (localStorage 로직 삭제) ---
  // const [savedPw, setSavedPw] = useState("1234");
  // useEffect(() => { ... });
  // ------------------------------------

  // --- 수정된 부분 (API 호출) ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentPw || !newPw || !confirmPw) {
      alert("모든 항목을 입력해주세요");
      return;
    }

    // (삭제) 현재 비밀번호 일치 여부 (백엔드가 검증)
    // if (currentPw !== savedPw) { ... }

    if (newPw !== confirmPw) {
      alert("새 비밀번호가 일치하지 않습니다");
      return;
    }

    try {
      // API 호출
      const data = await updatePassword(currentPw, newPw);
      
      alert(data.message || "비밀번호가 성공적으로 변경되었습니다");
      
      // 입력 초기화
      setCurrentPw("");
      setNewPw("");
      setConfirmPw("");

      // 프로필 화면으로 복귀
      onBack();

    } catch (error) {
      // (예: "현재 비밀번호가 일치하지 않습니다.")
      alert(error.message || "비밀번호 변경에 실패했습니다.");
    }
  };
  // ---------------------------

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
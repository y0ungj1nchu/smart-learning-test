import React from "react";

export default function AdminPasswordTab() {
  return (
    <div style={{ padding: "20px" }}>
      <h2>비밀번호 변경</h2>
      <p>여기에서 관리자 비밀번호를 변경할 수 있습니다.</p>

      <form className="admin-password-form">
        <div className="form-group">
          <label>현재 비밀번호</label>
          <input type="password" placeholder="현재 비밀번호 입력" />
        </div>

        <div className="form-group">
          <label>새 비밀번호</label>
          <input type="password" placeholder="새 비밀번호 입력" />
        </div>

        <div className="form-group">
          <label>비밀번호 확인</label>
          <input type="password" placeholder="새 비밀번호 재입력" />
        </div>

        <button type="submit" className="save-btn">
          변경하기
        </button>
      </form>
    </div>
  );
}

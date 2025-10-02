import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../styles/FindId.css";
import Header1 from "../../../components/common/Header1";
import Header2 from "../../../components/common/Header2";

function FindId() {
  const [email, setEmail] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [redirectTo, setRedirectTo] = useState("");
  const navigate = useNavigate();

  // 임시 회원가입 DB
  const dummyUsers = [
    { id: "testuser", email: "testuser@email.com" },
    { id: "student01", email: "student01@school.com" },
    { id: "admin123", email: "admin123@site.com" },
  ];

  const handleNext = (e) => {
    e.preventDefault();

    const foundUser = dummyUsers.find((user) => user.email === email);

    if (!foundUser) {
      // 존재하지 않는 이메일
      setResultMessage("회원가입하지 않은 이메일입니다.");
      setRedirectTo("/user/auth/Login"); // 로그인 페이지로 이동
    } else {
      // 존재하는 이메일
      setResultMessage(`입력하신 이메일 "${email}" 로 인증코드를 전송했습니다.`);
      setRedirectTo("/user/auth/EmailVerification"); // 이메일 인증 페이지로 이동
    }

    setShowModal(true);
  };

  const handleModalConfirm = () => {
    setShowModal(false);
    if (redirectTo) navigate(redirectTo);
  };

  return (
    <>
      <Header1 />
      <Header2 isLoggedIn={false} />

      <div className="findid-container">
        <div className="findid-box">
          <h2>찾고자하는 아이디의 이메일을 입력해주세요.</h2>
          <form onSubmit={handleNext}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="next-btn">
              다음 →
            </button>
          </form>
        </div>
      </div>

      {/* 모달 팝업 */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <p>{resultMessage}</p>
            <button onClick={handleModalConfirm} className="modal-btn">
              확인
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default FindId;

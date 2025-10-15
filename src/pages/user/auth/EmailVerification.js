import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../../styles/auth/EmailVerification.css";
import Header1 from "../../../components/common/Header1";
import Header2 from "../../../components/common/Header2";

function EmailVerification() {
  const [code, setCode] = useState(Array(6).fill(""));
  const [showModal, setShowModal] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // 임시 DB
  const dummyUsers = [
    { id: "testuser", email: "testuser@email.com", password: "1234" },
    { id: "student01", email: "student01@school.com", password: "abcd" },
    { id: "admin123", email: "admin123@site.com", password: "adminpw" },
  ];

  // 테스트용 인증코드
  const correctCode = "123456";

  const handleChange = (e, index) => {
    const newCode = [...code];
    newCode[index] = e.target.value.slice(-1); // 한 글자만 입력
    setCode(newCode);

    // 자동 포커스 이동
    if (e.target.value && e.target.nextSibling) {
      e.target.nextSibling.focus();
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    const enteredCode = code.join("");

    if (enteredCode !== correctCode) {
      setResultMessage("잘못된 인증코드입니다.");
      setShowModal(true);
      return;
    }

    // FindPw → 아이디 기반 비밀번호 찾기
    if (location.state?.type === "findPw") {
      const foundUser = dummyUsers.find(
        (user) => user.id === location.state.userId
      );
      if (foundUser) {
        setResultMessage(
          `아이디 "${foundUser.id}"의 비밀번호는 "${foundUser.password}" 입니다.`
        );
      }
    }

    // FindId → 이메일 기반 아이디 찾기
    else if (location.state?.type === "findId") {
      const foundUser = dummyUsers.find(
        (user) => user.email === location.state.email
      );
      if (foundUser) {
        setResultMessage(
          `입력하신 이메일 "${foundUser.email}"의 아이디는 "${foundUser.id}" 입니다.`
        );
      }
    }

    setShowModal(true);
  };

  const handleModalConfirm = () => {
    setShowModal(false);
    navigate("/user/auth/Login"); //확인 시 로그인 페이지로 이동
  };

  return (
    <>
      <Header1 isLoggedIn={false} />
      <Header2 isLoggedIn={false} />

      <div className="verify-container">
        <div className="verify-box">
          <h2>가입한 이메일로 보낸 인증코드를 입력해주세요</h2>
          <form onSubmit={handleVerify}>
            <div className="code-inputs">
              {code.map((digit, idx) => (
                <input
                  key={idx}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(e, idx)}
                />
              ))}
            </div>
            <button type="submit" className="verify-btn">
              인증
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

export default EmailVerification;

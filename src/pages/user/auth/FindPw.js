import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../../../styles/auth/FindPw.css";
import Header1 from "../../../components/common/Header1";
import Header2 from "../../../components/common/Header2";

function FindPw() {
  const [userId, setUserId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [redirectTo, setRedirectTo] = useState("");
  const navigate = useNavigate();

  // 임시 사용자 DB (회원가입 후 백엔드 연동 예정)
  const dummyUsers = [
    { id: "testuser", email: "testuser@email.com" },
    { id: "student01", email: "student01@school.com" },
    { id: "admin123", email: "admin123@site.com" },
  ];

  const handleNext = (e) => {
    e.preventDefault();

    const foundUser = dummyUsers.find((user) => user.id === userId);

    if (!foundUser) {
      setResultMessage("존재하지 않는 아이디입니다.");
      setRedirectTo("/user/auth/Login");
    } else {
      setResultMessage(
        `회원가입 시 등록된 이메일 "${foundUser.email}" 로 인증코드를 전송했습니다.`
      );
      setRedirectTo("/user/auth/EmailVerification");
    }

    setShowModal(true);
  };

  const handleModalConfirm = () => {
    setShowModal(false);
    if (redirectTo) navigate(redirectTo);
  };

  return (
    <>
      <Header1 isLoggedIn={false} />
      <Header2 isLoggedIn={false} />

      <div className="findpw-container">
        <div className="findpw-box">
          <h2>찾고자하는 비밀번호의 아이디를 입력해주세요.</h2>
          <form onSubmit={handleNext}>
            <input
              type="text"
              placeholder="아이디"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
            />

            <p className="hint">
              <Link to="/user/auth/FindId">아이디가 기억 나지 않으신가요?</Link>
            </p>

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

export default FindPw;

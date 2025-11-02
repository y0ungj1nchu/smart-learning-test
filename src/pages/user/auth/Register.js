import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../styles/auth/Register.css";
import Header1 from "../../../components/common/Header1";
import Header2 from "../../../components/common/Header2";
import kakaoLogo from "../../../assets/kakao.png";
import naverLogo from "../../../assets/naver.png";
import googleLogo from "../../../assets/google.png";
import eyeOpen from "../../../assets/eye-open.png";
import eyeOff from "../../../assets/eye-off.png";
import { signupUser } from "../../../utils/api";

function Register() {
  const [name, setName] = useState(""); // api.js에서 nickname으로 변환해줍니다.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // --- 수정된 부분 ---
  // 2. handleRegister 함수를 API를 호출하는 비동기 함수로 변경합니다.
  const handleRegister = async (e) => {
    e.preventDefault();
    setError(""); // 이전 에러 초기화

    // 3. 비밀번호 일치 여부 확인 (프론트엔드 유효성 검사)
    if (password !== confirmPw) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      // 4. 모든 localStorage 로직을 삭제하고 API 함수를 호출합니다.
      // api.js가 'name'을 'nickname'으로 자동 변환하여 백엔드로 보냅니다.
      const data = await signupUser({ name, email, password });

      alert(data.message || "회원가입이 완료되었습니다!");
      navigate("/user/auth/Login"); // 회원가입 성공 시 로그인 페이지로 이동

    } catch (err) {
      // 5. 백엔드에서 보낸 에러(예: "이미 가입된 이메일입니다.")를 화면에 표시
      setError(err.message || "회원가입 중 오류가 발생했습니다.");
    }
  };
  // ------------------

  return (
    <>
      <Header1 isLoggedIn={false} />
      <Header2 isLoggedIn={false} />

      <div className="register-container">
        <div className="register-box">
          <h2>회원가입</h2>
          <form onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="이름 (닉네임)" // 6. '이름'이 닉네임으로 사용됨
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {/* 비밀번호 toggle */}
            <div className="pw-group">
              <input
                type={showPw ? "text" : "password"}
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <img
                src={showPw ? eyeOpen : eyeOff}
                alt="toggle"
                onClick={() => setShowPw(!showPw)}
                className="eye-icon"
              />
            </div>

            <div className="pw-group">
              <input
                type={showConfirmPw ? "text" : "password"}
                placeholder="비밀번호 재입력"
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                required
              />
              <img
                src={showConfirmPw ? eyeOpen : eyeOff}
                alt="toggle"
                onClick={() => setShowConfirmPw(!showConfirmPw)}
                className="eye-icon"
              />
            </div>

            {/* 7. API 에러 메시지가 이 곳에 표시됩니다. */}
            {error && <p className="error-msg">{error}</p>}

            {/* 소셜 로그인 */}
            <div className="social-login">
              <p>소셜로그인</p>
              <div className="social-icons">
                <img src={kakaoLogo} alt="카카오" />
                <img src={naverLogo} alt="네이버" />
                <img src={googleLogo} alt="구글" />
              </div>
            </div>

            <button type="submit" className="register-btn">가입완료</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Register;
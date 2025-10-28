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
import { signupUser } from "../../../util/api";

function Register() {
  //const [name, setName] = useState("");
  const [nickname, setNickname] = useState("")
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPw) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }
    try {
      // 백엔드 API 호출
      const response = await signupUser({ nickname, email, password });
      alert(response.message || "회원가입이 완료되었습니다!"); // 백엔드 메시지 사용 (없으면 기본 메시지)
      navigate("/user/auth/Login"); // 성공 시 로그인 페이지로 이동
    } catch (apiError) {
      // API 응답에서 받은 에러 메시지 표시
      setError(apiError.message || "회원가입 중 오류가 발생했습니다.");
    }
  };

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
              placeholder="닉네임 (2~10)"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
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

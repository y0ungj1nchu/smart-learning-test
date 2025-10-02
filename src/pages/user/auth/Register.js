import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../styles/Register.css";
import Header1 from "../../../components/common/Header1";
import Header2 from "../../../components/common/Header2";
import kakaoLogo from "../../../assets/kakao.png";
import naverLogo from "../../../assets/naver.png";
import googleLogo from "../../../assets/google.png";
import eyeOpen from "../../../assets/eye-open.png";
import eyeOff from "../../../assets/eye-off.png";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    if (password !== confirmPw) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }
    const users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.find((user) => user.email === email)) {
      setError("이미 가입된 이메일입니다.");
      return;
    }
    const newUser = { name, email, password };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    alert("회원가입이 완료되었습니다!");
    navigate("/user/auth/Login");
  };

  return (
    <>
      <Header1 />
      <Header2 isLoggedIn={false} />

      <div className="register-container">
        <div className="register-box">
          <h2>회원가입</h2>
          <form onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="이름"
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

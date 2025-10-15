import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../../styles/auth/Login.css";
import lockIcon from "../../../assets/lock.png";
import userIcon from "../../../assets/user.png";
import kakaoLogo from "../../../assets/kakao.png";
import naverLogo from "../../../assets/naver.png";
import googleLogo from "../../../assets/google.png";
import Header1 from "../../../components/common/Header1";
import Header2 from "../../../components/common/Header2";

function Login() {
  const navigate = useNavigate();
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const dummyUser = { id: "testuser", password: "1234" };

  const handleLogin = (e) => {
    e.preventDefault();
    if (id !== dummyUser.id) {
      setError("아이디가 틀렸습니다.");
    } else if (password !== dummyUser.password) {
      setError("비밀번호가 틀렸습니다.");
    } else {
      setError("");
      localStorage.setItem("isLoggedIn", "true");
      navigate("/home/after");
    }
  };

  return (
    <>
      <Header1 isLoggedIn={false} />
      <Header2 isLoggedIn={false} />

      <div className="login-container">
        <div className="login-box">
          <h2>
            로그인으로 <br /> 스마트 학습 도우미를<br /> 이용하세요.
          </h2>
          <form onSubmit={handleLogin}>
            {/* 아이콘 + 입력창 */}
            <div className="input-group">
              <img src={userIcon} alt="user" className="input-icon" />
              <input
                type="text"
                placeholder="아이디"
                value={id}
                onChange={(e) => setId(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <img src={lockIcon} alt="lock" className="input-icon" />
              <input
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="login-btn">로그인</button>
          </form>

          {error && <p className="error-msg">{error}</p>}

          {/* 오른쪽 정렬 */}
          <div className="links">
            <Link to="/user/auth/Register" className="register-link">회원가입</Link>
            <div className="find-links">
              <Link to="/user/auth/FindId">아이디 찾기</Link>
              <span> | </span>
              <Link to="/user/auth/FindPw">비밀번호 찾기</Link>
            </div>
          </div>

          {/* 소셜 로그인 */}
          <div className="social-login">
            <p>소셜 로그인</p>
            <div className="social-icons">
              <img src={kakaoLogo} alt="카카오 로그인" />
              <img src={naverLogo} alt="네이버 로그인" />
              <img src={googleLogo} alt="구글 로그인" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;

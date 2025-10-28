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
import { loginUser } from "../../../util/api";

function Login() {
  const navigate = useNavigate();
  //const [id, setId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  //const dummyUser = { id: "testuser", password: "1234" };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      // 백엔드 로그인 API 호출
      const response = await loginUser({ email, password });

      // 응답에서 토큰과 사용자 정보 저장
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('userInfo', JSON.stringify(response.user)); // 필요 시 사용자 정보도 저장
      localStorage.setItem('isLoggedIn', 'true'); // 즉각적인 UI 업데이트를 위해 유지

      navigate("/home/after"); // 성공 시 리다이렉트
    } catch (apiError) {
      // API 에러 메시지 표시
      setError(apiError.message || "로그인 중 오류가 발생했습니다.");
      localStorage.removeItem('authToken'); // 실패 시 토큰 제거
      localStorage.removeItem('userInfo');
      localStorage.removeItem('isLoggedIn');
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
                type="email"
                placeholder="이메일"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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

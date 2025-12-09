import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../../styles/auth/Login.css";
import lockIcon from "../../../assets/lock.png";
import userIcon from "../../../assets/user.png";
import kakaoLogo from "../../../assets/kakao.png";
import naverLogo from "../../../assets/naver.png";
import googleLogo from "../../../assets/google.png";
import Header1 from "../../../components/common/Header1";
import Header2 from "../../../components/common/Header2";

import { loginUser } from "../../../utils/api";
import { useAuth } from "../../../context/useAuth";

function Login() {
  const navigate = useNavigate();

  // 🔥 AuthContext 기능 가져오기
  const { login, fetchMe } = useAuth();

  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // kakao
  const handleKakaoLogin = async () => {
    const res = await fetch("http://localhost:3001/auth/kakao/login");
    const data = await res.json();
    window.location.href = data.url;
  };

  // dependency 넣으면 로그인 무한 루프 발생해버림 --> 경고 없애려고 ESLint 설정 규칙
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      login(token, {});
      fetchMe(token);
      navigate("/home/after");
    }
  }, []);

  // ----------------------------------------------------
  // 🔥 수정된 핵심 로그인 로직
  // ----------------------------------------------------
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // 1) 로그인 요청 → token 수신
      const data = await loginUser({ id, password });

      // 2) JWT decode → userId, role 추출
      const payload = JSON.parse(atob(data.token.split(".")[1]));
      const role = payload.role;
      const userId = payload.id;

      // 3) 임시 login (themeColor 없음)
      login(data.token, { id: userId, role });

      // 4) 🔥 로그인 직후 바로 /me 호출
      await fetchMe(data.token);

      // 5) 역할에 따라 이동
      if (role === "ADMIN") navigate("/admin/main");
      else navigate("/home/after");

    } catch (err) {
      setError(err.message || "로그인에 실패했습니다.");
    }
  };

  return (
    <>
      <Header1 />
      <Header2 />

      <div
        className="page-content"
        style={{
          paddingTop: "93px",
          minHeight: "calc(100vh - 93px)",
          boxSizing: "border-box",
        }}
      >
        <div className="login-container">
          <div className="login-box">

            <h2>
              로그인으로 <br /> 스마트 학습 도우미를<br /> 이용하세요.
            </h2>

            <form onSubmit={handleLogin}>
              <div className="input-group">
                <img src={userIcon} alt="user" className="input-icon" />
                <input
                  type="text"
                  placeholder="아이디 (이메일)"
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

              <button type="submit" className="login-btn">
                로그인
              </button>
            </form>

            {error && <p className="error-msg">{error}</p>}

            <div className="links">
              <Link to="/user/auth/Register" className="register-link">
                회원가입
              </Link>
              <div className="find-links">
                <Link to="/user/auth/FindId">아이디 찾기</Link>
                <span> | </span>
                <Link to="/user/auth/FindPw">비밀번호 찾기</Link>
              </div>
            </div>

            <div className="social-login">
              <p>소셜 로그인</p>
              <div className="social-icons">
                <img src={kakaoLogo} alt="카카오 로그인" onClick={handleKakaoLogin} style={{ cursor: "pointer" }} />
                <img src={naverLogo} alt="네이버 로그인" />
                <img src={googleLogo} alt="구글 로그인" />
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default Login;

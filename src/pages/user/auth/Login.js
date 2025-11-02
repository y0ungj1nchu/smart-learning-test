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

// --- 수정된 부분 ---
// 1. api.js에서 loginUser 함수를 가져옵니다.
// (경로는 실제 api.js 위치에 맞게 조정하세요.)
import { loginUser } from "../../../utils/api"; 
// ------------------


function Login() {
  const navigate = useNavigate();
  const [id, setId] = useState(""); // api.js에서 email로 변환해줍니다.
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // --- 수정된 부분 ---
  // 2. 더미 데이터(dummyUser) 비교 로직을 삭제합니다.
  // 3. handleLogin 함수를 API를 호출하는 비동기 함수로 변경합니다.
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // 이전 에러 메시지 초기화

    try {
      // 4. api.js의 loginUser 함수 호출 (id가 email로 매핑됨)
      const data = await loginUser({ id, password });

      // 5. 성공 시, 단순 'true'가 아닌 백엔드에서 받은 'token'을 저장합니다.
      localStorage.setItem("isLoggedIn", "true"); // 기존 UI 상태 유지를 위해 저장
      localStorage.setItem("authToken", data.token); // API 인증을 위한 토큰 저장

      navigate("/home/after"); // 로그인 후 메인 페이지로 이동

    } catch (err) {
      // 6. 백엔드에서 보낸 에러 메시지를 상태에 저장하여 사용자에게 표시
      setError(err.message || "로그인에 실패했습니다.");
    }
  };
  // ------------------

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
                type="text" // 백엔드는 email을 받지만, UI상 '아이디'로 두어도 api.js가 변환해줍니다.
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

            <button type="submit" className="login-btn">로그인</button>
          </form>

          {/* 7. 에러 메시지가 API로부터 동적으로 표시됩니다. */}
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
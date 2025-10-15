import React from "react";
import { Link } from "react-router-dom";
import "../../styles/home/MainAfterLogin.css";
import Header1 from "../../components/common/Header1";
import Header2 from "../../components/common/Header2";
import Footer from "../../components/common/Footer";

function MainAfterLogin() {
  return (
    <>
      <Header1 isLoggedIn={true} />
      <Header2 isLoggedIn={true} />

      <div className="afterlogin-container">
        {/* 캘린더 */}
        <div className="card-group">
          <p className="card-title">캘린더</p>
          <div className="card">
            <h3>오늘의 할 일</h3>
            <p className="date">2025-09-24</p>
            <ul>
              <li>내용1</li>
              <li>내용2</li>
              <li>내용3</li>
            </ul>
            <Link to="/calendar" className="more-link">
              바로가기 →
            </Link>
          </div>
        </div>

        {/* 캐릭터 */}
        <div className="card-group">
          <p className="card-title">캐릭터</p>
          <div className="card">
            <div className="character-box">캐릭터 이미지</div>
            <p className="character-name">캐릭터 이름</p>
          </div>
        </div>

        {/* 사용자 레벨 순위 */}
        <div className="card-group">
          <p className="card-title">사용자 레벨 순위</p>
          <div className="card">
            <h3>주간 순위</h3>
            <p className="date">2025년 9월 2주차</p>
            <ol>
              <li>1. ○○○</li>
              <li>2. □□□</li>
              <li>3. ☆☆</li>
              <li>4. △△△</li>
              <li>5. ◇◇◇</li>
            </ol>
            <Link to="/ranking" className="more-link">
              바로가기 →
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default MainAfterLogin;

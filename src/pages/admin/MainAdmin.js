import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminHeader1 from "../../components/common/AdminHeader1";
import AdminHeader2 from "../../components/common/AdminHeader2";
import Footer from "../../components/common/Footer";
import "../../styles/admin/MainAdmin.css";

export default function MainAdmin() {
  const navigate = useNavigate();

  const userStats = {
    totalUsers: 1289,
    todayLogin: 84,
    newUsers: 12,
  };

  const [inquiries] = useState([
    { id: 1, name: "차훈", title: "순공시간 초기화 관련 문의", date: "2025-10-20 14:22", answered: false },
    { id: 2, name: "이승협", title: "캐릭터 레벨 오류 발생", date: "2025-10-20 13:40", answered: false },
    { id: 3, name: "홍길동", title: "비밀번호 변경 요청", date: "2025-10-19 19:10", answered: true },
  ]);

  const unanswered = inquiries.filter((q) => !q.answered);
  const answered = inquiries.filter((q) => q.answered);

  return (
    <>
      <div className="admin-header-fixed">
        <AdminHeader1 isLoggedIn={true} />
        <AdminHeader2 isLoggedIn={true} />
      </div>

      <div className="admin-main-layout">
        <div className="admin-left">
          <h2 className="section-title">👥 사용자 현황</h2>

          <div className="stats-card">
            <p className="stat-title">총 사용자 수</p>
            <h3 className="stat-value">{userStats.totalUsers.toLocaleString()}명</h3>
          </div>

          <div className="stats-card">
            <p className="stat-title">오늘 로그인</p>
            <h3 className="stat-value">{userStats.todayLogin}명</h3>
          </div>

          <div className="stats-card">
            <p className="stat-title">오늘 신규 가입</p>
            <h3 className="stat-value">{userStats.newUsers}명</h3>
          </div>
        </div>

        <div className="admin-right">
          <h2 className="section-title">
            📬 미답변 문의 ({unanswered.length}건)
          </h2>

          {unanswered.length === 0 ? (
            <p className="empty-text">모든 문의가 처리되었습니다 🎉</p>
          ) : (
            <div className="timeline-container">
              {unanswered.map((q) => (
                <div
                  key={q.id}
                  className="timeline-item"
                  onClick={() => navigate(`/admin/inquiry/${q.id}`)}
                >
                  <div className="timeline-dot" />
                  <div className="timeline-content">
                    <p className="timeline-date">{q.date}</p>
                    <h4 className="timeline-title">{q.title}</h4>
                    <p className="timeline-user">작성자: {q.name}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <h2 className="section-title" style={{ marginTop: "50px" }}>
            ✅ 답변 완료된 문의 ({answered.length}건)
          </h2>

          {answered.length === 0 ? (
            <p className="empty-text">아직 답변 완료된 문의가 없습니다.</p>
          ) : (
            <div className="timeline-container">
              {answered.map((q) => (
                <div
                  key={q.id}
                  className="timeline-item answered"
                  onClick={() => navigate(`/admin/inquiry/${q.id}`)}
                >
                  <div className="timeline-dot answered-dot" />
                  <div className="timeline-content">
                    <p className="timeline-date">{q.date}</p>
                    <h4 className="timeline-title">{q.title}</h4>
                    <p className="timeline-user">작성자: {q.name}</p>
                    <span className="answered-label">답변 완료</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}

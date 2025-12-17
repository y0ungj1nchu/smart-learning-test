import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminHeader1 from "../../components/common/AdminHeader1";
import AdminHeader2 from "../../components/common/AdminHeader2";
import Footer from "../../components/common/Footer";
import "../../styles/admin/MainAdmin.css";
import { getAdminDashboard } from "../../utils/api";

export default function MainAdmin() {
  const navigate = useNavigate();

  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    todayLogin: 0,
    newUsers: 0,
  });

  const [unanswered, setUnanswered] = useState([]);
  const [answered, setAnswered] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);

        const data = await getAdminDashboard();
        console.log("📌 관리자 대시보드 데이터:", data);

        setUserStats({
          totalUsers: data?.userStats?.totalUsers ?? 0,
          todayLogin: data?.userStats?.todayLogin ?? 0,
          newUsers: data?.userStats?.newUsers ?? 0,
        });

        setUnanswered(data?.inquiries?.unanswered ?? []);
        setAnswered(data?.inquiries?.answered ?? []);
      } catch (err) {
        console.error("❌ 관리자 대시보드 로드 실패:", err);
        setError("관리자 대시보드를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <>
      <div className="admin-header-fixed">
        <AdminHeader1 isLoggedIn={true} />
        <AdminHeader2 isLoggedIn={true} />
      </div>

      <div className="admin-main-layout">
        <div className="admin-left">
          <h2 className="section-title">👥 사용자 현황</h2>

          {loading ? (
            <p className="empty-text">로딩 중...</p>
          ) : error ? (
            <p className="empty-text" style={{ color: "red" }}>
              {error}
            </p>
          ) : (
            <>
              <div className="stats-card">
                <p className="stat-title">총 사용자 수</p>
                <h3 className="stat-value">
                  {userStats.totalUsers.toLocaleString()}명
                </h3>
              </div>

              <div className="stats-card">
                <p className="stat-title">오늘 로그인</p>
                <h3 className="stat-value">{userStats.todayLogin}명</h3>
              </div>

              <div className="stats-card">
                <p className="stat-title">오늘 신규 가입</p>
                <h3 className="stat-value">{userStats.newUsers}명</h3>
              </div>
            </>
          )}
        </div>

        <div className="admin-right">
          <h2 className="section-title">
            📬 미답변 문의 ({unanswered.length}건)
          </h2>

          {loading ? (
            <p className="empty-text">로딩 중...</p>
          ) : unanswered.length === 0 ? (
            <p className="empty-text">모든 문의가 처리되었습니다 🎉</p>
          ) : (
            <div className="timeline-container">
              {unanswered.map((q) => (
                <div
                  key={q.id}
                  className="timeline-item"
                  onClick={() =>
                    navigate(`/admin/community?qna=${q.id}`)
                  }
                >
                  <div className="timeline-dot" />
                  <div className="timeline-content">
                    <p className="timeline-date">
                      {new Date(q.date).toLocaleString()}
                    </p>
                    <h4 className="timeline-title">{q.title}</h4>
                    <p className="timeline-user">
                      작성자: {q.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <h2 className="section-title" style={{ marginTop: "50px" }}>
            ✅ 답변 완료된 문의 ({answered.length}건)
          </h2>

          {loading ? (
            <p className="empty-text">로딩 중...</p>
          ) : answered.length === 0 ? (
            <p className="empty-text">
              아직 답변 완료된 문의가 없습니다.
            </p>
          ) : (
            <div className="timeline-container">
              {answered.map((q) => (
                <div
                  key={q.id}
                  className="timeline-item answered"
                  onClick={() =>
                    navigate(`/admin/community?qna=${q.id}`)
                  }
                >
                  <div className="timeline-dot answered-dot" />
                  <div className="timeline-content">
                    <p className="timeline-date">
                      {new Date(q.date).toLocaleString()}
                    </p>
                    <h4 className="timeline-title">{q.title}</h4>
                    <p className="timeline-user">
                      작성자: {q.name}
                    </p>
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

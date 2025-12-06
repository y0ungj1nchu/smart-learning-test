import React, { useState, useEffect, useMemo } from "react";
import AdminHeader1 from "../../components/common/AdminHeader1";
import AdminHeader2 from "../../components/common/AdminHeader2";
import Footer from "../../components/common/Footer";
import "../../styles/admin/AdminRanking.css";
import { getRanking } from "../../utils/api";

export default function AdminRanking() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // -------------------------------
  // 1) 백엔드에서 랭킹 데이터 가져오기
  // -------------------------------
  useEffect(() => {
    const loadRanking = async () => {
      try {
        const data = await getRanking(); // GET /api/ranking

        console.log("🔥 서버에서 받은 ranking 데이터:", data);   // 추가
        setUsers(data);
      } catch (err) {
        console.error("랭킹 데이터 불러오기 실패:", err);
        alert("랭킹 데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadRanking();
  }, []);

  // -------------------------------
  // 2) 레벨순 정렬
  // -------------------------------
  const rankedUsers = useMemo(() => {
    return [...users].sort((a, b) => b.level - a.level);
  }, [users]);

  // -------------------------------
  // 3) 통계 정보 계산
  // -------------------------------
  const stats = useMemo(() => {
    if (users.length === 0) return { avg: 0, max: 0 };

    const total = users.reduce((sum, u) => sum + u.level, 0);
    const avg = (total / users.length).toFixed(1);
    const max = Math.max(...users.map((u) => u.level));

    return { avg, max };
  }, [users]);

  return (
    <>
      <div className="admin-header-fixed">
        <AdminHeader1 isLoggedIn={true} />
        <AdminHeader2 isLoggedIn={true} />
      </div>
      <div className="page-content" style={{ paddingTop: "93px", minHeight: "calc(100vh - 93px)", boxSizing: "border-box" }}>
      <div className="admin-ranking-layout">

        {/* ---------------- 통계 카드 ---------------- */}
        <div className="ranking-summary-box">
          <h2 className="section-title">회원 레벨 통계</h2>

          <div className="stat-card">
            <p>전체 회원 수</p>
            <strong>{users.length}명</strong>
          </div>
          <div className="stat-card">
            <p>평균 레벨</p>
            <strong>{stats.avg}</strong>
          </div>
          <div className="stat-card">
            <p>최고 레벨</p>
            <strong>{stats.max}</strong>
          </div>
        </div>

        {/* ---------------- 랭킹 리스트 ---------------- */}
        <div className="ranking-list-box">
          <h2 className="section-title">회원 레벨 순위</h2>

          {loading ? (
            <p style={{ padding: "20px", textAlign: "center" }}>
              불러오는 중...
            </p>
          ) : (
            <table className="ranking-table">
              <thead>
                <tr>
                  <th>순위</th>
                  <th>이름</th>
                  <th>레벨</th>
                </tr>
              </thead>
              <tbody>
                {rankedUsers.map((user, index) => (
                  <tr key={user.userId}>
                    <td>{index + 1}</td>
                    <td>{user.userNickname}</td>
                    <td>{user.level}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
      </div>
      <Footer />
    </>
  );
}

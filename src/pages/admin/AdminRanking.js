import React, { useState, useMemo } from "react";
import AdminHeader1 from "../../components/common/AdminHeader1";
import AdminHeader2 from "../../components/common/AdminHeader2";
import Footer from "../../components/common/Footer";
import "../../styles/admin/AdminRanking.css";

export default function AdminRanking() {
  const [users] = useState([
    { id: 1, name: "김재현", level: 14 },
    { id: 2, name: "박민수", level: 21 },
    { id: 3, name: "이하늘", level: 7 },
    { id: 4, name: "정소연", level: 9 },
    { id: 5, name: "유회승", level: 30 },
    { id: 6, name: "서동성", level: 15 },
  ]);

  const rankedUsers = useMemo(
    () => [...users].sort((a, b) => b.level - a.level),
    [users]
  );

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

      <div className="admin-ranking-layout">
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

        <div className="ranking-list-box">
          <h2 className="section-title">회원 레벨 순위</h2>
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
                <tr key={user.id}>
                  <td>{index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.level}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Footer />
    </>
  );
}

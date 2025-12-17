import React, { useEffect, useMemo, useState } from "react";
import AdminHeader1 from "../../components/common/AdminHeader1";
import AdminHeader2 from "../../components/common/AdminHeader2";
import Footer from "../../components/common/Footer";
import "../../styles/admin/AdminRanking.css";

import { getRanking } from "../../utils/api";

export default function AdminRanking() {
  const [users, setUsers] = useState([]);        // API 데이터 저장
  const [loading, setLoading] = useState(true);  // 로딩
  const [error, setError] = useState("");        // 에러 메시지

  // 화면 스크롤 막기(완성코드 스타일)
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  // 랭킹 불러오기
  useEffect(() => {
    const loadRanking = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getRanking(); // GET /api/ranking

        // ✅ data가 배열이 아닐 수도 있으니 방어코드
        const list = Array.isArray(data) ? data : (data?.ranking ?? []);
        setUsers(list);

        console.log("✅ ranking data:", list);
      } catch (err) {
        console.error("❌ 랭킹 데이터 불러오기 실패:", err);
        setError(err?.message || "랭킹 데이터를 불러오는 중 오류가 발생했습니다.");
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    loadRanking();
  }, []);

  // ✅ 레벨 기준 정렬
  const rankedUsers = useMemo(() => {
    return [...users].sort((a, b) => (b.level || 0) - (a.level || 0));
  }, [users]);

  // ✅ 통계 계산
  const stats = useMemo(() => {
    if (!users.length) return { avg: "0.0", max: 0 };

    const total = users.reduce((sum, u) => sum + (u.level || 0), 0);
    const avg = (total / users.length).toFixed(1);
    const max = Math.max(...users.map((u) => u.level || 0));

    return { avg, max };
  }, [users]);

  return (
    <>
      <div className="admin-header-fixed">
        <AdminHeader1 isLoggedIn={true} />
        <AdminHeader2 isLoggedIn={true} />
      </div>

      {/* 완성코드처럼 상단 패딩 */}
      <div
        className="page-content"
        style={{
          paddingTop: "93px",
          minHeight: "calc(100vh - 93px)",
          boxSizing: "border-box",
        }}
      >
        <div className="admin-ranking-layout">
          {/* ================= 왼쪽 통계 ================= */}
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

          {/* ================= 오른쪽 랭킹 ================= */}
          <div className="ranking-list-box">
            <h2 className="section-title">회원 레벨 순위</h2>

            {loading ? (
              <p style={{ padding: "20px", textAlign: "center" }}>
                불러오는 중...
              </p>
            ) : error ? (
              <p style={{ padding: "20px", textAlign: "center", color: "red" }}>
                {error}
              </p>
            ) : (
              <>
                {/* ✅ 헤더 테이블(고정) */}
                <table className="ranking-table">
                  <thead>
                    <tr>
                      <th>순위</th>
                      <th>이름</th>
                      <th>레벨</th>
                    </tr>
                  </thead>
                </table>

                {/* ✅ 스크롤 영역 */}
                <div className="ranking-scroll-container">
                  <table className="ranking-table">
                    <tbody>
                      {rankedUsers.map((user, index) => (
                        <tr key={user.userId ?? user.id ?? `${user.userNickname}-${index}`}>
                          <td>{index + 1}</td>
                          <td>{user.userNickname ?? user.nickname ?? user.name ?? "알 수 없음"}</td>
                          <td>{user.level ?? 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

import React, { useState, useEffect } from "react";
import Header1 from "../../../components/common/Header1"; // [cite: y0ungj1nchu/smart-learning-test/smart-learning-test-43d7c948f09963115e95bcb5084fd0a13d860918/src/components/common/Header1.js]
import Header2 from "../../../components/common/Header2"; // [cite: y0ungj1nchu/smart-learning-test/smart-learning-test-43d7c948f09963115e95bcb5084fd0a13d860918/src/components/common/Header2.js]
// import { sortedRanking } from "../../../data/rankingData"; // 임시 데이터 삭제
import { getRanking } from "../../../utils/api"; // <-- 1. default import가 아닌 named import로 변경
import "../../../styles/ranking/RankingPage.css"; // [cite: y0ungj1nchu/smart-learning-test/smart-learning-test-43d7c948f09963115e95bcb5084fd0a13d860918/src/styles/ranking/RankingPage.css]

function RankingPage() {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await getRanking(); // <-- 2. 'api.get' 대신 'getRanking()' 함수 호출
        
        setRankings(data); // (response.data가 아닌 data 바로 사용)
      } catch (err) {
        console.error("랭킹 API 호출 오류:", err);
        setError("랭킹을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchRanking();
  }, []);

  if (loading) {
    return (
      <>
        <Header1 isLoggedIn={true} />
        <Header2 isLoggedIn={true} />
        <div className="ranking-page">
          <div className="ranking-container">
            <h2>사용자 레벨 순위</h2>
            <div>랭킹을 불러오는 중...</div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header1 isLoggedIn={true} />
        <Header2 isLoggedIn={true} />
        <div className="ranking-page">
          <div className="ranking-container">
            <h2>사용자 레벨 순위</h2>
            <div style={{ color: "red" }}>{error}</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header1 isLoggedIn={true} />
      <Header2 isLoggedIn={true} />

      <div className="ranking-page">
        <div className="ranking-container">
          <h2>사용자 레벨 순위</h2>
          <table className="ranking-table">
            <thead>
              <tr>
                <th>순위</th>
                <th>캐릭터</th>
                <th>닉네임 (계정)</th>
                <th>레벨</th>
                <th>경험치</th>
              </tr>
            </thead>
            <tbody>
              {rankings.map((user, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    {/* (characterImage가 존재하는지 확인) */}
                    {user.characterImage && (
                      <img
                        /* (참고) 이미지가 public/images 폴더 안에 
                          snoopy1.png, snoopy2.png 처럼 저장되어 있어야 합니다.
                        */
                        src={`/images/${user.characterImage}.png`}
                        alt={user.characterNickname}
                        style={{ width: "40px", height: "40px", borderRadius: '50%' }}
                      />
                    )}
                  </td>
                  <td>
                    {user.characterNickname} ({user.userNickname})
                  </td>
                  <td>Lv.{user.level}</td>
                  <td>{user.exp} EXP</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default RankingPage;
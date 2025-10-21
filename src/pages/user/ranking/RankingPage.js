import React from "react";
import Header1 from "../../../components/common/Header1";
import Header2 from "../../../components/common/Header2";
import "../../../styles/ranking/RankingPage.css";

function RankingPage() {
  // 원본 데이터
  const rankingData = [
    { nickname: "ㅇㅇㅇ", level: 34 },
    { nickname: "ㅁㅁㅁ", level: 30 },
    { nickname: "☆☆☆", level: 29 },
    { nickname: "◇◇◇", level: 29 },
    { nickname: "△△△", level: 27 },
  ];

   // 레벨 높은 순으로 정렬
  const sortedRanking = [...rankingData].sort((a, b) => b.level - a.level);

  return (
    <div className="ranking-page">
      <Header1 isLoggedIn={true} />
      <Header2 isLoggedIn={true} />

      <div className="ranking-container">
        <h2>사용자 레벨 순위</h2>
        <table className="ranking-table">
          <thead>
            <tr>
              <th>순위</th>
              <th>닉네임</th>
              <th>캐릭터 레벨</th>
            </tr>
          </thead>
          <tbody>
            {sortedRanking.map((user, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{user.nickname}</td>
                <td>Lv.{user.level}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RankingPage;
import React, { useState, useEffect } from "react";
import Header1 from "../../../components/common/Header1";
import Header2 from "../../../components/common/Header2";
import { getRanking } from "../../../utils/api";
import "../../../styles/ranking/RankingPage.css";

// 이미지 import
import basicUser from "../../../assets/basicUser.png";
import snoopy1 from "../../../assets/snoopy1.png";
import snoopy2 from "../../../assets/snoopy2.png";
import snoopy3 from "../../../assets/snoopy3.png";
import snoopy4 from "../../../assets/snoopy4.png";
import snoopy5 from "../../../assets/snoopy5.png";

// 이미지 이름을 import된 객체에 매핑
const characterImages = {
  snoopy1,
  snoopy2,
  snoopy3,
  snoopy4,
  snoopy5,
};

function RankingPage() {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await getRanking();
        
        setRankings(data);
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
                    <img
                      // user.characterImage (e.g., "snoopy1")를 키로 사용하여
                      // 해당 이미지(snoopy1)를 찾고, 없으면 기본 이미지를 사용합니다.
                      src={characterImages[user.characterImage] || basicUser}
                      alt={user.characterNickname}
                      style={{ width: "40px", height: "40px", borderRadius: '50%' }}
                    />
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
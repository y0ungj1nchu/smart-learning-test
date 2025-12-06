import React, { useState, useEffect } from "react";
import Header1 from "../../../components/common/Header1";
import Header2 from "../../../components/common/Header2";
import { getRanking } from "../../../utils/api";
import "../../../styles/ranking/RankingPage.css";

import basicUser from "../../../assets/basicUser.png";

function RankingPage() {
  const [rankings, setRankings] = useState([]);

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const data = await getRanking();
        setRankings(data);
      } catch (err) {
        console.error("랭킹 불러오기 오류:", err);
      }
    };
    fetchRanking();
  }, []);

  return (
    <>
      <Header1 isLoggedIn={true} />
      <Header2 isLoggedIn={true} />
      <div className="page-content" style={{ paddingTop: "93px", minHeight: "calc(100vh-93px)", boxSizing: "border-box", }}>
        <div className="ranking-page">
          <div className="ranking-container">
            <h2>사용자 레벨 순위</h2>

            <table className="ranking-table">
              <thead>
                <tr>
                  <th>순위</th>
                  <th>캐릭터</th>
                  <th>닉네임</th>
                  <th>레벨</th>
                  <th>경험치</th>
                </tr>
              </thead>

              <tbody>
                {rankings.map((user, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>

                    <td>
                      <img
                        className="ranking-character-img"
                        src={
                          user.characterImage
                            ? `http://localhost:3001/uploads/characters/${user.characterImage}` // ★ 서버 이미지 그대로 사용
                            : basicUser
                        }
                        style={{ width: "40px", height: "40px", borderRadius: '50%' }}
                        alt="character"
                      />
                    </td>

                    <td>{user.userNickname}</td>
                    <td>Lv. {user.level}</td>
                    <td>{user.exp} EXP</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default RankingPage;

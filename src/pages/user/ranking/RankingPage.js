import React from "react";
import Header1 from "../../../components/common/Header1";
import Header2 from "../../../components/common/Header2";

function RankingPage() {
  return (
    <>
      <Header1 isLoggedIn={true} />
      <Header2 isLoggedIn={true} />
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2>사용자 레벨 순위 페이지</h2>
        <p>레벨 순위</p>
      </div>
    </>
  );
}

export default RankingPage;
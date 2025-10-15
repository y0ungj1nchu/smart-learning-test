import React from "react";
import Header1 from "../../../components/common/Header1";
import Header2 from "../../../components/common/Header2";

function GamesPage() {
  return (
    <>
      <Header1 isLoggedIn={true} />
      <Header2 isLoggedIn={true} />
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2>게임 페이지</h2>
        <p>게 임</p>
      </div>
    </>
  );
}

export default GamesPage;
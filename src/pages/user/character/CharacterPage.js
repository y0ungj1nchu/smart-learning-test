import React from "react";
import Header1 from "../../../components/common/Header1";
import Header2 from "../../../components/common/Header2";

function CharacterPage() {
  return (
    <>
      <Header1 isLoggedIn={true} />
      <Header2 isLoggedIn={true} />
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2>캐릭터 페이지</h2>
        <p>캐 릭 터</p>
      </div>
    </>
  );
}

export default CharacterPage;
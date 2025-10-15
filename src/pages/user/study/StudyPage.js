import React from "react";
import Header1 from "../../../components/common/Header1";
import Header2 from "../../../components/common/Header2";

function StudyPage() {
  return (
    <>
      <Header1 isLoggedIn={true} />
      <Header2 isLoggedIn={true} />
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2>순공 시간</h2>
        <p>공 부 하 자</p>
      </div>
    </>
  );
}

export default StudyPage;
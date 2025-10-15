import React from "react";
import Header1 from "../../../components/common/Header1";
import Header2 from "../../../components/common/Header2";

function CommunityPage() {
  return (
    <>
      <Header1 isLoggedIn={true} />
      <Header2 isLoggedIn={true} />
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2>커뮤니티 페이지</h2>
        <p>이곳에서 사용자들과 소통할 수 있습니다.</p>
      </div>
    </>
  );
}

export default CommunityPage;
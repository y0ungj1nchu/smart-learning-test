import React, { useEffect, useState } from "react";
import Header1 from "../../../components/common/Header1";
import Header2 from "../../../components/common/Header2";
import folderIcon from "../../../assets/folder-open.png";
import "../../../styles/game/WordGame.css";
import { useNavigate } from "react-router-dom";

import { fetchAdminWordSetsAPI } from "../../../utils/api";

export default function WordGamePageBasic() {
  const navigate = useNavigate();
  const [adminSets, setAdminSets] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchAdminWordSetsAPI();
        setAdminSets(data.wordsets || []);  // word.js와 정확히 일치
      } catch (err) {
        console.error("관리자 단어장 불러오기 실패:", err);
      }
    };
    load();
  }, []);

  const startAdminWordSet = (set) => {
    navigate("/user/game/quiz", {
      state: {
        setId: set.id,
        setName: set.setTitle,
        origin: "admin",
      },
    });
  };

  return (
    <>
      <Header1 isLoggedIn={true} />
      <Header2 isLoggedIn={true} />

      <div className="wordgame-page">
        <h2 className="wordgame-title">기본 제공 단어 맞추기</h2>

        <section style={{ width: "100%", maxWidth: "800px" }}>
          <div className="wordgame-folder-container">
            {adminSets.length === 0 && (
              <p style={{ textAlign: "center", marginTop: "40px" }}>
                제공된 단어장이 없습니다.
              </p>
            )}

            {adminSets.map((set) => (
              <div
                key={set.id}
                className="wordgame-folder-card"
                onClick={() => startAdminWordSet(set)}
              >
                <div className="wordgame-folder-left">
                  <img src={folderIcon} alt="folder" />
                  <p>{set.setTitle}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

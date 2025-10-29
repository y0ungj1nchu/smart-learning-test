import React from "react";
import Header1 from "../../../components/common/Header1";
import Header2 from "../../../components/common/Header2";
import "../../../styles/game/WordGame.css";
import { useNavigate } from "react-router-dom";

export default function WordGameUploadPage() {
  const navigate = useNavigate();

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const json = JSON.parse(text);
      const setName = json.setName || "사용자 업로드 세트";
      const wordList = Array.isArray(json.wordList) ? json.wordList : [];
      if (!wordList.length) {
        alert("유효한 단어 목록이 없습니다.");
        return;
      }
      navigate("/user/game/quiz", { state: { setName, wordList } });
    } catch {
      alert("JSON 파싱 오류입니다. 올바른 형식을 사용하세요.");
    } finally {
      e.target.value = "";
    }
  };

  return (
    <>
      <Header1 isLoggedIn={true} />
      <Header2 isLoggedIn={true} />

      <div className="wordgame-page">
        <div className="wordgame-header-section">
          <h2 className="wordgame-title">나만의 단어게임</h2>

          <label className="wordgame-upload-card">
            <div className="wordgame-upload-inner">
              <span className="wordgame-plus-icon">+</span>
              <span>JSON 파일 업로드</span>
            </div>
            <input type="file" accept="application/json" onChange={handleUpload} hidden />
          </label>
        </div>
      </div>
    </>
  );
}

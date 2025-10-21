import React, { useState } from "react";
import Header1 from "../../../components/common/Header1";
import Header2 from "../../../components/common/Header2";
import "../../../styles/character/CharacterPage.css";
import tree from "../../../assets/tree.png";
import appleTree from "../../../assets/appleTree.png";

function CharacterPage() {
  const [mode, setMode] = useState("view"); // view | rename | change
  const [name, setName] = useState("사과");
  const [newName, setNewName] = useState("");
  const [character, setCharacter] = useState("tree");

  const handleNameChange = () => {
    if (!newName.trim()) return;
    setName(newName);
    setMode("view");
    setNewName("");
  };

  const handleCharacterChange = (type) => {
    setCharacter(type);
    setMode("view");
  };

  const renderCharacterImage = () =>
    character === "appleTree" ? (
      <img src={appleTree} alt="사과나무" className="character-img" />
    ) : (
      <img src={tree} alt="트리" className="character-img" />
    );

  return (
    <>
      <Header1 isLoggedIn={true} />
      <Header2 isLoggedIn={true} />

      <div className="character-container">
        <div className="character-left">{renderCharacterImage()}</div>

        <div className="character-right">
          {mode === "view" && (
            <div className="character-card">
              <h2 className="character-title">캐릭터</h2>
              <div className="info-row">
                <span className="label">이름</span>
                <span className="value">{name}</span>
              </div>
              <div className="info-row">
                <span className="label">레벨</span>
                <span className="value">1 level</span>
              </div>
              <div className="btn-group">
                <button onClick={() => setMode("rename")} className="yellow-btn">
                  캐릭터 이름 변경
                </button>
                <button onClick={() => setMode("change")} className="yellow-btn">
                  캐릭터 변경
                </button>
              </div>
            </div>
          )}

          {mode === "rename" && (
            <div className="character-card">
              <h2 className="character-title">캐릭터 이름 변경</h2>
              <div className="info-row">
                <span className="label">변경 전 이름</span>
                <span className="value">{name}</span>
              </div>
              <div className="info-row">
                <span className="label">새로운 이름</span>
                <input
                  type="text"
                  placeholder="새 이름 입력"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="input-box"
                />
              </div>
              <div className="btn-group">
                <button onClick={handleNameChange} className="yellow-btn">
                  이름 변경
                </button>
                <button onClick={() => setMode("view")} className="gray-btn">
                  취소
                </button>
              </div>
            </div>
          )}

          {mode === "change" && (
            <div className="character-card">
              <h2 className="character-title">캐릭터 변경</h2>
              <div className="character-select-box">
                <div className="character-option">
                  <img src={appleTree} alt="사과나무" className="select-img" />
                  <p>사과나무 키우기</p>
                  <button
                    className="yellow-btn"
                    onClick={() => handleCharacterChange("appleTree")}
                  >
                    선택
                  </button>
                </div>
                <div className="character-option">
                  <img src={tree} alt="트리" className="select-img" />
                  <p>트리 꾸미기</p>
                  <button
                    className="yellow-btn"
                    onClick={() => handleCharacterChange("tree")}
                  >
                    선택
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default CharacterPage;

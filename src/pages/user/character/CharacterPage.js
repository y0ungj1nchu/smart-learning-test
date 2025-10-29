import React, { useState } from "react";
import Header1 from "../../../components/common/Header1";
import Header2 from "../../../components/common/Header2";
import "../../../styles/character/CharacterPage.css";
import snoopy1 from "../../../assets/snoopy1.png";
import snoopy2 from "../../../assets/snoopy2.png";
import snoopy3 from "../../../assets/snoopy3.png";
import snoopy4 from "../../../assets/snoopy4.png";
import snoopy5 from "../../../assets/snoopy5.png";
import lockIcon from "../../../assets/lock.png";

const characterList = [
  { id: 1, name: "스누피1", img: snoopy1, minLevel: 1 },
  { id: 2, name: "스누피2", img: snoopy2, minLevel: 2 },
  { id: 3, name: "스누피3", img: snoopy3, minLevel: 3 },
  { id: 4, name: "스누피4", img: snoopy4, minLevel: 4 },
  { id: 5, name: "스누피5", img: snoopy5, minLevel: 5 },
];

function CharacterPage() {
  const [mode, setMode] = useState("view"); 
  const [name, setName] = useState("사과");
  const [newName, setNewName] = useState("");
  const [character, setCharacter] = useState("tree");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userLevel, setUserLevel] = useState(1); 

  const handleNameChange = () => {
    if (!newName.trim()) return;
    setName(newName);
    setMode("view");
    setNewName("");
  };

  const handleCharacterChange = (imgName, minLevel) => {
    if (userLevel < minLevel) return; 
    setCharacter(imgName);
    setMode("view");
  };

  const renderCharacterImage = () => {
    const selected =
      characterList.find((c) => c.img === character) || characterList[0];
    return <img src={selected.img} alt={selected.name} className="character-img" />;
  };

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      (prev - 1 + characterList.length) % characterList.length
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % characterList.length);
  };

  const getVisibleCharacters = () => {
    const first = currentIndex;
    const second = (currentIndex + 1) % characterList.length;
    return [characterList[first], characterList[second]];
  };

  const visibleCharacters = getVisibleCharacters();

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
                <span className="value">{userLevel} level</span>
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

              <div className="carousel-wrapper">
                <button className="arrow-btn left" onClick={handlePrev}>
                  &lt;
                </button>

                <div className="character-carousel">
                  {visibleCharacters.map((char) => {
                    const locked = userLevel < char.minLevel;
                    const isSelected = character === char.img;
                    return (
                      <div
                        key={char.id}
                        className={`character-option ${
                          isSelected ? "selected" : ""
                        } ${locked ? "locked" : ""}`}
                        onClick={() =>
                          !locked && handleCharacterChange(char.img, char.minLevel)
                        }
                      >
                        <div className="character-image-container">
                          <img
                            src={char.img}
                            alt={char.name}
                            className="select-img"
                          />
                          {locked && (
                            <img
                              src={lockIcon}
                              alt="잠금"
                              className="lock-icon"
                            />
                          )}
                        </div>
                        <p>
                          {char.name}
                          {locked && (
                            <span className="locked-text">
                              {" "}
                              (Lv.{char.minLevel})
                            </span>
                          )}
                        </p>
                        <button
                          className="yellow-btn"
                          disabled={locked}
                          onClick={() =>
                            handleCharacterChange(char.img, char.minLevel)
                          }
                        >
                          {locked ? "잠김" : "선택"}
                        </button>
                      </div>
                    );
                  })}
                </div>

                <button className="arrow-btn right" onClick={handleNext}>
                  &gt;
                </button>
              </div>

              <div className="btn-group">
                <button onClick={() => setMode("view")} className="gray-btn">
                  취소
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default CharacterPage;

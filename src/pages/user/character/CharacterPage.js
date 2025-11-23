import React, { useEffect, useState } from "react";
import Header1 from "@/components/common/Header1";
import Header2 from "@/components/common/Header2";
import Footer from "@/components/common/Footer";
import "@/styles/character/CharacterPage.css";

import lockIcon from "@/assets/lock.png";

import {
  fetchCharacterTemplates,
  getMyProfile,
  updateCharacterImage,
} from "@/utils/api";

function CharacterPage() {
  const [mode, setMode] = useState("view");
  const [name, setName] = useState("");
  const [newName, setNewName] = useState("");
  const [character, setCharacter] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  const [userLevel, setUserLevel] = useState(1);
  const [characterList, setCharacterList] = useState([]);

  // -------------------------------
  // 1) 사용자 정보 + 캐릭터 템플릿 불러오기
  // -------------------------------
  useEffect(() => {
    const loadData = async () => {
      const me = await getMyProfile();
      setUserLevel(me.level);
      setName(me.nickname || "사용자");
      setCharacter(me.characterImage);

      const list = await fetchCharacterTemplates();
      setCharacterList(list);

      // 현재 선택된 캐릭터 index 찾기
      const idx = list.findIndex(
        (c) => c.imagePath === me.characterImage
      );
      setCurrentIndex(idx >= 0 ? idx : 0);
    };
    loadData();
  }, []);

  if (!characterList.length) return <p>로딩 중...</p>;

  const currentChar = characterList[currentIndex];

  const currentImageUrl = `http://localhost:3001/uploads/characters/${currentChar.imagePath}`;

  // -------------------------------
  // 2) 캐릭터 캐러셀 이동
  // -------------------------------
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

  // -------------------------------
  // 3) 캐릭터 변경 / 이름 변경
  // -------------------------------
  const handleCharacterChange = async (imgName, minLevel) => {
    if (userLevel < minLevel) return;

    await updateCharacterImage(imgName);
    setCharacter(imgName);

    alert("캐릭터가 변경되었습니다!");

    setMode("view");
  };

  const handleNameChange = () => {
    if (!newName.trim()) return;
    setName(newName);
    setNewName("");
    setMode("view");
  };

  return (
    <div className="user-character-page">
      <Header1 isLoggedIn={true} />
      <Header2 isLoggedIn={true} />

      <div className="character-page">
        <div className="character-container">
          {/* ----------------------- */}
          {/* 왼쪽 큰 캐릭터 이미지   */}
          {/* ----------------------- */}
          <div className="character-left">
            <img
              src={`http://localhost:3001/uploads/characters/${character}`}
              alt="현재 캐릭터"
              className="character-img"
            />
          </div>

          {/* ----------------------- */}
          {/* 오른쪽 정보 카드 및 모드 */}
          {/* ----------------------- */}
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
                  <button
                    onClick={() => setMode("rename")}
                    className="yellow-btn"
                  >
                    캐릭터 이름 변경
                  </button>

                  <button
                    onClick={() => setMode("change")}
                    className="yellow-btn"
                  >
                    캐릭터 변경
                  </button>
                </div>
              </div>
            )}

            {/* ----------------------- */}
            {/* 이름 변경 모드 */}
            {/* ----------------------- */}
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
                  <button
                    onClick={() => setMode("view")}
                    className="gray-btn"
                  >
                    취소
                  </button>
                </div>
              </div>
            )}

            {/* ----------------------- */}
            {/* 캐릭터 교체 모드 */}
            {/* ----------------------- */}
            {mode === "change" && (
              <div className="character-card">
                <h2 className="character-title">캐릭터 변경</h2>

                <div className="carousel-wrapper">
                  <button className="arrow-btn left" onClick={handlePrev}>
                    &lt;
                  </button>

                  <div className="character-carousel">
                    {visibleCharacters.map((char) => {
                      const isLocked = userLevel < char.level;
                      const fileName = char.imagePath;
                      const imgPath = `http://localhost:3001/uploads/characters/${fileName}`;
                      const isSelected = character === fileName;

                      return (
                        <div
                          key={char.id}
                          className={`character-option ${
                            isSelected ? "selected" : ""
                          } ${isLocked ? "locked" : ""}`}
                          onClick={() =>
                            !isLocked &&
                            handleCharacterChange(fileName, char.level)
                          }
                        >
                          <div className="character-image-container">
                            <img
                              src={imgPath}
                              alt={char.name}
                              className="select-img"
                            />
                            {isLocked && (
                              <img
                                src={lockIcon}
                                alt="잠금"
                                className="lock-icon"
                              />
                            )}
                          </div>

                          <p>
                            {char.name}
                            {isLocked && (
                              <span className="locked-text">
                                {" "}
                                (Lv.{char.level})
                              </span>
                            )}
                          </p>

                          <button
                            className="yellow-btn"
                            disabled={isLocked}
                            onClick={() =>
                              handleCharacterChange(fileName, char.level)
                            }
                          >
                            {isLocked ? "잠김" : "선택"}
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
                  <button
                    onClick={() => setMode("view")}
                    className="gray-btn"
                  >
                    취소
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default CharacterPage;

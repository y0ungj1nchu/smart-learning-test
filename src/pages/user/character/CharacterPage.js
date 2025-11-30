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
  updateCharacterName
} from "@/utils/api";

function CharacterPage() {
  const [mode, setMode] = useState("view");
  const [name, setName] = useState("");
  const [newName, setNewName] = useState("");
  const [character, setCharacter] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  const [userLevel, setUserLevel] = useState(1);
  const [characterList, setCharacterList] = useState([]);

  /* --------------------------------------------------
      1) 사용자 정보 + 캐릭터 리스트 불러오기
  -------------------------------------------------- */
  useEffect(() => {
    const loadData = async () => {
      const me = await getMyProfile();

      setUserLevel(me.level);
      setName(me.characterName || me.nickname);
      setCharacter(me.characterImage);

      const list = await fetchCharacterTemplates();
      setCharacterList(list);

      const idx = list.findIndex(c => c.imagePath === me.characterImage);
      setCurrentIndex(idx >= 0 ? idx : 0);
    };
    loadData();
  }, []);

  if (!characterList.length) return <p>로딩 중...</p>;

  /* --------------------------------------------------
      2) 캐러셀 이동
  -------------------------------------------------- */
  const handlePrev = () => {
    setCurrentIndex(prev =>
      (prev - 1 + characterList.length) % characterList.length
    );
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % characterList.length);
  };

  const visibleCharacters = [
    characterList[currentIndex],
    characterList[(currentIndex + 1) % characterList.length],
  ];

  /* --------------------------------------------------
      3) 캐릭터 변경
  -------------------------------------------------- */
  const handleCharacterChange = async (imgName, minLevel) => {
    if (userLevel < minLevel) return; // 레벨 미달

    await updateCharacterImage(imgName);
    setCharacter(imgName);

    alert("캐릭터가 변경되었습니다!");

    setMode("view");
  };

  /* --------------------------------------------------
      4) 캐릭터 이름 변경
  -------------------------------------------------- */
  const handleNameChange = async () => {
    if (!newName.trim()) return;

    try {
      await updateCharacterName(newName);
      setName(newName); // 프론트 반영

      alert("캐릭터 이름이 변경되었습니다!");

      setNewName("");
      setMode("view");
    } catch (error) {
      console.error(error);
      alert("이름 변경 실패");
    }
  };

  return (
    <div className="user-character-page">
      <Header1 isLoggedIn={true} />
      <Header2 isLoggedIn={true} />

      <div className="character-page">
        <div className="character-container">

          {/* ------------------------- */}
          {/* 왼쪽 큰 캐릭터 이미지 */}
          {/* ------------------------- */}
          <div className="character-left">
            <img
              src={`http://localhost:3001/uploads/characters/${character}`}
              alt="현재 캐릭터"
              className="character-img"
            />
          </div>

          {/* ------------------------- */}
          {/* 오른쪽 정보창 */}
          {/* ------------------------- */}
          <div className="character-right">

            {/* ---------- VIEW MODE ---------- */}
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
                  <button className="yellow-btn" onClick={() => setMode("rename")}>
                    캐릭터 이름 변경
                  </button>

                  <button className="yellow-btn" onClick={() => setMode("change")}>
                    캐릭터 변경
                  </button>
                </div>
              </div>
            )}

            {/* ---------- NAME CHANGE MODE ---------- */}
            {mode === "rename" && (
              <div className="character-card">
                <h2 className="character-title">캐릭터 이름 변경</h2>

                <div className="info-row">
                  <span className="label">현재 이름</span>
                  <span className="value">{name}</span>
                </div>

                <div className="info-row">
                  <span className="label">새 이름</span>
                  <input
                    className="input-box"
                    placeholder="새 이름 입력"
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                  />
                </div>

                <div className="btn-group">
                  <button className="yellow-btn" onClick={handleNameChange}>
                    이름 변경
                  </button>
                  <button className="gray-btn" onClick={() => setMode("view")}>
                    취소
                  </button>
                </div>
              </div>
            )}

            {/* ---------- CHARACTER CHANGE MODE ---------- */}
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
                      const isSelected = character === char.imagePath;
                      const imgPath = `http://localhost:3001/uploads/characters/${char.imagePath}`;

                      return (
                        <div
                          key={char.id}
                          className={`character-option 
                            ${isSelected ? "selected" : ""} 
                            ${isLocked ? "locked" : ""}`}
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
                              <span className="locked-text"> (Lv.{char.level})</span>
                            )}
                          </p>

                          {/* 버튼 클릭만 캐릭터 변경(중복 방지!) */}
                          <button
                            className="yellow-btn"
                            disabled={isLocked}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCharacterChange(char.imagePath, char.level);
                            }}
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
                  <button className="gray-btn" onClick={() => setMode("view")}>
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

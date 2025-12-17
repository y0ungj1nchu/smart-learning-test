import React, { useState, useEffect } from "react";
import Header1 from "@/components/common/Header1";
import Header2 from "@/components/common/Header2";
import "@/styles/character/CharacterPage.css";

import lockIcon from "@/assets/lock.png";

import {
  fetchCharacterTemplates,
  getMyProfile,
  updateCharacterImage,
  updateCharacterName,
} from "@/utils/api";

function CharacterPage() {
  const [mode, setMode] = useState("view");

  const [name, setName] = useState("");
  const [newName, setNewName] = useState("");

  const [character, setCharacter] = useState("");
  const [userLevel, setUserLevel] = useState(1);

  const [characterList, setCharacterList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  /* ===============================
     초기 데이터 로드
  =============================== */
  useEffect(() => {
    const loadData = async () => {
      try {
        const me = await getMyProfile();
        setUserLevel(me.level);
        setName(me.characterName || me.nickname);
        setCharacter(me.characterImage);

        const list = await fetchCharacterTemplates();
        setCharacterList(list);

        const idx = list.findIndex(
          (c) => c.imagePath === me.characterImage
        );
        setCurrentIndex(idx >= 0 ? idx : 0);
      } catch (e) {
        console.error("캐릭터 로드 실패", e);
      }
    };

    loadData();

    // 스크롤 잠금 (완성본 UX 유지)
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  if (!characterList.length) {
    return (
      <div className="user-character-page">
        <Header1 isLoggedIn />
        <Header2 isLoggedIn />
        <p style={{ paddingTop: "120px", textAlign: "center" }}>로딩 중...</p>
      </div>
    );
  }

  /* ===============================
     캐러셀 이동
  =============================== */
  const handlePrev = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + characterList.length) % characterList.length
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % characterList.length);
  };

  const visibleCharacters = [
    characterList[currentIndex],
    characterList[(currentIndex + 1) % characterList.length],
  ];

  /* ===============================
     캐릭터 변경
  =============================== */
  const handleCharacterChange = async (imgName, minLevel) => {
    if (userLevel < minLevel) return;

    try {
      await updateCharacterImage(imgName);
      setCharacter(imgName);
      alert("캐릭터가 변경되었습니다!");
      setMode("view");
    } catch {
      alert("캐릭터 변경 실패");
    }
  };

  /* ===============================
     이름 변경
  =============================== */
  const handleNameChange = async () => {
    if (!newName.trim()) return;

    try {
      await updateCharacterName(newName.trim());
      setName(newName.trim());
      setNewName("");
      setMode("view");
      alert("캐릭터 이름이 변경되었습니다!");
    } catch {
      alert("이름 변경 실패");
    }
  };

  /* ===============================
     현재 캐릭터 이미지
  =============================== */
  const currentCharacter =
    characterList.find((c) => c.imagePath === character) ||
    characterList[0];

  return (
    <div className="user-character-page">
      <Header1 isLoggedIn />
      <Header2 isLoggedIn />

      <div
        className="page-content"
        style={{
          paddingTop: "93px",
          minHeight: "calc(100vh - 93px)",
          boxSizing: "border-box",
        }}
      >
        <div className="character-page">
          <div className="character-container">

            {/* ================= 왼쪽 큰 캐릭터 ================= */}
            <div className="character-left">
              <img
                src={`http://localhost:3001/uploads/characters/${currentCharacter.imagePath}`}
                alt={currentCharacter.name}
                className="character-img"
              />
            </div>

            {/* ================= 오른쪽 패널 ================= */}
            <div className="character-right">

              {/* ---------- VIEW ---------- */}
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
                      className="yellow-btn"
                      onClick={() => setMode("rename")}
                    >
                      캐릭터 이름 변경
                    </button>
                    <button
                      className="yellow-btn"
                      onClick={() => setMode("change")}
                    >
                      캐릭터 변경
                    </button>
                  </div>
                </div>
              )}

              {/* ---------- RENAME ---------- */}
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
                      value={newName}
                      placeholder="새 이름 입력"
                      onChange={(e) => setNewName(e.target.value)}
                    />
                  </div>

                  <div className="btn-group">
                    <button className="yellow-btn" onClick={handleNameChange}>
                      이름 변경
                    </button>
                    <button
                      className="gray-btn"
                      onClick={() => setMode("view")}
                    >
                      취소
                    </button>
                  </div>
                </div>
              )}

              {/* ---------- CHANGE ---------- */}
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
                        const isSelected =
                          character === char.imagePath;

                        return (
                          <div
                            key={char.id}
                            className={`character-option ${
                              isSelected ? "selected" : ""
                            } ${isLocked ? "locked" : ""}`}
                          >
                            <div className="character-image-container">
                              <img
                                src={`http://localhost:3001/uploads/characters/${char.imagePath}`}
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
                                handleCharacterChange(
                                  char.imagePath,
                                  char.level
                                )
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
                      className="gray-btn"
                      onClick={() => setMode("view")}
                    >
                      취소
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CharacterPage;

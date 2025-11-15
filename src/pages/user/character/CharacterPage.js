import React, { useState, useEffect, useCallback } from "react";
import Header1 from "../../../components/common/Header1";
import Header2 from "../../../components/common/Header2";
import "../../../styles/character/CharacterPage.css";

import snoopy1 from "../../../assets/snoopy1.png";
import snoopy2 from "../../../assets/snoopy2.png";
import snoopy3 from "../../../assets/snoopy3.png";
import snoopy4 from "../../../assets/snoopy4.png";
import snoopy5 from "../../../assets/snoopy5.png";
import lockIcon from "../../../assets/lock.png";

import {
  getMyProfile,
  updateCharacterName,
  updateCharacterImage,
} from "../../../utils/api";

// 이미지 매핑
const characterImageMap = {
  snoopy1,
  snoopy2,
  snoopy3,
  snoopy4,
  snoopy5,
};

// 캐릭터 목록
const characterList = [
  { id: "snoopy1", name: "스누피1", minLevel: 1 },
  { id: "snoopy2", name: "스누피2", minLevel: 2 },
  { id: "snoopy3", name: "스누피3", minLevel: 3 },
  { id: "snoopy4", name: "스누피4", minLevel: 4 },
  { id: "snoopy5", name: "스누피5", minLevel: 5 },
];

function CharacterPage() {
  const [mode, setMode] = useState("view");
  const [charName, setCharName] = useState("...로딩");
  const [newName, setNewName] = useState("");
  const [character, setCharacter] = useState("snoopy1");
  const [userLevel, setUserLevel] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 새로 추가된 중복 실행 방지 플래그!!
  const [isChanging, setIsChanging] = useState(false);

  // 프로필 데이터 불러오기
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getMyProfile();

        const charImg = data.characterImage || "snoopy1";

        setCharName(data.characterName || "캐릭터");
        setUserLevel(data.level);
        setCharacter(charImg);

        // 현재 캐릭터 위치로 캐러셀 이동
        const idx = characterList.findIndex((c) => c.id === charImg);
        if (idx >= 0) setCurrentIndex(idx);
      } catch (error) {
        console.error("프로필 로드 실패:", error);
        alert("사용자 정보를 불러오는 데 실패했습니다.");
      }
    };

    loadProfile();
  }, []);

  // 캐릭터 이미지 렌더링
  const renderCharacterImage = () => {
    const imgSrc = characterImageMap[character] || characterImageMap.snoopy1;
    return <img src={imgSrc} alt={character} className="character-img" />;
  };

  // 캐러셀 이동
  const handlePrev = useCallback(
    () => setCurrentIndex((prev) => (prev - 1 + characterList.length) % characterList.length),
    []
  );

  const handleNext = useCallback(
    () => setCurrentIndex((prev) => (prev + 1) % characterList.length),
    []
  );

  const getVisibleCharacters = useCallback(() => {
    const first = currentIndex;
    const second = (currentIndex + 1) % characterList.length;
    return [characterList[first], characterList[second]];
  }, [currentIndex]);

  // 캐릭터 이름 변경
  const handleCharNameChange = async () => {
    const trimmed = newName.trim();

    if (!trimmed || trimmed === charName) {
      setMode("view");
      return;
    }

    try {
      await updateCharacterName(trimmed);

      setCharName(trimmed);
      setNewName("");
      setMode("view");

      alert("캐릭터 이름이 변경되었습니다.");
    } catch (error) {
      console.error(error);
      alert("캐릭터 이름 변경 실패: " + error.message);
    }
  };

  // 캐릭터 이미지 변경
  const handleCharacterChange = async (charId, minLevel) => {
    // 이미 실행 중이면 실행하지 않음 (🔥 핵심)
    if (isChanging) return;
    setIsChanging(true);

    if (userLevel < minLevel) {
      alert(`레벨이 부족합니다. (필요: Lv.${minLevel})`);
      setIsChanging(false);
      return;
    }

    if (character === charId) {
      setMode("view");
      setIsChanging(false);
      return;
    }

    try {
      await updateCharacterImage(charId);
      setCharacter(charId);

      const idx = characterList.findIndex((c) => c.id === charId);
      if (idx >= 0) setCurrentIndex(idx);

      setMode("view");
      alert("캐릭터가 변경되었습니다.");
    } catch (error) {
      console.error(error);
      alert("캐릭터 변경 실패: " + error.message);
    }

    // 다시 클릭 가능
    setIsChanging(false);
  };

  const visibleCharacters = getVisibleCharacters();

  return (
    <>
      <Header1 isLoggedIn={true} />
      <Header2 isLoggedIn={true} />

      <div className="character-container">
        <div className="character-left">{renderCharacterImage()}</div>

        <div className="character-right">
          {/* 보기 모드 */}
          {mode === "view" && (
            <div className="character-card">
              <h2 className="character-title">캐릭터</h2>

              <div className="info-row">
                <span className="label">이름</span>
                <span className="value">{charName}</span>
              </div>

              <div className="info-row">
                <span className="label">레벨</span>
                <span className="value">{userLevel} level</span>
              </div>

              <div className="btn-group">
                <button
                  onClick={() => {
                    setNewName(charName);
                    setMode("rename");
                  }}
                  className="yellow-btn"
                >
                  캐릭터 이름 변경
                </button>

                <button onClick={() => setMode("change")} className="yellow-btn">
                  캐릭터 변경
                </button>
              </div>
            </div>
          )}

          {/* 이름 변경 모드 */}
          {mode === "rename" && (
            <div className="character-card">
              <h2 className="character-title">캐릭터 이름 변경</h2>

              <div className="info-row">
                <span className="label">현재 이름</span>
                <span className="value">{charName}</span>
              </div>

              <div className="info-row">
                <span className="label">새 이름</span>
                <input
                  type="text"
                  className="input-box"
                  value={newName}
                  placeholder="새 이름 입력"
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>

              <div className="btn-group">
                <button onClick={handleCharNameChange} className="yellow-btn">
                  변경
                </button>
                <button onClick={() => setMode("view")} className="gray-btn">
                  취소
                </button>
              </div>
            </div>
          )}

          {/* 캐릭터 변경 모드 */}
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
                    const isSelected = character === char.id;
                    const imgSrc = characterImageMap[char.id];

                    return (
                      <div
                        key={char.id}
                        className={`character-option ${
                          isSelected ? "selected" : ""
                        } ${locked ? "locked" : ""}`}
                      >
                        <div className="character-image-container">
                          <img src={imgSrc} alt={char.name} className="select-img" />

                          {locked && <img src={lockIcon} className="lock-icon" alt="잠김" />}
                        </div>

                        <p>
                          {char.name}
                          {locked && (
                            <span className="locked-text"> (Lv.{char.minLevel})</span>
                          )}
                        </p>

                        <button
                          className="yellow-btn"
                          disabled={locked}
                          onClick={() => handleCharacterChange(char.id, char.minLevel)}
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

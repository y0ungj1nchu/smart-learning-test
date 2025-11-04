import React, { useState, useEffect } from "react";
import Header1 from "../../../components/common/Header1";
import Header2 from "../../../components/common/Header2";
import "../../../styles/character/CharacterPage.css";

// --- 1. 이미지 임포트 ---
import snoopy1 from "../../../assets/snoopy1.png";
import snoopy2 from "../../../assets/snoopy2.png";
import snoopy3 from "../../../assets/snoopy3.png";
import snoopy4 from "../../../assets/snoopy4.png";
import snoopy5 from "../../../assets/snoopy5.png";
import lockIcon from "../../../assets/lock.png";

// --- 2. API 임포트 (updateNickname 대신 updateCharacterName 사용) ---
import { getMyProfile, updateCharacterName, updateCharacterImage } from "../../../utils/api";

// --- 3. DB ID와 이미지 매핑 (DB에는 "snoopy1" 문자열 저장) ---
const characterImageMap = {
  snoopy1: snoopy1,
  snoopy2: snoopy2,
  snoopy3: snoopy3,
  snoopy4: snoopy4,
  snoopy5: snoopy5,
};

// --- 4. 캐릭터 리스트 및 레벨 요구 사항 (minLevel) ---
const characterList = [
  { id: "snoopy1", name: "스누피1", minLevel: 1 },
  { id: "snoopy2", name: "스누피2", minLevel: 2 },
  { id: "snoopy3", name: "스누피3", minLevel: 3 },
  { id: "snoopy4", name: "스누피4", minLevel: 4 },
  { id: "snoopy5", name: "스누피5", minLevel: 5 },
];

function CharacterPage() {
  const [mode, setMode] = useState("view");
  const [charName, setCharName] = useState("...로딩"); // 캐릭터 이름
  const [newName, setNewName] = useState(""); // 변경용 입력칸
  const [character, setCharacter] = useState("snoopy1"); // 캐릭터 이미지 ID
  const [userLevel, setUserLevel] = useState(1); // 사용자 레벨
  const [currentIndex, setCurrentIndex] = useState(0);

  // --- 5. API로 현재 정보 불러오기 ---
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const data = await getMyProfile();
        // 계정 닉네임(data.nickname)이 아닌 캐릭터 닉네임(data.characterName) 사용
        setCharName(data.characterName || '캐릭터'); 
        setUserLevel(data.level); // DB에서 레벨 불러오기
        setCharacter(data.characterImage || "snoopy1"); // DB에서 이미지 ID 불러오기
      } catch (error) {
        console.error("캐릭터 페이지 프로필 로드 실패:", error);
        alert("사용자 정보를 불러오는 데 실패했습니다.");
      }
    };
    fetchProfileData();
  }, []);

  // --- 6. "캐릭터 닉네임" 변경 API 호출 ---
  const handleCharNameChange = async () => {
    if (!newName.trim() || newName === charName) {
      setMode("view");
      return;
    }
    try {
      await updateCharacterName(newName.trim()); // API 호출
      setCharName(newName.trim()); 
      setMode("view");
      setNewName("");
      alert("캐릭터 이름이 변경되었습니다.");
    } catch (error) {
      alert("캐릭터 이름 변경에 실패했습니다: " + error.message);
    }
  };

  // --- 7. "캐릭터 이미지" 변경 API 호출 ---
  const handleCharacterChange = async (charId, minLevel) => {
    // (중요) 레벨 체크
    if (userLevel < minLevel) {
        alert("레벨이 낮아 잠금 해제되지 않았습니다.");
        return;
    }
    if (character === charId) {
      setMode("view");
      return;
    }
    try {
      await updateCharacterImage(charId); // API 호출
      setCharacter(charId); 
      setMode("view");
      alert("캐릭터가 변경되었습니다.");
    } catch (error) {
      alert("캐릭터 변경에 실패했습니다: " + error.message);
    }
  };

  // 현재 state(문자열 ID)에 맞는 이미지 객체를 맵에서 찾아 반환
  const renderCharacterImage = () => {
    const selectedImgSrc = characterImageMap[character] || characterImageMap.snoopy1;
    return <img src={selectedImgSrc} alt={character} className="character-img" />;
  };

  // ( ... 캐러셀 이동 함수 ... )
  const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + characterList.length) % characterList.length);
  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % characterList.length);
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
          
          {/* --- [보기 모드] --- */}
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
                <button onClick={() => { setNewName(charName); setMode("rename"); }} className="yellow-btn">
                  캐릭터 이름 변경
                </button>
                <button onClick={() => setMode("change")} className="yellow-btn">
                  캐릭터 변경
                </button>
              </div>
            </div>
          )}

          {/* --- [이름 변경 모드] --- */}
          {mode === "rename" && (
            <div className="character-card">
              <h2 className="character-title">캐릭터 이름 변경</h2>
              <div className="info-row">
                <span className="label">변경 전 이름</span>
                <span className="value">{charName}</span>
              </div>
              <div className="info-row">
                <span className="label">새로운 이름</span>
                <input
                  type="text" placeholder="새 이름 입력" value={newName}
                  onChange={(e) => setNewName(e.target.value)} className="input-box"
                />
              </div>
              <div className="btn-group">
                <button onClick={handleCharNameChange} className="yellow-btn">
                  이름 변경
                </button>
                <button onClick={() => setMode("view")} className="gray-btn">
                  취소
                </button>
              </div>
            </div>
          )}

          {/* --- [캐릭터 변경 모드] (레벨 잠금 로직) --- */}
          {mode === "change" && (
            <div className="character-card">
              <h2 className="character-title">캐릭터 변경</h2>
              <div className="carousel-wrapper">
                <button className="arrow-btn left" onClick={handlePrev}>&lt;</button>
                <div className="character-carousel">
                  {visibleCharacters.map((char) => {
                    
                    // --- (🔥🔥🔥 핵심 로직) ---
                    const locked = userLevel < char.minLevel; 
                    // -----------------------

                    const isSelected = character === char.id;
                    const imgSrc = characterImageMap[char.id]; 

                    return (
                      <div
                        key={char.id}
                        className={`character-option ${isSelected ? "selected" : ""} ${locked ? "locked" : ""}`}
                        onClick={() => !locked && handleCharacterChange(char.id, char.minLevel)}
                      >
                        <div className="character-image-container">
                          <img src={imgSrc} alt={char.name} className="select-img" />
                          {/* 레벨이 낮으면 잠금 아이콘 표시 */}
                          {locked && (<img src={lockIcon} alt="잠금" className="lock-icon"/>)}
                        </div>
                        <p>
                          {char.name}
                          {/* 레벨이 낮으면 필요 레벨 표시 */}
                          {locked && (<span className="locked-text"> (Lv.{char.minLevel})</span>)}
                        </p>
                        <button
                          className="yellow-btn"
                          disabled={locked} // 레벨이 낮으면 버튼 비활성화
                          onClick={() => handleCharacterChange(char.id, char.minLevel)}
                        >
                          {locked ? "잠김" : "선택"}
                        </button>
                      </div>
                    );
                  })}
                </div>
                <button className="arrow-btn right" onClick={handleNext}>&gt;</button>
              </div>
              <div className="btn-group">
                <button onClick={() => setMode("view")} className="gray-btn">취소</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default CharacterPage;
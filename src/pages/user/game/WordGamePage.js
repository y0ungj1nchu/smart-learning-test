import React from "react";
import Header1 from "../../../components/common/Header1";
import Header2 from "../../../components/common/Header2";
import folderIcon from "../../../assets/folder-open.png";
import "../../../styles/game/WordGame.css";
import { useNavigate } from "react-router-dom";

export default function WordGamePage() {
  const navigate = useNavigate();

  // 예시 week1~7
  const presets = [
    {
      name: "토익 영단어 week1",
      wordList: [
        { word: "abandon", correct: "버리다", options: ["버리다", "잡다", "도망가다", "지키다"] },
        { word: "benefit", correct: "이익", options: ["이익", "손실", "계획", "조건"] },
        { word: "consider", correct: "고려하다", options: ["고려하다", "잊다", "결정하다", "돕다"] },
      ],
    },
    {
      name: "토익 영단어 week2",
      wordList: [
        { word: "expand", correct: "확장하다", options: ["확장하다", "축소하다", "유지하다", "교체하다"] },
        { word: "maintain", correct: "유지하다", options: ["유지하다", "포기하다", "추정하다", "대체하다"] },
        { word: "require", correct: "요구하다", options: ["요구하다", "제공하다", "거절하다", "기록하다"] },
      ],
    },
    {
      name: "토익 영단어 week3",
      wordList: [
        { word: "efficient", correct: "효율적인", options: ["효율적인", "불필요한", "느슨한", "분명한"] },
        { word: "assess", correct: "평가하다", options: ["평가하다", "기대하다", "증가하다", "감소하다"] },
        { word: "attend", correct: "참석하다", options: ["참석하다", "거절하다", "방해하다", "준비하다"] },
      ],
    },
    {
      name: "토익 영단어 week4",
      wordList: [
        { word: "determine", correct: "결정하다", options: ["결정하다", "망설이다", "예상하다", "참가하다"] },
        { word: "evaluate", correct: "평가하다", options: ["평가하다", "증가하다", "추가하다", "포기하다"] },
      ],
    },
    {
      name: "토익 영단어 week5",
      wordList: [
        { word: "generate", correct: "생성하다", options: ["생성하다", "멈추다", "요청하다", "낭비하다"] },
        { word: "analyze", correct: "분석하다", options: ["분석하다", "무시하다", "참가하다", "기록하다"] },
      ],
    },
    {
      name: "토익 영단어 week6",
      wordList: [
        { word: "conduct", correct: "수행하다", options: ["수행하다", "방해하다", "조사하다", "포기하다"] },
        { word: "achieve", correct: "달성하다", options: ["달성하다", "거절하다", "기록하다", "참가하다"] },
      ],
    },
    {
      name: "토익 영단어 week7",
      wordList: [
        { word: "distribute", correct: "분배하다", options: ["분배하다", "모으다", "수행하다", "거절하다"] },
        { word: "improve", correct: "향상시키다", options: ["향상시키다", "유지하다", "변경하다", "포기하다"] },
      ],
    },
  ];

  // 업로드 핸들러
  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const json = JSON.parse(text);
      const setName = json.setName || "업로드 세트";
      const wordList = Array.isArray(json.wordList) ? json.wordList : [];
      if (!wordList.length) {
        alert("유효한 wordList가 없습니다.");
        return;
      }
      navigate("/user/game/quiz", { state: { setName, wordList } });
    } catch {
      alert("JSON 파싱 오류입니다.");
    } finally {
      e.target.value = "";
    }
  };

  return (
    <>
      <Header1 isLoggedIn={true} />
      <Header2 isLoggedIn={true} />

      <div className="wordgame-page">
        {/* 타이틀 + 업로드 */}
        <div className="wordgame-header-section">
          <h2 className="wordgame-title">단어 맞추기</h2>

          <label className="wordgame-upload-card">
            <div className="wordgame-upload-inner">
              <span className="wordgame-plus-icon"> + </span>
              <span>파일 업로드</span>
              {/* JSON (setName, sordList),
              각 문제는 word, correct, opitons 필드 포함해야 함 */}
            </div>
            <input type="file" accept="application/json" onChange={handleUpload} hidden />
          </label>
        </div>

        <div className="wordgame-folder-container">
          {presets.map((set) => (
            <div
              className="wordgame-folder-card"
              key={set.name}
              onClick={() =>
                navigate("/user/game/quiz", { state: { setName: set.name, wordList: set.wordList } })
              }
            >
              <img src={folderIcon} alt="folder" />
              <p>{set.name}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

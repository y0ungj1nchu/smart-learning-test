import React from "react";
import Header1 from "../../../components/common/Header1";
import Header2 from "../../../components/common/Header2";
import folderIcon from "../../../assets/folder-open.png";
import "../../../styles/game/WordGame.css";
import { useNavigate } from "react-router-dom";

export default function WordGamePageBasic() {
  const navigate = useNavigate();

  const PRESET_WORDSETS = [
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
    {
      name: "산성비 test",
      wordList: [
        { word: "acid",     correct: "산",    options: ["산","염기","중성","수용액"] },
        { word: "rain",     correct: "비",    options: ["비","눈","안개","이슬"] },
        { word: "erosion",  correct: "침식",  options: ["침식","증발","응결","응집"] },
      ],
    },
  ];

  const startPreset = (preset) => {
    navigate("/user/game/quiz", {
      state: {
        setName: preset.name,
        wordList: preset.wordList,
        origin: "preset",
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
            {PRESET_WORDSETS.map((preset) => (
              <div
                className="wordgame-folder-card"
                key={preset.name}
                onClick={() => startPreset(preset)}
                style={{ cursor: "pointer" }}
              >
                <div className="wordgame-folder-left">
                  <img src={folderIcon} alt="folder" />
                  <p>{preset.name}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
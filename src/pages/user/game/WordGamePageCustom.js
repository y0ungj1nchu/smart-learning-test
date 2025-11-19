import React, { useState, useRef } from "react";
import Header1 from "../../../components/common/Header1";
import Header2 from "../../../components/common/Header2";
import folderIcon from "../../../assets/folder-open.png";
import deleteIcon from "../../../assets/delete.png";
import "../../../styles/game/WordGame.css";
import { useNavigate } from "react-router-dom";

import {
  uploadWordSet,
  getWordsForSet,
  downloadWordTemplate,
} from "../../../utils/api";

import { useWordSets } from "../../../context/WordSetContext";

export default function WordGamePageCustom() {
  const navigate = useNavigate();
  const { userSets, addUserSet, deleteUserSet } = useWordSets();

  const [setTitle, setSetTitle] = useState("");
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  // CSV 파일 선택
  const handleFileChange = (e) => {
    const selected = e.target.files?.[0] || null;
    setFile(selected);
  };

  // 업로드 → 단어장 등록 (백엔드 연결)
  const handleUpload = async () => {
    if (!setTitle.trim()) {
      alert("세트 이름을 입력하세요.");
      return;
    }
    if (!file) {
      alert("CSV 파일을 선택하세요.");
      return;
    }

    try {
      const data = await uploadWordSet(setTitle.trim(), file);

      // 백엔드가 반환한 newSet 정보 사용
      // newSet: { id, setTitle, createdAt, ... }
      addUserSet(data.newSet.id, data.newSet.setTitle);

      alert("단어장이 등록되었습니다!");

      // 입력값 초기화
      setSetTitle("");
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("단어장 업로드 실패:", error);
      alert(error.message || "단어장 업로드 중 오류가 발생했습니다.");
    }
  };

  // CSV 템플릿 다운로드 (백엔드에서 내려주는 템플릿)
  const handleDownloadTemplate = () => {
    downloadWordTemplate();
  };

  // 단어장 클릭 → 퀴즈 시작 (백엔드에서 단어 가져오기)
  const startQuiz = async (setObj) => {
    try {
      const data = await getWordsForSet(setObj.id);

      navigate("/user/game/quiz", {
        state: {
          setName: data.setName,
          wordList: data.wordList,
          origin: "custom",
        },
      });
    } catch (error) {
      console.error("단어장 불러오기 실패:", error);
      alert(error.message || "단어장을 불러오는 중 오류가 발생했습니다.");
    }
  };

  return (
    <>
      <Header1 isLoggedIn={true} />
      <Header2 isLoggedIn={true} />

      <div className="wordgame-page">
        <h2 className="wordgame-title">내 단어 맞추기</h2>

        {/* 업로드 섹션 */}
        <div className="wordgame-header-section">
          <input
            className="wordgame-name-input"
            type="text"
            placeholder="세트 이름"
            value={setTitle}
            onChange={(e) => setSetTitle(e.target.value)}
          />

          <label className="wordgame-upload-card">
            <div className="wordgame-upload-inner">
              <span className="wordgame-plus-icon">+</span>
              <span>{file ? "선택 완료" : "CSV 파일 선택"}</span>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              hidden
            />
          </label>

          <button className="wordgame-nav-btn" onClick={handleUpload}>
            등록하기
          </button>

          <button
            className="wordgame-nav-btn"
            onClick={handleDownloadTemplate}
          >
            템플릿 다운로드
          </button>
        </div>

        {/* 사용자 단어장 목록 */}
        <section style={{ marginTop: "20px" }}>
          <div className="wordgame-folder-container">
            {userSets.length === 0 ? (
              <p>아직 단어장이 없습니다.</p>
            ) : (
              userSets.map((setObj) => (
                <div className="wordgame-folder-card" key={setObj.id}>
                  <div
                    className="wordgame-folder-left"
                    onClick={() => startQuiz(setObj)}
                    style={{ cursor: "pointer" }}
                  >
                    <img src={folderIcon} alt="folder" />
                    <p>{setObj.setTitle}</p>
                  </div>

                  <button
                    className="wordgame-delete-btn"
                    onClick={(e) => {
                      e.stopPropagation(); // 폴더 클릭 이벤트 막기
                      deleteUserSet(setObj.id);
                    }}
                  >
                    <img src={deleteIcon} alt="delete" />
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </>
  );
}

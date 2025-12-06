import React, { useState, useEffect, useRef } from "react";
import Header1 from "../../../components/common/Header1";
import Header2 from "../../../components/common/Header2";

import folderIcon from "../../../assets/folder-open.png";
import deleteIcon from "../../../assets/delete.png";
import "../../../styles/game/WordGame.css";

import { useNavigate } from "react-router-dom";
import {
  uploadWordSetAPI,
  fetchWordSetsAPI,
  deleteWordSetAPI,
  downloadTemplateAPI,
} from "../../../utils/api";

export default function WordGamePageCustom() {
  const navigate = useNavigate();

  // 단어장 목록
  const [wordSets, setWordSets] = useState([]);

  // 업로드 관련
  const [setTitle, setSetTitle] = useState("");
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  /* ---------------------------------------------------------
     1) 페이지 로드시 사용자 단어장 목록 가져오기
  --------------------------------------------------------- */
  const loadWordSets = async () => {
    try {
      const data = await fetchWordSetsAPI();
      setWordSets(data.wordsets); // [{ id, setTitle, createdAt }]
    } catch (err) {
      console.error("단어장 목록 불러오기 실패:", err);
      alert("단어장 목록을 불러올 수 없습니다.");
    }
  };

  useEffect(() => {
    loadWordSets();
  }, []);

  /* ---------------------------------------------------------
     2) 파일 선택
  --------------------------------------------------------- */
  const handleFileChange = (e) => {
    const selected = e.target.files?.[0] || null;
    setFile(selected);
  };

  /* ---------------------------------------------------------
     3) XLSX 업로드
  --------------------------------------------------------- */
  const handleUpload = async () => {
    if (!setTitle.trim()) {
      alert("세트 이름을 입력하세요.");
      return;
    }
    if (!file) {
      alert("엑셀 파일(.xlsx, .xls)을 선택하세요.");
      return;
    }

    try {
      await uploadWordSetAPI(setTitle.trim(), file);

      alert("단어장이 등록되었습니다!");

      // 입력 초기화
      setSetTitle("");
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      // 목록 다시 불러오기
      loadWordSets();
    } catch (err) {
      console.error("단어장 업로드 실패:", err);
      alert(err.message || "업로드 중 오류가 발생했습니다.");
    }
  };

  /* ---------------------------------------------------------
     4) XLSX 템플릿 다운로드
  --------------------------------------------------------- */
  const handleDownloadTemplate = () => {
    downloadTemplateAPI();
  };

  /* ---------------------------------------------------------
     5) 단어장 삭제
  --------------------------------------------------------- */
  const handleDelete = async (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      await deleteWordSetAPI(id);
      loadWordSets();
    } catch (err) {
      console.error("삭제 실패:", err);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  /* ---------------------------------------------------------
     6) 단어장 클릭 → 퀴즈 시작
        이때 wordList를 넘기지 않고 id만 넘김
  --------------------------------------------------------- */
  const startQuiz = (id, title) => {
    navigate("/user/game/quiz", {
      state: {
        setId: id,
        setName: title,
      },
    });
  };

  return (
    <>
      <Header1/>
      <Header2/>
      <div className="page-content" style={{ paddingTop: "93px", minHeight: "calc(100vh-93px)", boxSizing: "border-box", }}>
        <div className="wordgame-page">
          <h2 className="wordgame-title">내 단어 맞추기</h2>

          {/* 업로드 영역 */}
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
                <span>{file ? "선택 완료" : "엑셀 파일 선택 (.xlsx)"}</span>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
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

          {/* 단어장 목록 */}
          <section style={{ width: "100%", marginTop: "20px" }}>
            <div className="wordgame-folder-container">
              {wordSets.length === 0 ? (
                <p style={{ gridColumn: "1 / span 3", color: "#777" }}>
                  아직 단어장이 없습니다.
                </p>
              ) : (
                wordSets.map((setObj) => (
                  <div className="wordgame-folder-card" key={setObj.id}>
                    <div
                      className="wordgame-folder-left"
                      onClick={() => startQuiz(setObj.id, setObj.setTitle)}
                    >
                      <img src={folderIcon} alt="folder" />
                      <p>{setObj.setTitle}</p>
                    </div>

                    <button
                      className="wordgame-delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(setObj.id);
                      }}
                    >
                      <img
                        src={deleteIcon}
                        alt="delete"
                        className="wordgame-delete-icon"
                      />
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

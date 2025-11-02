import React, { useState } from "react";
import Header1 from "../../../components/common/Header1";
import Header2 from "../../../components/common/Header2";
import folderIcon from "../../../assets/folder-open.png";
import deleteIcon from "../../../assets/delete.png";
import "../../../styles/game/WordGame.css";
import { useNavigate } from "react-router-dom";
import { useWordSets } from "../../../context/WordSetContext";
import { getWordsForSet } from "../../../utils/api"; // (이전 단계에서 수정)


// (CSV 업로드 API 함수 ... 생략)
const uploadWordSetAPI = async (setTitle, file) => {
  const formData = new FormData();
  formData.append("setTitle", setTitle);
  formData.append("wordFile", file);
  const token = localStorage.getItem("authToken"); 
  const response = await fetch("http://localhost:3001/api/words/upload", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "업로드에 실패했습니다.");
  }
  return data;
};


export default function WordGamePageCustom() {
  const navigate = useNavigate();
  const { userSets, deleteUserSet, addUserSet } = useWordSets();

  const [customName, setCustomName] = useState("");
  const [pendingFile, setPendingFile] = useState(null);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const handleFileChange = (e) => { /* ... (생략) ... */ 
    const file = e.target.files?.[0] || null;
    setPendingFile(file);
  };
  const openAlert = (msg) => { /* ... (생략) ... */ 
    setAlertMessage(msg);
    setShowAlertModal(true);
  };
  const closeAlert = () => { /* ... (생략) ... */ 
    setShowAlertModal(false);
    setAlertMessage("");
  };
  const openDeleteConfirm = (id) => { /* ... (생략) ... */ 
    setDeleteTargetId(id);
    setShowDeleteModal(true);
  };
  const cancelDelete = () => { /* ... (생략) ... */ 
    setShowDeleteModal(false);
    setDeleteTargetId(null);
  };

  // --- 수정된 부분 (async/await 및 에러 처리) ---
  const confirmDelete = async () => {
    if (deleteTargetId !== null) {
      try {
        // 1. Context의 deleteUserSet 함수를 await (API가 호출됨)
        await deleteUserSet(deleteTargetId);
        // (성공 시 모달 닫기)

      } catch (error) {
        // 2. API 실패 시 알림
        openAlert(error.message || "삭제에 실패했습니다.");
      }
    }
    // 3. 모달 닫기 및 타겟 초기화 (성공/실패 공통)
    setShowDeleteModal(false);
    setDeleteTargetId(null);
  };
  // ------------------------------------------

  const handleRegisterSet = async () => { /* ... (생략) ... */ 
    if (!customName.trim()) {
      openAlert("세트 이름을 입력해주세요.");
      return;
    }
    if (!pendingFile) {
      openAlert("CSV 파일을 선택해주세요.");
      return;
    }
    try {
      const data = await uploadWordSetAPI(customName.trim(), pendingFile);
      addUserSet(customName.trim(), []); 
      openAlert(data.message || "단어장이 등록되었습니다.");
      setCustomName("");
      setPendingFile(null);
    } catch (error) {
      openAlert(error.message || "CSV 업로드 오류입니다.");
    }
  };

  // (퀴즈 시작 함수 - 이전 단계에서 수정됨)
  const startUserSet = async (setObj) => { /* ... (생략) ... */ 
    try {
      const data = await getWordsForSet(setObj.id); 
      navigate("/user/game/quiz", {
        state: {
          setName: data.wordset.setTitle,
          wordList: data.words,
          origin: "custom",
          id: setObj.id,
        },
      });
    } catch (error) {
      alert(error.message || "단어 목록을 불러오는 데 실패했습니다.");
    }
  };
  
  
  return (
    <>
      <Header1 isLoggedIn={true} />
      <Header2 isLoggedIn={true} />

      <div className="wordgame-page">
        {/* ... (h2, 등록 폼 JSX 생략) ... */}
        <h2 className="wordgame-title">내 단어 맞추기</h2>

        <div className="wordgame-header-section">
          <input
            className="wordgame-name-input"
            type="text"
            placeholder="세트 이름"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            style={{
              width: "180px",
              height: "30px",
              padding: "10px 12px",
              borderRadius: "8px",
              border: "2px solid #ffd400",
              fontWeight: 600,
              textAlign: "center",
              backgroundColor: "#fff",
            }}
          />
          <label className="wordgame-upload-card" style={{ marginTop: "8px" }}>
            <div className="wordgame-upload-inner">
              <span className="wordgame-plus-icon">+</span>
              <span>{pendingFile ? "파일 선택 완료" : "CSV 파일 선택"}</span>
            </div>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              hidden
            />
          </label>
          <button
            className="wordgame-nav-btn"
            style={{ marginTop: "8px" }}
            onClick={handleRegisterSet}
          >
            등록하기
          </button>
        </div>

        {/* ... (단어장 목록 JSX 생략) ... */}
        <section style={{ width: "100%", maxWidth: "800px" }}>
          <div className="wordgame-folder-container">
            {userSets.length === 0 ? (
              <p
                style={{
                  gridColumn: "1 / span 3",
                  color: "#555",
                  fontWeight: 500,
                }}
              >
                아직 등록한 세트가 없습니다.
              </p>
            ) : (
              userSets.map((setObj) => (
                <div className="wordgame-folder-card" key={setObj.id}>
                  <div
                    className="wordgame-folder-left"
                    onClick={() => startUserSet(setObj)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      flex: 1,
      
                      cursor: "pointer",
                    }}
                  >
                    <img src={folderIcon} alt="folder" />
                    <p>{setObj.setName}</p>
                  </div>
                  <button
                    className="wordgame-delete-btn"
                    onClick={() => openDeleteConfirm(setObj.id)}
                    aria-label="delete uploaded set"
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

      {/* ... (모달 JSX 생략) ... */}
      {showAlertModal && (
        <div className="modal-overlay" onClick={closeAlert}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-text">{alertMessage}</div>
            <div className="modal-btn-row">
              <button className="modal-btn" onClick={closeAlert}>
                확인
              </button>
            </div>
          </div>
        </div>
      )}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={cancelDelete}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-text">정말 지우시겠습니까?</div>
            <div className="modal-btn-row">
              <button className="modal-btn-cancel" onClick={cancelDelete}>
                취소
              </button>
              <button className="modal-btn-danger" onClick={confirmDelete}>
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
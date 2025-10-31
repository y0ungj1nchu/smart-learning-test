import React, { useState } from "react";
import Header1 from "../../../components/common/Header1";
import Header2 from "../../../components/common/Header2";
import folderIcon from "../../../assets/folder-open.png";
import deleteIcon from "../../../assets/delete.png";
import "../../../styles/game/WordGame.css";
import { useNavigate } from "react-router-dom";
import { useWordSets } from "../../../context/WordSetContext";

export default function WordGamePageCustom() {
  const navigate = useNavigate();
  const { userSets, addUserSet, deleteUserSet } = useWordSets();

  // 업로드 관련 상태
  const [customName, setCustomName] = useState("");
  const [pendingFile, setPendingFile] = useState(null);

  // 모달 상태 (알림용)
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  // 모달 상태 (삭제 확인용)
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  // 파일 선택
  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setPendingFile(file);
  };

  // Alert 모달 열기
  const openAlert = (msg) => {
    setAlertMessage(msg);
    setShowAlertModal(true);
  };

  // Alert 모달 닫기
  const closeAlert = () => {
    setShowAlertModal(false);
    setAlertMessage("");
  };

  // 삭제 모달 열기
  const openDeleteConfirm = (id) => {
    setDeleteTargetId(id);
    setShowDeleteModal(true);
  };

  // 삭제 모달 취소
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteTargetId(null);
  };

  // "삭제" 최종 확정
  const confirmDelete = () => {
    if (deleteTargetId !== null) {
      deleteUserSet(deleteTargetId);
    }
    setShowDeleteModal(false);
    setDeleteTargetId(null);
  };

  // 세트 등록
  const handleRegisterSet = async () => {
    if (!customName.trim()) {
      openAlert("세트 이름을 입력해주세요.");
      return;
    }

    // 파일 이름 중복
    const isDuplicateName = userSets.some(
      (s) => s.setName === customName.trim()
    );
    if (isDuplicateName) {
      openAlert("이미 존재하는 세트 이름입니다.");
      return;
    }
    
    if (!pendingFile) {
      openAlert("JSON 파일을 선택해주세요.");
      return;
    }

    try {
      const text = await pendingFile.text();
      const json = JSON.parse(text);

      const wordList = Array.isArray(json.wordList) ? json.wordList : [];

      if (!wordList.length) {
        openAlert("유효한 단어 목록이 없습니다.");
        return;
      }

      // 정상 등록
      addUserSet(customName.trim(), wordList);

      // 초기화
      setCustomName("");
      setPendingFile(null);
    } catch {
      openAlert("JSON 파싱 오류입니다.\n올바른 형식을 사용하세요.");
    }
  };

  const startUserSet = (setObj) => {
    navigate("/user/game/quiz", {
      state: {
        setName: setObj.setName,
        wordList: setObj.wordList,
        origin: "custom",
        id: setObj.id,
      },
    });
  };
  
  return (
    <>
      <Header1 isLoggedIn={true} />
      <Header2 isLoggedIn={true} />

      <div className="wordgame-page">
        <h2 className="wordgame-title">내 단어 맞추기</h2>

        {/* 업로드 + 이름 입력 폼 */}
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
              <span>{pendingFile ? "파일 선택 완료" : "JSON 파일 선택"}</span>
            </div>
            <input
              type="file"
              accept="application/json"
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

        {/* 사용자가 등록한 세트 목록만 */}
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

      {/* 알림 모달 */}
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

      {/* 삭제 확인 모달 */}
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
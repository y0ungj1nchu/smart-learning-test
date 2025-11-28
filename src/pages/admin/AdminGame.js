// src/pages/admin/AdminGame.js

import React, { useState, useMemo, useEffect } from "react";
import AdminHeader1 from "../../components/common/AdminHeader1";
import AdminHeader2 from "../../components/common/AdminHeader2";
import "../../styles/admin/AdminGame.css";
import { Search } from "lucide-react";

import {
  getAdminWordSets,
  createAdminWordSet,
  deleteAdminWordSet,
  getAdminWordsBySet,
  addAdminWord,
  deleteAdminWord,
  updateAdminWord,
  uploadAdminWordExcel,
} from "../../utils/api";

export default function AdminGame() {
  const [sets, setSets] = useState([]);

  const [newSetName, setNewSetName] = useState("");

  // 엑셀 업로드로 읽어온 단어들
  const [uploadedWords, setUploadedWords] = useState([]);

  const [searchText, setSearchText] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");

  const [selectedSet, setSelectedSet] = useState(null);

  const [newWord, setNewWord] = useState("");
  const [newCorrect, setNewCorrect] = useState("");

  const [editingIndex, setEditingIndex] = useState(null);
  const [editingWordId, setEditingWordId] = useState(null);
  const [editWord, setEditWord] = useState("");
  const [editCorrect, setEditCorrect] = useState("");

  const [showDuplicates, setShowDuplicates] = useState(false);
  const [page, setPage] = useState(0);
  const ITEMS_PER_PAGE = 4;
  const [loading, setLoading] = useState(false);

  // ======================================================
  // 1) 세트 / 단어 로드
  // ======================================================
  useEffect(() => {
    loadSets();
  }, []);

  const loadSets = async () => {
    try {
      setLoading(true);
      const setsFromApi = await getAdminWordSets();

      const setsWithWords = await Promise.all(
        setsFromApi.map(async (set) => {
          try {
            const words = await getAdminWordsBySet(set.id);
            return { ...set, title: set.setTitle, words };
          } catch {
            return { ...set, title: set.setTitle, words: [] };
          }
        })
      );

      setSets(setsWithWords);
    } catch (err) {
      alert("세트 목록을 불러오는 중 오류가 발생했습니다.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 단일 세트 단어 새로고침
  const refreshSetWords = async (setId) => {
    try {
      const words = await getAdminWordsBySet(setId);
      setSets((prev) =>
        prev.map((s) => (s.id === setId ? { ...s, words } : s))
      );
    } catch (err) {
      alert("단어 목록을 새로고침하는 중 오류가 발생했습니다.");
    }
  };

  const currentSet = sets.find((s) => s.id === selectedSet);

  // ======================================================
  // 2) 검색 & 페이징
  // ======================================================
  const filteredSets = useMemo(() => {
    if (!searchKeyword.trim()) return sets;
    return sets.filter((set) =>
      (set.title || "").toLowerCase().includes(searchKeyword.toLowerCase())
    );
  }, [searchKeyword, sets]);

  const paginatedSets = filteredSets.slice(
    page * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE + ITEMS_PER_PAGE
  );
  const maxPage = Math.max(0, Math.ceil(filteredSets.length / ITEMS_PER_PAGE) - 1);

  // ======================================================
  // 3) 중복 단어 계산
  // ======================================================
  const duplicateInfo = useMemo(() => {
    const map = {};
    sets.forEach((set) => {
      (set.words || []).forEach((w) => {
        const key = (w.question || "").trim();
        if (!key) return;

        if (!map[key]) map[key] = new Set();
        map[key].add(set.title);
      });
    });

    return Object.entries(map)
      .filter(([_, v]) => v.size >= 2)
      .map(([question, setNames]) => ({
        question,
        sets: Array.from(setNames),
      }));
  }, [sets]);

  const totalWordCount = useMemo(
    () => sets.reduce((acc, s) => acc + ((s.words && s.words.length) || 0), 0),
    [sets]
  );

  // ======================================================
  // 4) 세트 생성 (엑셀 업로드 단어 포함)
  // ======================================================
  const createSet = async () => {
    if (!newSetName.trim()) return alert("세트 이름을 입력하세요.");

    try {
      // 1) 세트 생성
      const result = await createAdminWordSet(newSetName.trim());
      const setId = result.setId;

      // 2) 업로드된 단어 있으면 저장
      if (uploadedWords.length > 0) {
        for (const w of uploadedWords) {
          await addAdminWord(setId, w.word, w.correct);
        }
      }

      alert("세트 생성 완료!");

      setNewSetName("");
      setUploadedWords([]);

      await loadSets();
    } catch (err) {
      console.error("세트 생성 실패:", err);
      alert("세트 생성 중 오류가 발생했습니다.");
    }
  };

  // ======================================================
  // 5) 엑셀 업로드 (단어만 읽어오기)
  // ======================================================
  const handleExcelUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const response = await uploadAdminWordExcel(file);

      if (!response.words || response.words.length === 0) {
        alert("엑셀에서 단어를 찾지 못했습니다.");
        return;
      }

      setUploadedWords(response.words);

      alert(
        "엑셀 파일 분석 완료!\n세트 이름을 입력하고 [세트 추가]를 눌러 저장하세요."
      );
    } catch (err) {
      console.error(err);
      alert("엑셀 업로드 중 오류가 발생했습니다.");
    } finally {
      e.target.value = "";
    }
  };

  // ======================================================
  // 6) 세트 삭제
  // ======================================================
  const deleteSet = async (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      await deleteAdminWordSet(id);
      setSets((prev) => prev.filter((s) => s.id !== id));

      if (selectedSet === id) {
        setSelectedSet(null);
        setEditingIndex(null);
        setEditingWordId(null);
      }
    } catch (err) {
      alert("세트 삭제 중 오류가 발생했습니다.");
      console.error(err);
    }
  };

  // ======================================================
  // 7) 세트 선택
  // ======================================================
  const handleSetSelect = async (id) => {
    if (selectedSet === id) {
      setSelectedSet(null);
      setEditingIndex(null);
      setEditingWordId(null);
      return;
    }

    setSelectedSet(id);
    await refreshSetWords(id);
  };

  // ======================================================
  // 8) 단어 추가
  // ======================================================
  const addWord = async () => {
    if (!selectedSet) return alert("먼저 세트를 선택하세요.");
    if (!newWord.trim() || !newCorrect.trim())
      return alert("영단어와 뜻을 모두 입력하세요.");

    try {
      await addAdminWord(selectedSet, newWord.trim(), newCorrect.trim());
      setNewWord("");
      setNewCorrect("");
      await refreshSetWords(selectedSet);
    } catch {
      alert("단어 추가 중 오류가 발생했습니다.");
    }
  };

  // ======================================================
  // 9) 단어 삭제
  // ======================================================
  const handleDeleteWord = async (wordId) => {
    if (!window.confirm("이 단어를 삭제하시겠습니까?")) return;

    try {
      await deleteAdminWord(wordId);
      await refreshSetWords(selectedSet);
    } catch {
      alert("단어 삭제 오류 발생");
    }
  };

  // ======================================================
  // 10) 단어 수정 저장
  // ======================================================
  const saveEdit = async () => {
    if (!editingWordId) return;
    if (!editWord.trim() || !editCorrect.trim())
      return alert("단어와 뜻을 모두 입력하세요.");

    try {
      await updateAdminWord(editingWordId, editWord.trim(), editCorrect.trim());
      setEditingIndex(null);
      setEditingWordId(null);
      await refreshSetWords(selectedSet);
    } catch {
      alert("단어 수정 오류 발생");
    }
  };

  // ======================================================
  // UI
  // ======================================================
  return (
    <>
      <AdminHeader1 isLoggedIn={true} />
      <AdminHeader2 isLoggedIn={true} />

      <div className="admin-game-bg">
        <h3 className="admin-title">관리자 단어게임 관리</h3>

        {/* 검색 */}
        <div className="search-row">
          <input
            className="search-input"
            type="text"
            placeholder="세트 검색"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && setSearchKeyword(searchText)
            }
          />
          <button
            className="search-btn"
            onClick={() => setSearchKeyword(searchText)}
          >
            <Search size={18} />
          </button>
        </div>

        {/* 통계 */}
        <div className="admin-stats">
          <div className="stat-card">
            <h3>총 세트 개수</h3>
            <p>{sets.length}개</p>
          </div>

          <div className="stat-card">
            <h3>총 단어 개수</h3>
            <p>{totalWordCount}개</p>
          </div>

          <div
            className="stat-card clickable"
            onClick={() => setShowDuplicates(!showDuplicates)}
          >
            <h3>겹치는 단어</h3>
            <p>{duplicateInfo.length}개</p>
          </div>
        </div>

        {/* 중복 단어 표시 */}
        {showDuplicates && (
          <div className="duplicate-box">
            <h3 className="duplicate-title">중복 단어 상세</h3>
            <table className="word-table wide-col-table">
              <thead>
                <tr>
                  <th>단어</th>
                  <th>겹치는 세트</th>
                </tr>
              </thead>
              <tbody>
                {duplicateInfo.map((item, i) => (
                  <tr key={i}>
                    <td>{item.question}</td>
                    <td>{item.sets.join(", ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 세트 생성 + 엑셀 업로드 */}
        <div className="add-set-section">
          <input
            className="input-set"
            type="text"
            placeholder="새 세트 이름"
            value={newSetName}
            onChange={(e) => setNewSetName(e.target.value)}
          />

          <button className="yellow-btn" onClick={createSet}>
            세트 추가
          </button>

          <label className="yellow-btn excel-label">
            엑셀 업로드
            <input
              type="file"
              accept=".xls,.xlsx"
              hidden
              onChange={handleExcelUpload}
            />
          </label>
        </div>

        {/* 세트 목록 */}
        <div className="set-list-wrapper">
          <button
            className="page-btn"
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
          >
            &lt;
          </button>

          <div className="default-set-list scrollable">
            {paginatedSets.map((set) => (
              <div
                key={set.id}
                className={`default-set-card ${
                  selectedSet === set.id ? "selected" : ""
                }`}
                onClick={() => handleSetSelect(set.id)}
              >
                <h3>{set.title}</h3>
                <p>{set.words.length}개의 단어</p>

                <button
                  className="yellow-btn small delete-set-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSet(set.id);
                  }}
                >
                  삭제
                </button>
              </div>
            ))}

            {paginatedSets.length === 0 && (
              <div style={{ padding: 20, textAlign: "center" }}>
                표시할 세트가 없습니다.
              </div>
            )}
          </div>

          <button
            className="page-btn"
            disabled={page >= maxPage}
            onClick={() => setPage((p) => Math.min(maxPage, p + 1))}
          >
            &gt;
          </button>
        </div>

        {/* 단어 구성 */}
        {selectedSet && currentSet && (
          <div className="word-manager-section">
            <div className="manager-header">
              <h3>{currentSet.title} — 단어 구성</h3>
            </div>

            {/* 단어 추가 */}
            <div className="word-add-row">
              <input
                className="word-input wide"
                placeholder="영단어"
                value={newWord}
                onChange={(e) => setNewWord(e.target.value)}
              />
              <input
                className="word-input wide"
                placeholder="뜻"
                value={newCorrect}
                onChange={(e) => setNewCorrect(e.target.value)}
              />
              <button className="yellow-btn" onClick={addWord}>
                추가
              </button>
            </div>

            <table className="word-table wide-col-table">
              <thead>
                <tr>
                  <th>영단어</th>
                  <th>뜻</th>
                  <th>관리</th>
                </tr>
              </thead>

              <tbody>
                {currentSet.words.map((item, idx) => (
                  <tr key={item.id || idx}>
                    {editingIndex === idx ? (
                      <>
                        <td>
                          <input
                            className="word-input wide"
                            value={editWord}
                            onChange={(e) => setEditWord(e.target.value)}
                          />
                        </td>

                        <td>
                          <input
                            className="word-input wide"
                            value={editCorrect}
                            onChange={(e) => setEditCorrect(e.target.value)}
                          />
                        </td>

                        <td>
                          <button
                            className="yellow-btn small"
                            onClick={saveEdit}
                          >
                            저장
                          </button>

                          <button
                            className="small-btn red"
                            onClick={() => {
                              setEditingIndex(null);
                              setEditingWordId(null);
                              setEditWord("");
                              setEditCorrect("");
                            }}
                          >
                            취소
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{item.question}</td>
                        <td>{item.answer}</td>
                        <td>
                          <button
                            className="yellow-btn small"
                            onClick={() => {
                              setEditingIndex(idx);
                              setEditingWordId(item.id);
                              setEditWord(item.question);
                              setEditCorrect(item.answer);
                            }}
                          >
                            수정
                          </button>

                          <button
                            className="small-btn red"
                            onClick={() => handleDeleteWord(item.id)}
                          >
                            삭제
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}

                {currentSet.words.length === 0 && (
                  <tr>
                    <td colSpan={3} style={{ textAlign: "center", padding: 16 }}>
                      등록된 단어가 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

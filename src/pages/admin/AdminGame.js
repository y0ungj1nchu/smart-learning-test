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
  updateAdminWordSet
} from "../../utils/api";

export default function AdminGame() {
  const [sets, setSets] = useState([]);

  const [newSetName, setNewSetName] = useState("");
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

  const [editingSetId, setEditingSetId] = useState(null);
  const [editingSetTitle, setEditingSetTitle] = useState("");

  const [showDuplicates, setShowDuplicates] = useState(false);

  const [page, setPage] = useState(0);
  const ITEMS_PER_PAGE = 4;

  const [loading, setLoading] = useState(false);
  

  // ===================================================================
  // 1) 세트 / 단어 로드
  // ===================================================================
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

  const currentSet = sets.find((s) => s.id === selectedSet);

  const refreshSetWords = async (setId) => {
    try {
      const words = await getAdminWordsBySet(setId);
      setSets((prev) =>
        prev.map((s) => (s.id === setId ? { ...s, words } : s))
      );
    } catch {
      alert("단어 목록을 새로고침하는 중 오류가 발생했습니다.");
    }
  };

  // ===================================================================
  // 2) 검색 & 페이징
  // ===================================================================
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

  // ===================================================================
  // 3) 중복 단어 계산
  // ===================================================================
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

  // ===================================================================
  // 4) 세트 생성
  // ===================================================================
  const createSet = async () => {
    if (!newSetName.trim()) return alert("세트 이름을 입력하세요.");

    try {
      const result = await createAdminWordSet(newSetName.trim());
      const setId = result.setId;

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
      console.error("세트 생성 실패", err);
      alert("세트 생성 중 오류 발생");
    }
  };

  // ===================================================================
  // 5) 엑셀 단어 업로드
  // ===================================================================
  const handleExcelUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const res = await uploadAdminWordExcel(file);

      if (!res.words || res.words.length === 0) {
        alert("엑셀에서 단어를 찾지 못했습니다.");
        return;
      }

      setUploadedWords(res.words);
      alert("엑셀 분석 완료! 세트 추가 버튼을 눌러 저장하세요.");

    } catch (err) {
      console.error(err);
      alert("엑셀 업로드 실패");
    } finally {
      e.target.value = "";
    }
  };

  // ===================================================================
  // 6) 세트 삭제
  // ===================================================================
  const deleteSet = async (id) => {
    if (!window.confirm("세트를 삭제하시겠습니까?")) return;

    try {
      await deleteAdminWordSet(id);
      setSets((prev) => prev.filter((s) => s.id !== id));

      if (selectedSet === id) {
        setSelectedSet(null);
        setEditingIndex(null);
      }

    } catch (err) {
      alert("세트 삭제 오류");
    }
  };

  // ===================================================================
  // 7) 세트 선택
  // ===================================================================
  const handleSetSelect = async (id) => {
    if (selectedSet === id) {
      setSelectedSet(null);
      return;
    }

    setSelectedSet(id);
    await refreshSetWords(id);
  };

  // ===================================================================
  // 8) 단어 추가
  // ===================================================================
  const addWord = async () => {
    if (!selectedSet) return alert("먼저 세트를 선택하세요.");
    if (!newWord.trim() || !newCorrect.trim())
      return alert("단어와 뜻을 입력하세요.");

    try {
      await addAdminWord(selectedSet, newWord, newCorrect);
      setNewWord("");
      setNewCorrect("");
      await refreshSetWords(selectedSet);
    } catch {
      alert("단어 추가 실패");
    }
  };

  // ===================================================================
  // 9) 단어 삭제
  // ===================================================================
  const handleDeleteWord = async (id) => {
    if (!window.confirm("단어를 삭제하시겠습니까?")) return;

    try {
      await deleteAdminWord(id);
      await refreshSetWords(selectedSet);
    } catch {
      alert("단어 삭제 오류");
    }
  };

  // ===================================================================
  // 10) 단어 수정
  // ===================================================================
  const saveEdit = async () => {
    if (!editingWordId) return;

    try {
      await updateAdminWord(editingWordId, editWord, editCorrect);

      setEditingIndex(null);
      setEditingWordId(null);

      await refreshSetWords(selectedSet);

    } catch {
      alert("단어 수정 오류");
    }
  };

  const saveSet = async () => {
  if (!editingSetId) return;
  if (!editingSetTitle.trim()) return alert("세트 이름을 입력하세요.");

  try {
    await updateAdminWordSet(editingSetId, editingSetTitle.trim());

    // UI 업데이트
    setSets((prev) =>
      prev.map((s) =>
        s.id === editingSetId ? { ...s, title: editingSetTitle.trim() } : s
      )
    );

    setEditingSetId(null);
    setEditingSetTitle("");
    alert("세트 이름이 수정되었습니다!");
  } catch (err) {
    console.error(err);
    alert("세트 이름 수정 중 오류가 발생했습니다.");
  }
};


  // ===================================================================
  // UI (첫 번째 코드의 UI 100% 적용)
  // ===================================================================
  return (
    <>
      <AdminHeader1 />
      <AdminHeader2 />

      <div className="page-content" style={{ paddingTop: "93px" }}>
        <div className="admin-game-bg">

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
              <p>
                {sets.reduce((acc, s) => acc + (s.words?.length || 0), 0)}개
              </p>
            </div>

            <div
              className="stat-card clickable"
              onClick={() => setShowDuplicates(!showDuplicates)}
            >
              <h3>겹친 단어 개수</h3>
              <p>{duplicateInfo.length}개</p>
            </div>
          </div>

          {/* 중복 단어 상세 */}
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
                  {duplicateInfo.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.question}</td>
                      <td>{item.sets.join(", ")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 세트 추가 */}
          <div className="add-set-section">
            <input
              className="input-set"
              type="text"
              placeholder="새 세트 이름"
              value={newSetName}
              onChange={(e) => setNewSetName(e.target.value)}
            />

            <button className="yellow-btn white-accent-btn" onClick={createSet}>
              세트 추가
            </button>

            <label className="yellow-btn excel-label white-accent-btn">
              엑셀 업로드
              <input
                type="file"
                accept=".xls,.xlsx"
                onChange={handleExcelUpload}
                hidden
              />
            </label>
          </div>

          {/* 세트 카드 목록 */}
          <div className="set-list-wrapper">
            <button
              className="page-btn"
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
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
                  {/* 수정 모드 */}
                  {editingSetId === set.id ? (
                    <>
                      <div className="set-title-row">
                        <input
                          className="set-title-input"
                          value={editingSetTitle}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => setEditingSetTitle(e.target.value)}
                        />
                      </div>

                      <div className="set-bottom-row">
                        <button
                          className="yellow-btn small"
                          onClick={(e) => {
                            e.stopPropagation();
                            saveSet(); // 제목 저장 함수 필요하면 추가 가능
                          }}
                        >
                          저장
                        </button>

                        <button
                          className="yellow-btn small"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingSetId(null);
                          }}
                        >
                          취소
                        </button>

                        <button
                          className="small-btn red"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteSet(set.id);
                          }}
                        >
                          삭제
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="set-title-row">
                        <h3 className="set-title">{set.title}</h3>

                        <div className="set-title-buttons">
                          <button
                            className="yellow-btn small edit-set-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingSetId(set.id);
                              setEditingSetTitle(set.title);
                            }}
                          >
                            수정
                          </button>

                          <button
                            className="small-btn red delete-set-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteSet(set.id);
                            }}
                          >
                            삭제
                          </button>
                        </div>
                      </div>

                      <p className="set-word-count">{set.words.length}개의 단어</p>
                    </>
                  )}
                </div>
              ))}
            </div>

            <button
              className="page-btn"
              disabled={page >= maxPage}
              onClick={() => setPage((p) => p + 1)}
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

              {/* 단어 테이블 */}
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
                            <div className="word-btn-row">
                              <button className="yellow-btn small" onClick={saveEdit}>
                                저장
                              </button>

                              <button
                                className="small-btn red"
                                onClick={() => {
                                  setEditingIndex(null);
                                  setEditingWordId(null);
                                }}
                              >
                                취소
                              </button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td>{item.question}</td>
                          <td>{item.answer}</td>
                          <td>
                            <div className="word-btn-row">
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
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

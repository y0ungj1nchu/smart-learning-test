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
  updateAdminWordSet,
} from "../../utils/api";

export default function AdminGame() {
  const [menu, setMenu] = useState("sets");

  // DB 데이터
  const [sets, setSets] = useState([]);

  const [searchText, setSearchText] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");

  const [newSetName, setNewSetName] = useState("");
  const [uploadedWords, setUploadedWords] = useState([]);

  const [selectedSet, setSelectedSet] = useState(null);

  const [newWord, setNewWord] = useState("");
  const [newCorrect, setNewCorrect] = useState("");

  const [editingIndex, setEditingIndex] = useState(null);
  const [editingWordId, setEditingWordId] = useState(null);
  const [editWord, setEditWord] = useState("");
  const [editCorrect, setEditCorrect] = useState("");

  const [editingSetId, setEditingSetId] = useState(null);
  const [editingSetTitle, setEditingSetTitle] = useState("");

  const [loading, setLoading] = useState(false);

  // 세트 / 단어 로드
  useEffect(() => {
    loadSets();
  }, []);

  const loadSets = async () => {
    try {
      setLoading(true);

      const setsFromApi = await getAdminWordSets();

      const setsWithWords = await Promise.all(
        (setsFromApi || []).map(async (set) => {
          try {
            const words = await getAdminWordsBySet(set.id);
            return {
              ...set,
              title: set.setTitle ?? set.title ?? "",
              words: words || [],
            };
          } catch {
            return {
              ...set,
              title: set.setTitle ?? set.title ?? "",
              words: [],
            };
          }
        })
      );

      setSets(setsWithWords);
    } catch (err) {
      console.error(err);
      alert("세트 목록을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const refreshSetWords = async (setId) => {
    try {
      const words = await getAdminWordsBySet(setId);
      setSets((prev) =>
        prev.map((s) => (s.id === setId ? { ...s, words: words || [] } : s))
      );
    } catch (err) {
      console.error(err);
      alert("단어 목록을 새로고침하는 중 오류가 발생했습니다.");
    }
  };

  const currentSet = useMemo(
    () => sets.find((s) => s.id === selectedSet),
    [sets, selectedSet]
  );

  // 검색
  const filteredSets = useMemo(() => {
    const list = searchKeyword.trim()
      ? sets.filter((set) =>
          set.title.toLowerCase().includes(searchKeyword.toLowerCase())
        )
      : sets;

    return [...list].reverse();
  }, [searchKeyword, sets]);

  // 중복 단어 계산
  const duplicateInfo = useMemo(() => {
    const map = {};

    (sets || []).forEach((set) => {
      (set.words || []).forEach((w) => {
        const key = String(w.question ?? w.word ?? "").trim();
        if (!key) return;

        if (!map[key]) map[key] = new Set();
        map[key].add(set.title || "");
      });
    });

    return Object.entries(map)
      .filter(([_, v]) => v.size >= 2)
      .map(([word, setNames]) => ({
        word,
        sets: Array.from(setNames).filter(Boolean),
      }));
  }, [sets]);

  // 세트 생성

  const createSet = async () => {
    if (!newSetName.trim()) return alert("세트 이름을 입력하세요.");

    try {
      setLoading(true);

      const result = await createAdminWordSet(newSetName.trim());
      const setId = result?.setId;

      if (setId && uploadedWords.length > 0) {
        for (const w of uploadedWords) {
          await addAdminWord(setId, w.word, w.correct);
        }
      }

      alert("세트 생성 완료!");
      setNewSetName("");
      setUploadedWords([]);
      await loadSets();
    } catch (err) {
      console.error(err);
      alert("세트 생성 중 오류 발생");
    } finally {
      setLoading(false);
    }
  };

  // 엑셀 업로드
  const handleExcelUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);

      const res = await uploadAdminWordExcel(file);

      if (!res?.words || res.words.length === 0) {
        alert("엑셀에서 단어를 찾지 못했습니다.");
        return;
      }

      setUploadedWords(res.words);
      alert("엑셀 분석 완료! '추가' 버튼을 눌러 세트 생성 시 함께 저장하세요.");
    } catch (err) {
      console.error(err);
      alert("엑셀 업로드 실패");
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  };

  // 세트 삭제
  const handleDeleteSet = async (id) => {
    if (!window.confirm("삭제하시겠습니까?")) return;

    try {
      setLoading(true);
      await deleteAdminWordSet(id);

      setSets((prev) => prev.filter((s) => s.id !== id));

      if (selectedSet === id) {
        setSelectedSet(null);
        setEditingIndex(null);
        setEditingWordId(null);
      }
    } catch (err) {
      console.error(err);
      alert("세트 삭제 오류");
    } finally {
      setLoading(false);
    }
  };

  // 세트 선택
  const handleSetSelect = async (id) => {
    if (selectedSet === id) {
      setSelectedSet(null);
      setEditingIndex(null);
      setEditingWordId(null);
      return;
    }

    setSelectedSet(id);
    setEditingIndex(null);
    setEditingWordId(null);
    await refreshSetWords(id);
  };

  // 세트 제목 수정
  const saveSetTitle = async () => {
    if (!editingSetId) return;
    if (!editingSetTitle.trim()) return alert("세트 이름을 입력하세요.");

    try {
      setLoading(true);
      await updateAdminWordSet(editingSetId, editingSetTitle.trim());

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
    } finally {
      setLoading(false);
    }
  };

  // 단어 추가
  const handleAddWord = async () => {
    if (!selectedSet) return alert("먼저 세트를 선택하세요.");
    if (!newWord.trim() || !newCorrect.trim())
      return alert("영단어와 뜻을 모두 입력하세요.");

    try {
      setLoading(true);
      await addAdminWord(selectedSet, newWord.trim(), newCorrect.trim());
      setNewWord("");
      setNewCorrect("");
      await refreshSetWords(selectedSet);
    } catch (err) {
      console.error(err);
      alert("단어 추가 실패");
    } finally {
      setLoading(false);
    }
  };

  // 단어 삭제
  const handleDeleteWord = async (wordId) => {
    if (!window.confirm("단어를 삭제하시겠습니까?")) return;

    try {
      setLoading(true);
      await deleteAdminWord(wordId);
      await refreshSetWords(selectedSet);
    } catch (err) {
      console.error(err);
      alert("단어 삭제 오류");
    } finally {
      setLoading(false);
    }
  };

  // 단어 수정
  const saveWordEdit = async () => {
    if (!editingWordId) return;

    try {
      setLoading(true);
      await updateAdminWord(editingWordId, editWord, editCorrect);

      setEditingIndex(null);
      setEditingWordId(null);
      setEditWord("");
      setEditCorrect("");

      await refreshSetWords(selectedSet);
    } catch (err) {
      console.error(err);
      alert("단어 수정 오류");
    } finally {
      setLoading(false);
    }
  };

  const renderStatus = () => (
    <div className="right-card status">
      <h2>단어게임 현황</h2>

      <div className="status-column">
        <div className="stat-box">
          <h3>총 세트 개수</h3>
          <p>{sets.length}개</p>
        </div>

        <div className="stat-box">
          <h3>총 단어 개수</h3>
          <p>{sets.reduce((t, s) => t + (s.words?.length || 0), 0)}개</p>
        </div>
      </div>
    </div>
  );

  const renderDuplicates = () => (
    <div className="right-card">
      <h2>겹친 단어</h2>

      <table className="word-table duplicate-table">
        <thead>
          <tr>
            <th className="col-word">단어</th>
            <th>겹치는 세트</th>
          </tr>
        </thead>

        <tbody>
          {duplicateInfo.length === 0 ? (
            <tr>
              <td colSpan={2} className="empty-text">
                겹친 단어가 없습니다.
              </td>
            </tr>
          ) : (
            duplicateInfo.map((item, i) => (
              <tr key={i}>
                <td className="col-word">{item.word}</td>
                <td>{item.sets.join(", ")}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  const renderSetManager = () => {
    const target = currentSet;

    return (
      <div className="right-card">
        <h2>세트 관리</h2>
        <div className="set-control-row">
          <div className="left-part">
            <input
              className="search-input"
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

          <div className="right-part">
            <input
              className="input-set"
              placeholder="새 세트 이름"
              value={newSetName}
              onChange={(e) => setNewSetName(e.target.value)}
            />

            <button className="yellow-btn" onClick={createSet}>
              추가
            </button>

            <label className="yellow-btn excel-label">
              엑셀 업로드
              <input
                hidden
                type="file"
                accept=".xls,.xlsx"
                onChange={handleExcelUpload}
              />
            </label>
          </div>
        </div>

        <div className="set-layout">
          {/* 세트 목록 */}
          <div className="left-set-column">
            <div className="set-list-title">세트 목록</div>

            <div className="left-set-list">
              {filteredSets.map((set) => (
                <div
                  key={set.id}
                  className={`set-item ${
                    selectedSet === set.id ? "selected" : ""
                  }`}
                  onClick={() => {
                    handleSetSelect(set.id);
                    setEditingIndex(null);
                    setEditingWordId(null);
                  }}
                >
                  <div className="set-row">
                    {editingSetId === set.id ? (
                      <>
                        <input
                          className="set-title-input"
                          value={editingSetTitle}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => setEditingSetTitle(e.target.value)}
                        />

                        <div className="set-btn-group">
                          <button
                            className="yellow-btn small"
                            onClick={(e) => {
                              e.stopPropagation();
                              saveSetTitle();
                            }}
                          >
                            저장
                          </button>

                          <button
                            className="small-btn red"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingSetId(null);
                              setEditingSetTitle("");
                            }}
                          >
                            취소
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <span className="set-title">{set.title}</span>

                        <div className="set-btn-group">
                          <button
                            className="yellow-btn small"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingSetId(set.id);
                              setEditingSetTitle(set.title);
                            }}
                          >
                            수정
                          </button>

                          <button
                            className="small-btn red"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteSet(set.id);
                            }}
                          >
                            삭제
                          </button>
                        </div>
                      </>
                    )}
                  </div>

                  <p className="set-count">단어 {set.words?.length || 0}개</p>
                </div>
              ))}

              {filteredSets.length === 0 && (
                <div className="empty-text">검색 결과가 없습니다.</div>
              )}
            </div>
          </div>

          {/* 단어 패널 */}
          <div className="word-panel">
            {selectedSet && target ? (
              <>
                <h3>{target.title}</h3>

                <div className="word-add-row">
                  <input
                    className="word-input"
                    placeholder="영단어"
                    value={newWord}
                    onChange={(e) => setNewWord(e.target.value)}
                  />
                  <input
                    className="word-input"
                    placeholder="뜻"
                    value={newCorrect}
                    onChange={(e) => setNewCorrect(e.target.value)}
                  />
                  <button className="yellow-btn" onClick={handleAddWord}>
                    추가
                  </button>
                </div>

                <div className="word-table-wrapper">
                  <table className="word-table">
                    <thead>
                      <tr>
                        <th>영단어</th>
                        <th>뜻</th>
                        <th>관리</th>
                      </tr>
                    </thead>

                    <tbody>
                      {(target.words || []).length === 0 ? (
                        <tr>
                          <td colSpan={3} className="empty-text">
                            등록된 단어가 없습니다.
                          </td>
                        </tr>
                      ) : (
                        (target.words || []).map((w, idx) => {
                          const q = w.question ?? w.word ?? "";
                          const a = w.answer ?? w.correct ?? "";

                          return (
                            <tr key={w.id ?? idx}>
                              {editingIndex === idx ? (
                                <>
                                  <td>
                                    <input
                                      className="word-input"
                                      value={editWord}
                                      onChange={(e) => setEditWord(e.target.value)}
                                    />
                                  </td>

                                  <td>
                                    <input
                                      className="word-input"
                                      value={editCorrect}
                                      onChange={(e) =>
                                        setEditCorrect(e.target.value)
                                      }
                                    />
                                  </td>

                                  <td>
                                    <div className="set-btn-group">
                                      <button
                                        className="yellow-btn small"
                                        onClick={saveWordEdit}
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
                                    </div>
                                  </td>
                                </>
                              ) : (
                                <>
                                  <td>{q}</td>
                                  <td>{a}</td>
                                  <td>
                                    <div className="set-btn-group">
                                      <button
                                        className="yellow-btn small"
                                        onClick={() => {
                                          setEditingIndex(idx);
                                          setEditingWordId(w.id);
                                          setEditWord(q);
                                          setEditCorrect(a);
                                        }}
                                      >
                                        수정
                                      </button>

                                      <button
                                        className="small-btn red"
                                        onClick={() => handleDeleteWord(w.id)}
                                      >
                                        삭제
                                      </button>
                                    </div>
                                  </td>
                                </>
                              )}
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <p className="empty-text">왼쪽에서 세트를 선택하세요.</p>
            )}
          </div>
        </div>

        {loading && <div className="loading-text">로딩 중...</div>}
      </div>
    );
  };

  return (
    <>
      <AdminHeader1 isLoggedIn={true} />
      <AdminHeader2 isLoggedIn={true} />

      <div className="admin-page">
        <div className="left-sidebar">
          <h2 className="sidebar-title">단어게임 관리</h2>

          <div
            className={`side-btn ${menu === "sets" ? "active" : ""}`}
            onClick={() => setMenu("sets")}
          >
            세트 관리
          </div>

          <div
            className={`side-btn ${menu === "dup" ? "active" : ""}`}
            onClick={() => setMenu("dup")}
          >
            겹친 단어
          </div>

          <div
            className={`side-btn ${menu === "status" ? "active" : ""}`}
            onClick={() => setMenu("status")}
          >
            단어게임 현황
          </div>
        </div>

        {/* 우측 컨텐츠 */}
        <div className="right-content">
          {menu === "sets" && renderSetManager()}
          {menu === "dup" && renderDuplicates()}
          {menu === "status" && renderStatus()}
        </div>
      </div>
    </>
  );
}

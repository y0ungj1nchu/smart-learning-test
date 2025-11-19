import React, { useState, useMemo } from "react";
import * as XLSX from "xlsx";
import AdminHeader1 from "../../components/common/AdminHeader1";
import AdminHeader2 from "../../components/common/AdminHeader2";
import "../../styles/admin/AdminGame.css";
import { Search } from "lucide-react";

export default function AdminGame() {
  const [defaultSets, setDefaultSets] = useState([
    {
      id: 1,
      title: "기본 영단어 A",
      words: [
        { word: "apple", correct: "사과" },
        { word: "age", correct: "나이" },
        { word: "animal", correct: "동물" },
      ],
    },
    {
      id: 2,
      title: "기본 영단어 B",
      words: [
        { word: "banana", correct: "바나나" },
        { word: "bag", correct: "가방" },
      ],
    },
  ]);

  const [newSetName, setNewSetName] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");

  const [selectedSet, setSelectedSet] = useState(null);
  const [newWord, setNewWord] = useState("");
  const [newCorrect, setNewCorrect] = useState("");
  const [showDuplicates, setShowDuplicates] = useState(false);

  const [editingIndex, setEditingIndex] = useState(null);
  const [editWord, setEditWord] = useState("");
  const [editCorrect, setEditCorrect] = useState("");

  const [page, setPage] = useState(0);
  const ITEMS_PER_PAGE = 4;

  /* 검색 필터링 */
  const filteredSets = useMemo(() => {
    if (!searchKeyword.trim()) return defaultSets;
    return defaultSets.filter((set) =>
      set.title.toLowerCase().includes(searchKeyword.toLowerCase())
    );
  }, [searchKeyword, defaultSets]);

  const paginatedSets = filteredSets.slice(
    page * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE + ITEMS_PER_PAGE
  );

  const maxPage = Math.ceil(filteredSets.length / ITEMS_PER_PAGE) - 1;

  /* 중복 단어 계산 */
  const duplicateInfo = useMemo(() => {
    let map = {};
    defaultSets.forEach((set) => {
      set.words.forEach((w) => {
        if (!map[w.word]) map[w.word] = [];
        map[w.word].push(set.title);
      });
    });

    return Object.entries(map)
      .filter(([_, sets]) => sets.length >= 2)
      .map(([word, sets]) => ({ word, sets }));
  }, [defaultSets]);

  /* 세트 추가 */
  const createSet = () => {
    if (!newSetName.trim()) return alert("세트 이름을 입력하세요.");
    setDefaultSets([
      ...defaultSets,
      { id: Date.now(), title: newSetName, words: [] },
    ]);
    setNewSetName("");
  };

  /* 엑셀 업로드 */
  const handleExcelUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const setName = file.name.replace(/\.[^/.]+$/, "");
    const reader = new FileReader();

    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const wb = XLSX.read(data, { type: "array" });

      const sheet = wb.Sheets[wb.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet);

      const words = json.map((row) => ({
        word: row.word,
        correct: row.correct,
      }));

      setDefaultSets((prev) => [
        ...prev,
        { id: Date.now(), title: setName, words },
      ]);
    };

    reader.readAsArrayBuffer(file);
  };

  /* 단어 추가 */
  const addWord = () => {
    if (!newWord.trim() || !newCorrect.trim())
      return alert("영단어와 뜻을 모두 입력하세요.");

    setDefaultSets((prev) =>
      prev.map((set) =>
        set.id === selectedSet
          ? { ...set, words: [...set.words, { word: newWord, correct: newCorrect }] }
          : set
      )
    );

    setNewWord("");
    setNewCorrect("");
  };

  /* 단어 삭제 */
  const deleteWord = (setId, index) => {
    setDefaultSets((prev) =>
      prev.map((set) =>
        set.id === setId
          ? { ...set, words: set.words.filter((_, i) => i !== index) }
          : set
      )
    );
  };

  /* 단어 수정 저장 */
  const saveEdit = () => {
    setDefaultSets((prev) =>
      prev.map((set) =>
        set.id === selectedSet
          ? {
              ...set,
              words: set.words.map((w, idx) =>
                idx === editingIndex
                  ? { word: editWord, correct: editCorrect }
                  : w
              ),
            }
          : set
      )
    );

    setEditingIndex(null);
    setEditWord("");
    setEditCorrect("");
  };

  /* 세트 삭제 */
  const deleteSet = (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    setDefaultSets(defaultSets.filter((s) => s.id !== id));
    if (selectedSet === id) setSelectedSet(null);
  };

  /* 세트 클릭 */
  const handleSetSelect = (id) => {
    setSelectedSet((prev) => (prev === id ? null : id));
    setEditingIndex(null);
  };

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
            onKeyDown={(e) => e.key === "Enter" && setSearchKeyword(searchText)}
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
            <p>{defaultSets.length}개</p>
          </div>

          <div className="stat-card">
            <h3>총 단어 개수</h3>
            <p>
              {defaultSets.reduce((acc, set) => acc + set.words.length, 0)}개
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
                    <td>{item.word}</td>
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

          <button className="yellow-btn" onClick={createSet}>
            세트 추가
          </button>

          <label className="yellow-btn excel-label">
            엑셀 업로드
            <input
              type="file"
              accept=".xls,.xlsx"
              onChange={handleExcelUpload}
              hidden
            />
          </label>
        </div>

        {/* 세트 목록 */}
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
          </div>

          <button
            className="page-btn"
            disabled={page >= maxPage}
            onClick={() => setPage((p) => p + 1)}
          >
            &gt;
          </button>
        </div>

        {/* 선택된 세트 단어 구성 */}
        {selectedSet && (
          <div className="word-manager-section">
            <div className="manager-header">
              <h3>
                {
                  defaultSets.find((s) => s.id === selectedSet)?.title
                }{" "}
                — 단어 구성
              </h3>
            </div>

            {/* 단어 추가 */}
            <div className="word-add-row">
              <input
                className="word-input wide"
                type="text"
                placeholder="영단어"
                value={newWord}
                onChange={(e) => setNewWord(e.target.value)}
              />

              <input
                className="word-input wide"
                type="text"
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
                {defaultSets
                  .find((s) => s.id === selectedSet)
                  ?.words.map((item, idx) => (
                    <tr key={idx}>
                      {/* 수정 모드 */}
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
                              <button
                                className="yellow-btn small"
                                onClick={saveEdit}
                              >
                                저장
                              </button>

                              <button
                                className="small-btn red"
                                onClick={() => setEditingIndex(null)}
                              >
                                취소
                              </button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td>{item.word}</td>
                          <td>{item.correct}</td>
                          <td>
                            <div className="word-btn-row">
                              <button
                                className="yellow-btn small"
                                onClick={() => {
                                  setEditingIndex(idx);
                                  setEditWord(item.word);
                                  setEditCorrect(item.correct);
                                }}
                              >
                                수정
                              </button>

                              <button
                                className="small-btn red"
                                onClick={() => deleteWord(selectedSet, idx)}
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
    </>
  );
}

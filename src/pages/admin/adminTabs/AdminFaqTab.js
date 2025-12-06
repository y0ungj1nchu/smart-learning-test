import React, { useState, useEffect } from "react";
import "../../../styles/community/Tabs.css";
import WriteTab from "./AdminWriteTab";

// 관리자 FAQ API
import {
  getAdminFaqs,
  createAdminFaq,
  updateAdminFaq,
  deleteAdminFaq,
} from "../../../utils/api";

export default function AdminFaqTab() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("new"); // 🔥 추가됨 (최신순/오래된순)
  const [isWriting, setIsWriting] = useState(false);
  const [editPost, setEditPost] = useState(null);

  const [faqList, setFaqList] = useState([]);
  const [originalList, setOriginalList] = useState([]);

  // ---------------------------------------------
  // 🔥 FAQ 불러오기
  // ---------------------------------------------
  useEffect(() => {
    loadFaqs();
  }, []);

  const loadFaqs = async () => {
    try {
      const rows = await getAdminFaqs();

      const mapped = rows.map((f) => ({
        ...f,
        time: new Date(f.createdAt).toLocaleString("ko-KR"),
      }));

      setFaqList(mapped);
      setOriginalList(mapped);
    } catch (err) {
      console.error(err);
      alert("FAQ 목록을 불러오는 중 오류가 발생했습니다.");
    }
  };

  // ---------------------------------------------
  // 🔍 검색
  // ---------------------------------------------
  const handleSearch = () => {
    if (!search.trim()) {
      setFaqList(originalList);
      return;
    }

    const keyword = search.toLowerCase();
    const filtered = originalList.filter(
      (item) =>
        item.question.toLowerCase().includes(keyword) ||
        item.answer.toLowerCase().includes(keyword)
    );

    setFaqList(filtered);
  };

  // ---------------------------------------------
  // ❌ 삭제
  // ---------------------------------------------
  const handleDelete = async (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      await deleteAdminFaq(id);
      await loadFaqs();
    } catch (err) {
      console.error(err);
      alert("FAQ 삭제 중 오류가 발생했습니다.");
    }
  };

  // ---------------------------------------------
  // 🔥 정렬 기능 (더미버전 기능 기반)
  // ---------------------------------------------
  const sortedList = [...faqList]
    .sort((a, b) =>
      sort === "new"
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt)
    )
    .map((item, index, arr) => ({
      ...item,
      no: arr.length - index, // 번호 재부여
    }));

  // ---------------------------------------------
  // ✏ 글쓰기/수정 모드
  // ---------------------------------------------
  if (isWriting || editPost) {
    return (
      <WriteTab
        mode="faq"
        editPost={editPost}
        onBack={() => {
          setIsWriting(false);
          setEditPost(null);
        }}
        onSubmit={async (post) => {
          try {
            if (editPost) {
              await updateAdminFaq(post.id, post.question, post.answer);
            } else {
              await createAdminFaq(post.question, post.answer);
            }

            await loadFaqs();
            setIsWriting(false);
            setEditPost(null);
          } catch (err) {
            console.error(err);
            alert("FAQ 저장 중 오류가 발생했습니다.");
          }
        }}
      />
    );
  }

  // ---------------------------------------------
  // 📄 목록 화면
  // ---------------------------------------------
  return (
    <div className="admin-community-tab">
      <h2>FAQ 관리</h2>

      {/* 검색 */}
      <div className="search-box">
        <input
          type="text"
          placeholder="검색하세요."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="search-btn" onClick={handleSearch}>
          검색
        </button>
      </div>

      {/* 🔥 정렬 버튼 추가 */}
      <div className="sort-row">
        <button
          className={`sort-btn ${sort === "new" ? "active" : ""}`}
          onClick={() => setSort("new")}
        >
          최신순
        </button>

        <button
          className={`sort-btn ${sort === "old" ? "active" : ""}`}
          onClick={() => setSort("old")}
        >
          오래된 순
        </button>
      </div>

      {/* 목록 */}
      <table className="table">
        <thead>
          <tr>
            <th>No</th>
            <th>질문</th>
            <th>작성시간</th>
            <th>관리</th>
          </tr>
        </thead>

        <tbody>
          {sortedList.map((item) => (
            <tr key={item.id}>
              <td>{item.no}</td>
              <td>{item.question}</td>
              <td>{item.time}</td>

              <td className="action-cell">
                <button
                  className="action-btn edit-btn"
                  onClick={() => setEditPost(item)}
                >
                  수정
                </button>

                <button
                  className="action-btn delete-btn"
                  onClick={() => handleDelete(item.id)}
                >
                  삭제
                </button>
              </td>
            </tr>
          ))}

          {sortedList.length === 0 && (
            <tr>
              <td colSpan={4} style={{ textAlign: "center", padding: 20 }}>
                등록된 FAQ가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* 글쓰기 버튼 */}
      <div className="btn-right">
        <button className="common-btn" onClick={() => setIsWriting(true)}>
          글쓰기
        </button>
      </div>
    </div>
  );
}

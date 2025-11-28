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
  const [isWriting, setIsWriting] = useState(false);
  const [editPost, setEditPost] = useState(null);

  const [faqList, setFaqList] = useState([]);
  const [originalList, setOriginalList] = useState([]);

  // FAQ 목록 불러오기
  useEffect(() => {
    loadFaqs();
  }, []);

  const loadFaqs = async () => {
    try {
      const rows = await getAdminFaqs();
      setFaqList(rows);
      setOriginalList(rows);
    } catch (err) {
      console.error(err);
      alert("FAQ 목록을 불러오는 중 오류가 발생했습니다.");
    }
  };

  const handleSearch = () => {
    if (!search.trim()) {
      setFaqList(originalList);
      return;
    }

    const filtered = originalList.filter((item) =>
      item.question.toLowerCase().includes(search.toLowerCase())
    );

    setFaqList(filtered);
  };

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

  // 글쓰기/수정 모드
  if (isWriting || editPost) {
    return (
      <WriteTab
        mode="faq"
        editPost={editPost} // 🔥 핵심: 변환하지 말고 그대로 넘긴다
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

  // 최신순 정렬
  const sortedList = [...faqList].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

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
          {sortedList.map((item, index) => (
            <tr key={item.id}>
              <td>{index + 1}</td>
              <td>{item.question}</td>
              <td>{new Date(item.createdAt).toLocaleString()}</td>

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

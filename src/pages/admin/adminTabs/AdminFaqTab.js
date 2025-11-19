import React, { useEffect, useState } from "react";
import "../../../styles/community/Tabs.css";
import WriteTab from "./AdminWriteTab";

function AdminFaqTab() {
  const [search, setSearch] = useState("");
  const [isWriting, setIsWriting] = useState(false);
  const [editPost, setEditPost] = useState(null);

  const [faqList, setFaqList] = useState([
    {
      id: 1,
      title: "비밀번호 변경 방법은?",
      content: "프로필 설정에서 변경 가능합니다.",
      time: "2025년 11월 2일 09:40",
    },
    {
      id: 2,
      title: "회원탈퇴는 어떻게 하나요?",
      content: "마이페이지에서 가능합니다.",
      time: "2025년 11월 1일 11:15",
    },
  ]);
  const [originalList, setOriginalList] = useState([]);

  useEffect(() => {
    if (originalList.length === 0) setOriginalList(faqList);
  }, [faqList, originalList.length]);

  const parseDate = (t) => {
    if (!t) return 0;
    const [year, month, day, hour, minute] = t
      .replace("년", "")
      .replace("월", "")
      .replace("일", "")
      .trim()
      .split(/[\s:]+/)
      .map(Number);
    return new Date(year, month - 1, day, hour, minute).getTime();
  };

  const sortedList = [...faqList]
    .sort((a, b) => parseDate(b.time) - parseDate(a.time))
    .map((item, index, arr) => ({ ...item, no: arr.length - index }));

  const handleSearch = () => {
    if (!search.trim()) {
      setFaqList(originalList);
      return;
    }
    const filtered = originalList.filter((item) =>
      item.title.includes(search)
    );
    setFaqList(filtered);
  };

  const handleDelete = (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    const updated = faqList.filter((item) => item.id !== id);
    setFaqList(updated);
    setOriginalList(updated);
  };

  if (isWriting || editPost) {
    return (
      <WriteTab
        editPost={editPost}
        onBack={() => {
          setIsWriting(false);
          setEditPost(null);
        }}
        onSubmit={(newPost) => {
          let updated;
          if (editPost) {
            updated = faqList.map((item) =>
              item.id === newPost.id ? newPost : item
            );
          } else {
            updated = [{ id: Date.now(), ...newPost }, ...faqList];
          }
          setFaqList(updated);
          setOriginalList(updated);
          setIsWriting(false);
          setEditPost(null);
        }}
      />
    );
  }

  return (
    <div className="admin-community-tab">
      <h2>FAQ 관리</h2>

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

      <table className="table">
        <thead>
          <tr>
            <th>No</th>
            <th>제목</th>
            <th>작성시간</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {sortedList.map((item) => (
            <tr key={item.id}>
              <td>{item.no}</td>
              <td>{item.title}</td>
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
        </tbody>
      </table>

      <div className="btn-right">
        <button className="common-btn" onClick={() => setIsWriting(true)}>
          글쓰기
        </button>
      </div>
    </div>
  );
}

export default AdminFaqTab;

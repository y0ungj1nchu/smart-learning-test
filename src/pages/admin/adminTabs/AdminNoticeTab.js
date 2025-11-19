import React, { useState, useEffect } from "react";
import "../../../styles/community/Tabs.css";
import WriteTab from "./AdminWriteTab";

function AdminNoticeTab() {
  const [search, setSearch] = useState("");
  const [isWriting, setIsWriting] = useState(false);
  const [editPost, setEditPost] = useState(null);
  const [noticeList, setNoticeList] = useState([
    {
      id: 1,
      title: "업데이트 공지",
      time: "2025년 11월 3일 14:20",
      content: "업데이트가 완료되었습니다.",
    },
    {
      id: 2,
      title: "점검 안내",
      time: "2025년 11월 2일 10:15",
      content: "내일 오전 10시부터 시스템 점검 예정입니다.",
    },
  ]);
  const [originalList, setOriginalList] = useState([]);

  useEffect(() => {
    if (originalList.length === 0) setOriginalList(noticeList);
  }, [noticeList, originalList.length]);

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

  const sortedList = [...noticeList]
    .sort((a, b) => parseDate(b.time) - parseDate(a.time))
    .map((item, index, arr) => ({ ...item, no: arr.length - index }));

  const handleSearch = () => {
    if (!search.trim()) {
      setNoticeList(originalList);
      return;
    }

    const filtered = originalList.filter(
      (item) =>
        item.title.includes(search) || item.content.includes(search)
    );
    setNoticeList(filtered);
  };

  const handleDelete = (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    const updated = noticeList.filter((n) => n.id !== id);
    setNoticeList(updated);
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
            updated = noticeList.map((n) =>
              n.id === newPost.id ? newPost : n
            );
          } else {
            updated = [
              {
                id: Date.now(),
                ...newPost,
              },
              ...noticeList,
            ];
          }
          setNoticeList(updated);
          setOriginalList(updated);
          setIsWriting(false);
          setEditPost(null);
        }}
      />
    );
  }

  return (
    <div className="admin-community-tab">
      <h2>공지사항 관리</h2>

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

export default AdminNoticeTab;

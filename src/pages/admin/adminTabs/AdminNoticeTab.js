import React, { useState, useEffect } from "react";
import "../../../styles/community/Tabs.css";
import WriteTab from "./AdminWriteTab";
import {
  getAdminNotices,
  createAdminNotice,
  updateAdminNotice,
  deleteAdminNotice,
} from "../../../utils/api";

function AdminNoticeTab() {
  const [search, setSearch] = useState("");
  const [isWriting, setIsWriting] = useState(false);
  const [editPost, setEditPost] = useState(null);
  const [noticeList, setNoticeList] = useState([]);
  const [originalList, setOriginalList] = useState([]);

  // 공지 불러오기
  useEffect(() => {
    loadNotices();
  }, []);

  const loadNotices = async () => {
    try {
      const data = await getAdminNotices();
      // time 필드 추가(프론트 표시용)
      const mapped = data.map((n) => ({
        ...n,
        time: new Date(n.createdAt).toLocaleString("ko-KR"),
      }));

      setNoticeList(mapped);
      setOriginalList(mapped);
    } catch (err) {
      console.error(err);
      alert("공지사항을 불러오는 중 오류가 발생했습니다.");
    }
  };

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

  const handleDelete = async (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      await deleteAdminNotice(id);
      await loadNotices();
    } catch (err) {
      console.error(err);
      alert("삭제 중 오류 발생");
    }
  };

  if (isWriting || editPost) {
    return (
      <WriteTab
        editPost={editPost}
        onBack={() => {
          setIsWriting(false);
          setEditPost(null);
        }}
        onSubmit={async (post) => {
          try {
            if (editPost) {
              await updateAdminNotice(editPost.id, post);
            } else {
              await createAdminNotice(post);
            }
            await loadNotices();
          } catch (err) {
            console.error(err);
            alert("저장 중 오류 발생");
          }
          setIsWriting(false);
          setEditPost(null);
        }}
      />
    );
  }

  const sortedList = [...noticeList]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map((item, index, arr) => ({ ...item, no: arr.length - index }));

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

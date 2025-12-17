import React, { useState, useEffect } from "react";
import "../../../../styles/community/Tabs.css";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getNotices } from "../../../../utils/api";

function NoticeTab() {
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("new");
  const [noticeList, setNoticeList] = useState([]);
  const navigate = useNavigate();
  const [originList, setOriginList] = useState([]);

  // 공지 불러오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getNotices();
        setNoticeList(data);
      } catch (err) {
        console.error("공지 불러오기 실패:", err);
      }
    };
    fetchData();
  }, []);

  // 검색
  const filtered = noticeList.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  // 최신순
  const sorted = [...filtered].sort((a, b) =>
    sortOrder === "new"
      ? new Date(b.createdAt) - new Date(a.createdAt)
      : new Date(a.createdAt) - new Date(b.createdAt)
  );

  // 번호 부여
  const numberedList = sorted.map((item, index) => ({
    ...item,
    no: sorted.length - index,
  }));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getNotices();
        setNoticeList(data);
        setOriginList(data);
      } catch (err) {
        console.error("공지 불러오기 실패:", err);
      }
    };
    fetchData();
  }, []);
  
  const handleSearchClick = () => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      setNoticeList(originList);
      return;
    }

    setNoticeList(
      originList.filter((item) =>
        item.title.toLowerCase().includes(keyword)
      )
    );
  };

  return (
    <div className="tab-inner notice-tab">
      <h2>공지사항</h2>

      {/* 검색 */}
      <div className="search-box" >
        <input
          type="text"
          placeholder="검색하세요."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="search-btn" onClick={handleSearchClick}>
          <Search size={18} />
        </button>
      </div>

      {/* 정렬 버튼 */}
      <div className="sort-row">
        <button
          className={`sort-btn ${sortOrder === "new" ? "active" : ""}`}
          onClick={() => setSortOrder("new")}
        >
          최신순
        </button>
        <button
          className={`sort-btn ${sortOrder === "old" ? "active" : ""}`}
          onClick={() => setSortOrder("old")}
        >
          오래된 순
        </button>
      </div>

      {/* 목록 */}
      <table className="table">
        <thead>
          <tr>
            <th>제목</th>
            <th>작성시간</th>
          </tr>
        </thead>

        <tbody>
          {numberedList.map((item) => (
            <tr
              key={item.id}
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/user/community/notice-detail/${item.id}`)}
            >
              <td>{item.title}</td>
              <td>{new Date(item.createdAt).toLocaleString()}</td>
            </tr>
          ))}

          {numberedList.length === 0 && (
            <tr>
              <td colSpan={3} style={{ padding: 16, textAlign: "center" }}>
                공지사항이 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default NoticeTab;

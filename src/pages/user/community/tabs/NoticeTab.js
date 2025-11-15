import React, { useState, useEffect } from "react";
import "../../../../styles/community/Tabs.css";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getNotices, getMyProfile } from "../../../../utils/api";

function NoticeTab() {
  const [search, setSearch] = useState("");
  const [noticeList, setNoticeList] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getMyProfile();
        setIsAdmin(data.role === "ADMIN");
      } catch {}
    };
    loadProfile();
  }, []);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const data = await getNotices();
        setNoticeList(data);
      } catch (error) {
        console.error("공지 불러오기 실패", error);
      }
    };
    fetchNotices();
  }, []);

  const handleSearch = (e) => setSearch(e.target.value);

  const handleViewNotice = (item) => {
    navigate(`/user/community/notice-detail/${item.id}`);
  };

  const sortedList = [...noticeList]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map((item, index, arr) => ({
      ...item,
      no: arr.length - index,
    }));

  const filteredList = sortedList.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="community-tab">
      <h2>공지사항</h2>

      <div className="search-box">
        <input
          type="text"
          placeholder="검색하세요."
          value={search}
          onChange={handleSearch}
        />
        <button className="search-btn"><Search size={18} /></button>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>No</th>
            <th>제목</th>
            <th>작성시간</th>
          </tr>
        </thead>
        <tbody>
          {filteredList.map((item) => (
            <tr key={item.id} onClick={() => handleViewNotice(item)}>
              <td>{item.no}</td>
              <td>{item.title}</td>
              <td>{new Date(item.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {isAdmin && (
        <div className="btn-right">
          <button
            className="common-btn"
            onClick={() => navigate("/user/community/notice-write")}
          >
            글쓰기
          </button>
        </div>
      )}
    </div>
  );
}

export default NoticeTab;

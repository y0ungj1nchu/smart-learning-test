import React, { useState, useEffect } from "react";
import "../../../../styles/community/Tabs.css";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

function NoticeTab() {
  const [search, setSearch] = useState("");
  const [noticeList, setNoticeList] = useState([
    {
      id: 1,
      title: "업데이트 공지",
      time: "2025-11-03 14:20",
      content: "업데이트가 완료되었습니다. 새로운 기능을 확인해 주세요!",
    },
    {
      id: 2,
      title: "점검 안내",
      time: "2025-11-02 10:15",
      content: "내일 오전 10시부터 시스템 점검이 예정되어 있습니다.",
    },
  ]);

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("noticeList", JSON.stringify(noticeList));
  }, [noticeList]);

  // 검색 버튼 클릭 시 필터링
  const handleSearchClick = () => {
    const saved = JSON.parse(localStorage.getItem("noticeList")) || noticeList;
    if (!search.trim()) {
      setNoticeList(saved);
      return;
    }
    const filtered = saved.filter(
      (item) =>
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.content.toLowerCase().includes(search.toLowerCase())
    );
    setNoticeList(filtered);
  };

  // 상세 페이지 이동
  const handleViewNotice = (item) => {
    navigate("/user/community/notice-detail", { state: { item, noticeList } });
  };

  // 최신순 정렬
  const sortedList = [...noticeList]
    .sort((a, b) => new Date(b.time) - new Date(a.time))
    .map((item, index, arr) => ({ ...item, no: arr.length - index }));

  return (
    <div className="tab-inner notice-tab">
      <h2>공지사항</h2>

      {/* 검색창 */}
      <div className="search-box">
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

      {/* FAQ/QnA와 동일한 표 구조 */}
      <table className="table">
        <thead>
          <tr>
            <th>No</th>
            <th>제목</th>
            <th>작성시간</th>
          </tr>
        </thead>
        <tbody>
          {sortedList.map((item) => (
            <tr
              key={item.id}
              style={{ cursor: "pointer" }}
              onClick={() => handleViewNotice(item)}
            >
              <td>{item.no}</td>
              <td>{item.title}</td>
              <td>{item.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default NoticeTab;

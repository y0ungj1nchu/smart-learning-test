import React, { useState, useEffect } from "react";
import "../../../../styles/community/Tabs.css";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getNotices } from "../../../../utils/api";

function NoticeTab() {
  const [search, setSearch] = useState("");
  const [noticeList, setNoticeList] = useState([]);
  const navigate = useNavigate();

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

  const filtered = noticeList.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = [...filtered].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  // 번호 생성
  const numberedList = sorted.map((item, index) => ({
    ...item,
    no: sorted.length - index,
  }));

  return (
    <div className="tab-inner notice-tab">
      <h2>공지사항</h2>

      <div className="search-box">
        <input
          type="text"
          placeholder="검색하세요."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="search-btn">
          <Search size={18} />
        </button>
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
          {numberedList.map((item) => (
            <tr
              key={item.id}
              style={{ cursor: "pointer" }}
              onClick={() =>
                navigate(`/user/community/notice-detail/${item.id}`, {
                  state: {
                    item,
                    noticeList: numberedList,
                  },
                })
              }
            >
              <td>{item.no}</td>
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

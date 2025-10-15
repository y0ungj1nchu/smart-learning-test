import React, { useState } from "react";
import "../../../../styles/profile/Tabs.css";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import WriteTab from "./WriteTab";
import NoticeDetail from "./NoticeDetail";

function NoticeTab({ setActiveTab }) {
  const [search, setSearch] = useState("");
  const [isWriting, setIsWriting] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [noticeList, setNoticeList] = useState([
    {
      id: 1,
      title: "업데이트 공지",
      time: "14:20",
      content: "업데이트 되었으니 확인 바랍니다.",
    },
    {
      id: 2,
      title: "점검 안내",
      time: "10:15",
      content: "내일 10시부터 점검이 예정되어 있습니다.",
    },
  ]);

  const navigate = useNavigate();

  const handleSearch = (e) => setSearch(e.target.value);

  const handleAddNotice = (newPost) => {
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`;
    const newItem = {
      id: noticeList.length + 1,
      title: newPost.title,
      time,
      content: newPost.content,
    };
    setNoticeList([newItem, ...noticeList]);
    setIsWriting(false);
  };

  const handleViewNotice = (item) => {
    navigate("/user/profile/notice-detail", { state: item });
  };

  const handleBackToList = () => {
    setSelectedNotice(null);
  };

  // 글쓰기
  if (isWriting) {
    return (
      <WriteTab onBack={() => setIsWriting(false)} onSubmit={handleAddNotice} />
    );
  }

  // 글 클릭 → 상세 보기 모드
  if (selectedNotice) {
    return (
      <NoticeDetail
        title={selectedNotice.title}
        content={selectedNotice.content}
        time={selectedNotice.time}
        onBack={handleBackToList}
      />
    );
  }

  // 기본 목록 화면
  const filteredList = noticeList.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="notice-tab">
      <h2>공지사항</h2>

      <div className="search-box">
        <input
          type="text"
          placeholder="검색하세요."
          value={search}
          onChange={handleSearch}
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
          {filteredList.map((item) => (
            <tr
              key={item.id}
              style={{ cursor: "pointer" }}
              onClick={() => handleViewNotice(item)}
            >
              <td>{item.id}</td>
              <td>{item.title}</td>
              <td>{item.time}</td>
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

export default NoticeTab;

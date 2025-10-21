import React, { useState } from "react";
import "../../../../styles/profile/Tabs.css";
import { Search } from "lucide-react";
import WriteTab from "../../profile/tabs/WriteTab";

function FaqQnaTab({ setActiveTab }) {
  const [activeSubTab, setActiveSubTab] = useState("faq");
  const [search, setSearch] = useState("");
  const [isWriting, setIsWriting] = useState(false); // 글쓰기 페이지 여부

  const faqList = [
    { id: 1, title: "자주 묻는 질문", time: "14:20" },
    { id: 2, title: "로그인 오류가 발생할 때는?", time: "11:10" },
  ];

  // Q&A 목록 (등록 시 업데이트)
  const [qnaList, setQnaList] = useState([
    { id: 1, title: "문의드립니다.", time: "02:18" },
    { id: 2, title: "FDS 적용 관련 문의", time: "10:45" },
  ]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  // 글쓰기 완료 시 Q&A 목록 추가
  const handleAddQna = (newPost) => {
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`;

    const newItem = {
      id: qnaList.length + 1,
      title: newPost.title,
      time,
    };

    setQnaList([newItem, ...qnaList]); // 최신글 위로 추가
    setIsWriting(false);
  };

  // 목록으로 복귀
  const handleBackToList = () => {
    setIsWriting(false);
  };

  const filteredList = (activeSubTab === "faq" ? faqList : qnaList).filter(
    (item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      (item.content && item.content.toLowerCase().includes(search.toLowerCase()))
  );

  // FAQ / QNA 목록 테이블
  const renderTable = (list) => (
    <table className="table">
      <thead>
        <tr>
          <th>No</th>
          <th>제목</th>
          <th>작성시간</th>
        </tr>
      </thead>
      <tbody>
        {list.map((item) => (
          <tr key={item.id}>
            <td>{item.id}</td>
            <td>{item.title}</td>
            <td>{item.time}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  // 글쓰기 모드일 때 WriteTab 렌더링
  if (isWriting) {
    return <WriteTab onBack={handleBackToList} onSubmit={handleAddQna} />;
  }

  // 기본 FAQ / Q&A 목록
  return (
    <div className="tab-inner faq-tab">
      <h2>{activeSubTab === "faq" ? "자주 묻는 질문" : "1:1 문의"}</h2>

      {/* 전환 */}
      <div className="faq-tabs">
        <button
          className={activeSubTab === "faq" ? "active" : ""}
          onClick={() => setActiveSubTab("faq")}
        >
          FAQ
        </button>
        <button
          className={activeSubTab === "qna" ? "active" : ""}
          onClick={() => setActiveSubTab("qna")}
        >
          Q&A
        </button>
      </div>

      {/* 검색 */}
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

      {/* 목록 렌더링 */}
      {activeSubTab === "faq"
        ? renderTable(filteredList)
        : renderTable(filteredList)}

      {/* 글쓰기 버튼 */}
      {activeSubTab === "faq" && (
        <div className="btn-right">
          <button className="common-btn" onClick={() => setIsWriting(true)}>
            글쓰기
          </button>
        </div>
      )}
      {activeSubTab === "qna" && (
        <div className="btn-right">
          <button className="common-btn" onClick={() => setIsWriting(true)}>
            글쓰기
          </button>
        </div>
      )}
    </div>
  );
}

export default FaqQnaTab;
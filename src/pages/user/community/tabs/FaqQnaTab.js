import React, { useState, useEffect } from "react";
import "../../../../styles/community/Tabs.css";
import { Search } from "lucide-react";
import WriteTab from "./WriteTab";

function FaqQnaTab() {
  const [activeSubTab, setActiveSubTab] = useState("faq");
  const [search, setSearch] = useState("");
  const [isWriting, setIsWriting] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [editPost, setEditPost] = useState(null);

  // FAQ (검색만 가능)
  const [faqList, setFaqList] = useState([
    { id: 1, title: "비밀번호 변경 방법은?", content: "프로필 설정에서 변경 가능합니다.", time: "09:40" },
    { id: 2, title: "회원탈퇴는 어떻게 하나요?", content: "마이페이지에서 탈퇴 요청이 가능합니다.", time: "11:15" },
  ]);
  const [originalFaqList, setOriginalFaqList] = useState(faqList);

  // QnA (글쓰기/수정/삭제 가능)
  const [qnaList, setQnaList] = useState([
    { id: 1, title: "첫번째 문의", content: "테스트", time: "13:10" },
  ]);
  const [originalQnaList, setOriginalQnaList] = useState(qnaList);

  useEffect(() => {
    if (originalFaqList.length === 0) setOriginalFaqList(faqList);
    if (originalQnaList.length === 0) setOriginalQnaList(qnaList);
  }, []);

  // 검색 버튼 클릭 시 필터링
  const handleSearchClick = () => {
    if (activeSubTab === "faq") {
      if (!search.trim()) {
        setFaqList(originalFaqList);
        return;
      }
      const filtered = originalFaqList.filter(
        (item) =>
          item.title.toLowerCase().includes(search.toLowerCase()) ||
          (item.content && item.content.toLowerCase().includes(search.toLowerCase()))
      );
      setFaqList(filtered);
    } else {
      if (!search.trim()) {
        setQnaList(originalQnaList);
        return;
      }
      const filtered = originalQnaList.filter(
        (item) =>
          item.title.toLowerCase().includes(search.toLowerCase()) ||
          (item.content && item.content.toLowerCase().includes(search.toLowerCase()))
      );
      setQnaList(filtered);
    }
  };

  const handleAddFaq = (newPost) => {
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
      now.getDate()
    ).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`;

    const newItem = {
      id: Date.now(),
      title: newPost.title,
      content: newPost.content,
      time: dateStr
    };

    const updated = [newItem, ...faqList];
    setFaqList(updated);
    setOriginalFaqList(updated);
    setIsWriting(false);
  };
  
  // QnA 글 등록
  const handleAddQna = (newPost) => {
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
    now.getDate()
  ).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(
    now.getMinutes()
  ).padStart(2, "0")}`;

    const newItem = {
      id: Date.now(),
      title: newPost.title,
      content: newPost.content,
      time: dateStr,
    };

    const updated = [newItem, ...qnaList];
    setQnaList(updated);
    setOriginalQnaList(updated);
    setIsWriting(false);
  };

  // QnA 수정 완료
  const handleEditSubmit = (updatedPost) => {
    const updatedList = qnaList.map((post) =>
      post.id === updatedPost.id ? updatedPost : post
    );
    setQnaList(updatedList);
    setOriginalQnaList(updatedList);
    setEditPost(null);
    setSelectedPost(null);
  };

  // 삭제
  const handleDelete = (postId) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      const updated = qnaList.filter((post) => post.id !== postId);
      setQnaList(updated);
      setOriginalQnaList(updated);
      setSelectedPost(null);
      alert("삭제되었습니다.");
    }
  };

  // 보기/수정/글쓰기 전환
  const handleViewPost = (item) => setSelectedPost(item);
  const handleBackToList = () => {
    setSelectedPost(null);
    setEditPost(null);
    setIsWriting(false);
  };

  // 글쓰기 모드
  if (isWriting) return <WriteTab onBack={handleBackToList} onSubmit={handleAddQna} />;

  // 수정 모드
  if (editPost)
    return <WriteTab onBack={handleBackToList} onSubmit={handleEditSubmit} editPost={editPost} />;

  // 상세 보기 모드 (흰 배경, 수정/삭제 버튼)
  if (selectedPost) {
    return (
      <div className="tab-inner faq-tab">
        <div className="write-form">
          <h2>{selectedPost.title}</h2>
          <hr />
          <p style={{ whiteSpace: "pre-wrap", lineHeight: "1.6" }}>{selectedPost.content}</p>
          <p style={{ color: "#777", marginTop: "10px" }}>작성시간: {selectedPost.time}</p>
        </div>

        <div className="btn-right" style={{ gap: "10px" }}>
          <button className="common-btn" onClick={() => setEditPost(selectedPost)}>
            수정
          </button>
          <button className="cancel-btn" onClick={() => handleDelete(selectedPost.id)}>
            삭제
          </button>
          <button className="cancel-btn" onClick={handleBackToList}>
            목록으로
          </button>
        </div>
      </div>
    );
  }

  // 최신순 정렬
  const sortedFaq = [...faqList]
    .sort((a, b) => new Date(b.time) - new Date(a.time)) 
    .map((item, index, arr) => ({ ...item, no: arr.length - index }));

  const sortedQna = [...qnaList]
    .sort((a, b) => new Date(b.time) - new Date(a.time))
    .map((item, index, arr) => ({ ...item, no: arr.length - index }));

  const listToShow = activeSubTab === "faq" ? sortedFaq : sortedQna;

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
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="search-btn" onClick={handleSearchClick}>
          <Search size={18} />
        </button>

        {/* 검색 초기화 버튼 */}
        <button
          className="reset-btn"
          onClick={() => {
            setSearch("");
            setFaqList(originalFaqList);
            setQnaList(originalQnaList);
          }}
        >
          전체보기
        </button>
      </div>

      {/* 테이블 */}
      <table className="table">
        <thead>
          <tr>
            <th>No</th>
            <th>제목</th>
            <th>작성시간</th>
          </tr>
        </thead>
        <tbody>
          {listToShow.map((item) => (
            <tr
              key={item.id}
              style={{ cursor: activeSubTab === "qna" ? "pointer" : "default" }}
              onClick={() => activeSubTab === "qna" && handleViewPost(item)}
            >
              <td>{item.no}</td>
              <td>{item.title}</td>
              <td>{item.time}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* QnA 글쓰기 버튼 */}
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

import React, { useState, useEffect } from "react";
import "../../../../styles/community/Tabs.css";
import { Search } from "lucide-react";
import WriteTab from "./WriteTab";

import {
  getFaqs,
  getMyInquiries,
  createInquiry,
  updateInquiry,
  deleteInquiry,
} from "../../../../utils/api";

function FaqQnaTab() {
  const [activeSubTab, setActiveSubTab] = useState("faq");
  const [search, setSearch] = useState("");
  const [isWriting, setIsWriting] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [editPost, setEditPost] = useState(null);

  // FAQ / QNA 리스트
  const [faqList, setFaqList] = useState([]);
  const [originalFaqList, setOriginalFaqList] = useState([]);

  const [qnaList, setQnaList] = useState([]);
  const [originalQnaList, setOriginalQnaList] = useState([]);

  // =========================
  // FAQ 목록 조회
  // =========================
  const fetchFaqs = async () => {
    try {
      const faqs = await getFaqs();

      const mapped = faqs.map((faq) => ({
        id: faq.id,
        title: faq.question,
        content: faq.answer,
        createdAt: faq.createdAt,
      }));

      setFaqList(mapped);
      setOriginalFaqList(mapped);
    } catch (error) {
      console.error("FAQ 목록 조회 실패:", error);
      alert("FAQ 목록을 불러오는 데 실패했습니다.");
    }
  };

  // =========================
  // QnA 목록 조회
  // =========================
  const fetchQnas = async () => {
    try {
      const qnas = await getMyInquiries();

      const mapped = qnas.map((qna) => ({
        id: qna.id,
        title: qna.title,
        content: qna.content,
        createdAt: qna.createdAt,
      }));

      setQnaList(mapped);
      setOriginalQnaList(mapped);
    } catch (error) {
      console.error("Q&A 목록 조회 실패:", error);
      alert("Q&A 목록을 불러오는 데 실패했습니다.");
    }
  };

  // 첫 로딩 시 FAQ/QNA 불러오기
  useEffect(() => {
    fetchFaqs();
    fetchQnas();
  }, []);

  // =========================
  // 검색
  // =========================
  const handleSearchClick = () => {
    const keyword = search.trim().toLowerCase();

    if (activeSubTab === "faq") {
      if (!keyword) {
        setFaqList(originalFaqList);
        return;
      }
      const filtered = originalFaqList.filter(
        (item) =>
          item.title.toLowerCase().includes(keyword) ||
          (item.content && item.content.toLowerCase().includes(keyword))
      );
      setFaqList(filtered);
    } else {
      if (!keyword) {
        setQnaList(originalQnaList);
        return;
      }
      const filtered = originalQnaList.filter(
        (item) =>
          item.title.toLowerCase().includes(keyword) ||
          (item.content && item.content.toLowerCase().includes(keyword))
      );
      setQnaList(filtered);
    }
  };

  // 검색어 공백 → 자동 복원
  useEffect(() => {
    if (!search.trim()) {
      setFaqList(originalFaqList);
      setQnaList(originalQnaList);
    }
  }, [search, originalFaqList, originalQnaList]);

  // =========================
  // QNA 등록
  // =========================
  const handleAddQna = async (newPost) => {
    try {
      await createInquiry({
        title: newPost.title,
        content: newPost.content,
      });

      alert("문의가 등록되었습니다.");
      setIsWriting(false);
      fetchQnas();
    } catch (error) {
      console.error(error);
      alert("문의 등록에 실패했습니다.");
    }
  };

  // =========================
  // QNA 수정
  // =========================
  const handleEditSubmit = async (updatedPost) => {
    try {
      await updateInquiry(updatedPost.id, {
        title: updatedPost.title,
        content: updatedPost.content,
      });

      alert("문의가 수정되었습니다.");
      setEditPost(null);
      setSelectedPost(null);
      fetchQnas();
    } catch (error) {
      console.error(error);
      alert("문의 수정에 실패했습니다.");
    }
  };

  // =========================
  // QNA 삭제
  // =========================
  const handleDelete = async (postId) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      await deleteInquiry(postId);
      alert("삭제되었습니다.");
      setSelectedPost(null);
      fetchQnas();
    } catch (error) {
      console.error(error);
      alert("삭제 실패");
    }
  };

  const handleViewPost = (item) => setSelectedPost(item);

  const handleBackToList = () => {
    setSelectedPost(null);
    setEditPost(null);
    setIsWriting(false);
  };

  // =========================
  // 글쓰기 모드
  // =========================
  if (isWriting)
    return <WriteTab onBack={handleBackToList} onSubmit={handleAddQna} />;

  // 수정 모드
  if (editPost)
    return (
      <WriteTab
        onBack={handleBackToList}
        onSubmit={handleEditSubmit}
        editPost={editPost}
      />
    );

  // 상세 보기 모드
  if (selectedPost) {
    return (
      <div className="tab-inner faq-tab">
        <div className="write-form">
          <h2>{selectedPost.title}</h2>
          <hr />
          <p style={{ whiteSpace: "pre-wrap", lineHeight: "1.6" }}>
            {selectedPost.content}
          </p>
          <p style={{ color: "#777", marginTop: "10px" }}>
            작성시간:{" "}
            {selectedPost.createdAt
              ? new Date(selectedPost.createdAt).toLocaleString()
              : "-"}
          </p>
        </div>

        <div className="btn-right" style={{ gap: "10px" }}>
          {/* QNA일 때만 수정/삭제표시 */}
          {activeSubTab === "qna" && (
            <>
              <button
                className="common-btn"
                onClick={() => setEditPost(selectedPost)}
              >
                수정
              </button>
              <button
                className="common-btn"
                onClick={() => handleDelete(selectedPost.id)}
              >
                삭제
              </button>
            </>
          )}

          <button className="cancel-btn" onClick={handleBackToList}>
            목록으로
          </button>
        </div>
      </div>
    );
  }

  // 리스트 정렬
  const sortedFaq = [...faqList]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map((item, idx) => ({ ...item, no: idx + 1 }));

  const sortedQna = [...qnaList]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map((item, idx) => ({ ...item, no: idx + 1 }));

  const listToShow = activeSubTab === "faq" ? sortedFaq : sortedQna;

  return (
    <div className="tab-inner faq-tab">
      <h2>{activeSubTab === "faq" ? "자주 묻는 질문" : "1:1 문의"}</h2>

      <div className="faq-tabs">
        <button
          className={activeSubTab === "faq" ? "active" : ""}
          onClick={() => {
            setActiveSubTab("faq");
            setSelectedPost(null);
            setEditPost(null);
          }}
        >
          FAQ
        </button>
        <button
          className={activeSubTab === "qna" ? "active" : ""}
          onClick={() => {
            setActiveSubTab("qna");
            setSelectedPost(null);
            setEditPost(null);
          }}
        >
          Q&A
        </button>
      </div>

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

      {/* 목록 테이블 */}
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
            <tr key={item.id} style={{ cursor: "pointer" }} onClick={() => handleViewPost(item)}>
              <td>{item.no}</td>
              <td>{item.title}</td>
              <td>
                {item.createdAt
                  ? new Date(item.createdAt).toLocaleString()
                  : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {activeSubTab === "qna" && (
        <div className="btn-right">
          <button className="common-btn" onClick={() => setIsWriting(true)}>
            문의하기
          </button>
        </div>
      )}
    </div>
  );
}

export default FaqQnaTab;

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

  const [isEditingContent, setIsEditingContent] = useState(false);
  const [editContentText, setEditContentText] = useState("");

  const [faqList, setFaqList] = useState([]);
  const [originalFaqList, setOriginalFaqList] = useState([]);

  const [qnaList, setQnaList] = useState([]);
  const [originalQnaList, setOriginalQnaList] = useState([]);

  /* =========================
     FAQ 목록 조회
  ========================= */
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
    } catch {
      alert("FAQ 목록을 불러오는 데 실패했습니다.");
    }
  };

  /* =========================
     QnA 목록 조회
  ========================= */
  const fetchQnas = async () => {
    try {
      const qnas = await getMyInquiries();
      const mapped = qnas.map((qna) => ({
        id: qna.id,
        title: qna.title,
        content: qna.content,
        createdAt: qna.createdAt,

        // 관리자 답변
        answer: qna.answer,
        answerTime: qna.answeredAt ?? null,
        updatedAt: qna.updatedAt ?? null,
      }));

      setQnaList(mapped);
      setOriginalQnaList(mapped);
    } catch {
      alert("Q&A 목록을 불러오는 데 실패했습니다.");
    }
  };

  useEffect(() => {
    fetchFaqs();
    fetchQnas();
  }, []);

  /* =========================
     검색 기능
  ========================= */
  const handleSearchClick = () => {
    const keyword = search.trim().toLowerCase();

    if (activeSubTab === "faq") {
      if (!keyword) return setFaqList(originalFaqList);
      setFaqList(
        originalFaqList.filter(
          (item) =>
            item.title.toLowerCase().includes(keyword) ||
            item.content?.toLowerCase().includes(keyword)
        )
      );
    } else {
      if (!keyword) return setQnaList(originalQnaList);
      setQnaList(
        originalQnaList.filter(
          (item) =>
            item.title.toLowerCase().includes(keyword) ||
            item.content?.toLowerCase().includes(keyword) ||
            item.answer?.toLowerCase().includes(keyword)
        )
      );
    }
  };

  useEffect(() => {
    if (!search.trim()) {
      setFaqList(originalFaqList);
      setQnaList(originalQnaList);
    }
  }, [search]);

  /* =========================
     문의 등록
  ========================= */
  const handleAddQna = async (newPost) => {
    try {
      await createInquiry({
        title: newPost.title,
        content: newPost.content,
      });
      alert("문의가 등록되었습니다.");
      setIsWriting(false);
      fetchQnas();
    } catch {
      alert("문의 등록 실패");
    }
  };

  /* =========================
     문의 삭제
  ========================= */
  const handleDelete = async (postId) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      await deleteInquiry(postId);
      alert("삭제되었습니다.");
      setSelectedPost(null);
      fetchQnas();
    } catch {
      alert("삭제 실패");
    }
  };

  const handleBackToList = () => {
    setSelectedPost(null);
    setIsEditingContent(false);
  };

  /* =========================
     상세 보기 (User 화면)
  ========================= */
  if (selectedPost) {
    const hasAnswer = !!selectedPost.answer;

    return (
      <div className="tab-inner faq-tab">
        <div className="write-form">
          <h2>{selectedPost.title}</h2>

          <p style={{ color: "#777" }}>
            작성시간: {new Date(selectedPost.createdAt).toLocaleString()}
          </p>

          {selectedPost.updatedAt && (
            <p style={{ color: "#777" }}>
              수정됨: {new Date(selectedPost.updatedAt).toLocaleString()}
            </p>
          )}

          <hr />

          {/* 🔥 사용자 문의 내용 */}
          <h3>문의 내용</h3>

          {!isEditingContent ? (
            <p style={{ whiteSpace: "pre-wrap", lineHeight: "1.6" }}>
              {selectedPost.content}
            </p>
          ) : (
            <textarea
              className="answer-textarea"
              value={editContentText}
              onChange={(e) => setEditContentText(e.target.value)}
            />
          )}

          {/* 🔥 관리자 답변 */}
          {hasAnswer && (
            <>
              <h3 style={{ marginTop: "20px" }}>관리자 답변</h3>

              <p style={{ whiteSpace: "pre-wrap", lineHeight: "1.6" }}>
                {selectedPost.answer}
              </p>

              <p style={{ color: "#777" }}>
                {selectedPost.answerTime &&
                  `답변시간: ${new Date(
                    selectedPost.answerTime
                  ).toLocaleString()}`}
              </p>
            </>
          )}
        </div>

        {/* 버튼 영역 */}
        <div className="btn-right" style={{ marginTop: "20px" }}>
          {!isEditingContent && !hasAnswer && (
            <>
              <button
                className="common-btn"
                onClick={() => {
                  setEditContentText(selectedPost.content);
                  setIsEditingContent(true);
                }}
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

          {/* 저장 버튼 */}
          {isEditingContent && (
            <button
              className="common-btn"
              onClick={async () => {
                try {
                  await updateInquiry(selectedPost.id, {
                    content: editContentText,
                  });

                  alert("수정되었습니다.");
                  setIsEditingContent(false);
                  setSelectedPost(null);
                  fetchQnas();
                } catch {
                  alert("수정 실패");
                }
              }}
            >
              저장
            </button>
          )}

          <button className="cancel-btn" onClick={handleBackToList}>
            목록으로
          </button>
        </div>
      </div>
    );
  }

  /* =========================
     글쓰기 모드
  ========================= */
  if (isWriting) {
    return <WriteTab onBack={handleBackToList} onSubmit={handleAddQna} />;
  }

  /* =========================
     정렬 + 리스트
  ========================= */
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
      </div>

      {/* 목록 */}
      <table className="table">
        <thead>
          <tr>
            <th>No</th>
            <th>제목</th>
            <th>작성시간</th>
            {activeSubTab === "qna" && <th>답변 상태</th>}
          </tr>
        </thead>

        <tbody>
          {listToShow.map((item) => (
            <tr
              key={item.id}
              style={{ cursor: "pointer" }}
              onClick={() => setSelectedPost(item)}
            >
              <td>{item.no}</td>
              <td>{item.title}</td>
              <td>{new Date(item.createdAt).toLocaleString()}</td>

              {activeSubTab === "qna" && (
                <td className={item.answer ? "status-complete" : "status-pending"}>
                  {item.answer ? "답변완료" : "미답변"}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* 문의 작성 버튼 */}
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

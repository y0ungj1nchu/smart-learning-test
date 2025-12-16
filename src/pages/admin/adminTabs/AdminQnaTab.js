import React, { useState, useEffect, useMemo } from "react";
import "../../../styles/community/Tabs.css";
import { Search } from "lucide-react";

import {
  getAdminInquiries,
  answerAdminInquiry,
} from "../../../utils/api";

export default function AdminQnaTab({ initialSelectId }) {
  const [qnaList, setQnaList] = useState([]);
  const [selected, setSelected] = useState(null);
  const [answerText, setAnswerText] = useState("");

  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("new"); // 🔥 최신순 / 오래된순 정렬
  const [searchInput, setSearchInput] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  
  useEffect(() => {
    loadInquiries();
  }, []);

  const loadInquiries = async () => {
    try {
      const rows = await getAdminInquiries();
      setQnaList(rows);
    } catch (err) {
      console.error(err);
      alert("문의 목록을 불러오는 중 오류가 발생했습니다.");
    }
  };

  // 🔥 URL로 받은 문의 ID 자동 선택
  useEffect(() => {
    if (!initialSelectId || qnaList.length === 0) return;

    const target = qnaList.find(
      (q) => String(q.id) === String(initialSelectId)
    );

    if (target) {
      setSelected(target);
      setAnswerText(target.answer || "");
    }
  }, [initialSelectId, qnaList]);

  const processedList = useMemo(() => {
    let list = [...qnaList];

    // 검색
    if (searchKeyword.trim()) {
      const keyword = searchKeyword.toLowerCase();
      list = list.filter(
        (q) =>
          q.title.toLowerCase().includes(keyword) ||
          q.nickname.toLowerCase().includes(keyword) ||
          q.content.toLowerCase().includes(keyword) ||
          (q.answer && q.answer.toLowerCase().includes(keyword))
      );
    }

    // 미답변 필터
    if (filter === "unanswered") {
      list = list.filter((q) => q.status === "pending");
    }

    // 정렬
    list.sort((a, b) =>
      sort === "new"
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt)
    );

    return list;
  }, [qnaList, searchKeyword, filter, sort]);

  const unansweredCount = qnaList.filter(
    (q) => q.status === "pending"
  ).length;

  const handleSendAnswer = async () => {
    if (!answerText.trim()) return alert("답변을 입력하세요.");

    try {
      await answerAdminInquiry(selected.id, answerText);
      alert("답변이 등록되었습니다.");

      setSelected(null);
      setAnswerText("");
      loadInquiries();
    } catch (err) {
      console.error(err);
      alert("답변 저장 중 오류 발생");
    }
  };

  /* ============================
        📍 목록 화면
  ============================ */
  if (!selected) {
    return (
      <div className="tab-inner admin-qna-tab">
        <h2>1:1 문의 답변</h2>

        {/* 검색 */}
        <div className="search-box">
          <input
            type="text"
            placeholder="검색하세요."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && setSearchKeyword(searchInput)
            }
          />
          <button
            className="search-btn"
            onClick={() => setSearchKeyword(searchInput)}
          >
            <Search size={18} />
          </button>
        </div>

        {/* 정렬 */}
        <div className="sort-row">
          <button
            className={`sort-btn ${sort === "new" ? "active" : ""}`}
            onClick={() => setSort("new")}
          >
            최신순
          </button>
          <button
            className={`sort-btn ${sort === "old" ? "active" : ""}`}
            onClick={() => setSort("old")}
          >
            오래된순
          </button>
        </div>

        {/* 총 문의 / 미답변 */}
        <div className="qna-stats-box">
          <div
            className={`qna-tag total ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            총 문의 <span>{qnaList.length}</span>
          </div>

          <div
            className={`qna-tag unanswered ${
              filter === "unanswered" ? "active" : ""
            }`}
            onClick={() => setFilter("unanswered")}
          >
            미답변 <span>{unansweredCount}</span>
          </div>
        </div>

        {/* 목록 */}
        <table className="table">
          <thead>
            <tr>
              <th>제목</th>
              <th>작성자</th>
              <th>작성시간</th>
              <th>답변상태</th>
            </tr>
          </thead>
          <tbody>
            {processedList.map((q) => (
              <tr
                key={q.id}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setSelected(q);
                  setAnswerText(q.answer || "");
                }}
              >
                <td>{q.title}</td>
                <td>{q.nickname}</td>
                <td>{new Date(q.createdAt).toLocaleString()}</td>
                <td
                  className={
                    q.status === "answered"
                      ? "status-complete"
                      : "status-pending"
                  }
                >
                  {q.status === "answered" ? "답변완료" : "미답변"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  /* ============================
        📍 상세 화면
  ============================ */
  return (
    <div className="tab-inner admin-qna-tab">
      <div className="write-form">
        <h3>
          [{selected.nickname}] {selected.title}
        </h3>

        <p className="qna-content">{selected.content}</p>

        <label className="answer-label">관리자 답변</label>
        <textarea
          className="answer-textarea"
          placeholder="답변을 입력하세요."
          value={answerText}
          onChange={(e) => setAnswerText(e.target.value)}
        />

        <div className="btn-right">
          <button className="common-btn" onClick={handleSendAnswer}>
            {selected.status === "answered" ? "답변 수정하기" : "답변 보내기"}
          </button>
          <button className="cancel-btn" onClick={() => setSelected(null)}>
            목록으로
          </button>
        </div>
      </div>
    </div>
  );
}
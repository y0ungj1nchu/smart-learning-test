import React, { useState, useEffect } from "react";
import "../../../styles/community/Tabs.css";
import {
  getAdminInquiries,
  answerAdminInquiry,
} from "../../../utils/api";

export default function AdminQnaTab() {
  const [showUnansweredOnly, setShowUnansweredOnly] = useState(false);
  const [qnaList, setQnaList] = useState([]);
  const [selected, setSelected] = useState(null);
  const [answerText, setAnswerText] = useState("");

  // -------------------------------
  // 문의목록 로드
  // -------------------------------
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

  // -------------------------------
  // 미답변 필터링
  // -------------------------------
  const filteredList = showUnansweredOnly
    ? qnaList.filter((q) => q.status === "pending")
    : qnaList;

  const unansweredCount = qnaList.filter((q) => q.status === "pending").length;

  // -------------------------------
  // 답변 등록
  // -------------------------------
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

  return (
    <div className="tab-inner admin-qna-tab">
      <h2>1:1 문의 답변</h2>

      {/* 문의 통계 */}
      <div className="qna-stats-box">
        <div className="qna-tag total">
          총 문의 개수 <span>{qnaList.length}</span>
        </div>
        <div className="qna-tag unanswered">
          미답변 <span>{unansweredCount}</span>
        </div>

        <button
          className="filter-btn"
          onClick={() => setShowUnansweredOnly((prev) => !prev)}
        >
          {showUnansweredOnly ? "전체 보기" : "미답변만 보기"}
        </button>
      </div>

      {/* 목록 화면 */}
      {!selected && (
        <table className="table">
          <thead>
            <tr>
              <th>No</th>
              <th>제목</th>
              <th>작성자</th>
              <th>작성시간</th>
              <th>답변상태</th>
            </tr>
          </thead>
          <tbody>
            {filteredList.map((q, idx) => (
              <tr
                key={q.id}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setSelected(q);
                  setAnswerText(q.answer || "");
                }}
              >
                <td>{idx + 1}</td>
                <td>{q.title}</td>
                <td>{q.nickname || q.userNickname}</td>
                <td>{new Date(q.createdAt).toLocaleString()}</td>
                <td className={q.status === "answered" ? "status-complete" : "status-pending"}>
                  {q.status === "answered" ? "답변완료" : "미답변"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* 답변 작성 화면 */}
      {selected && (
        <div className="write-form">
          <h3>[{selected.nickname}] {selected.title}</h3>

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
      )}
    </div>
  );
}

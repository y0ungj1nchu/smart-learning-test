import React, { useState } from "react";
import "../../../styles/community/Tabs.css";

function AdminQnaTab() {
  const [showUnansweredOnly, setShowUnansweredOnly] = useState(false);

  const [qnaList, setQnaList] = useState([
    {
      id: 1,
      title: "로그인이 안됩니다",
      content: "로그인이 자꾸 실패합니다.",
      user: "user01",
      time: "2025년 11월 3일 13:10",
      answer: "",
      answerTime: "",
    },
    {
      id: 2,
      title: "비밀번호 변경 문의",
      content: "변경이 안돼요.",
      user: "user02",
      time: "2025년 11월 2일 10:20",
      answer: "안녕하세요! 비밀번호 정책이 변경되었습니다.",
      answerTime: "2025년 11월 2일 11:00",
    },
  ]);

  const [selected, setSelected] = useState(null);
  const [answerText, setAnswerText] = useState("");

  // 미답변 개수
  const unansweredCount = qnaList.filter((q) => !q.answer).length;

  // 답변 등록 & 수정
  const handleSendAnswer = () => {
    if (!answerText.trim()) return alert("답변을 입력하세요.");

    const now = new Date();
    const formatted = `${now.getFullYear()}년 ${String(
      now.getMonth() + 1
    ).padStart(2, "0")}월 ${String(now.getDate()).padStart(2, "0")}일 ${String(
      now.getHours()
    ).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    const updated = qnaList.map((q) =>
      q.id === selected.id
        ? { ...q, answer: answerText, answerTime: formatted }
        : q
    );

    setQnaList(updated);
    setSelected(null);
    setAnswerText("");
  };

  // 필터링 적용
  const filteredList = showUnansweredOnly
    ? qnaList.filter((q) => !q.answer)
    : qnaList;

  return (
    <div className="tab-inner admin-qna-tab">
      <h2>1:1 문의 답변</h2>

      {/* 문의 통계 UI */}
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

      {/* 문의 리스트 */}
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
                <td>{q.user}</td>
                <td>{q.time}</td>
                <td className={q.answer ? "status-complete" : "status-pending"}>
                  {q.answer ? "답변완료" : "미답변"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* 답변 작성/수정 페이지 */}
      {selected && (
        <div className="write-form">
          <h3>
            [{selected.user}] {selected.title}
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
              {selected.answer ? "답변 수정하기" : "답변 보내기"}
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

export default AdminQnaTab;

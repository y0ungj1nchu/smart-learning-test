import React, { useState, useEffect } from "react";
import "../../../styles/community/Tabs.css";

export default function AdminWriteTab({ mode, editPost, onBack, onSubmit }) {
  const [title, setTitle] = useState(editPost?.title || editPost?.question || "");
  const [content, setContent] = useState(editPost?.content || editPost?.answer || "");

  // editPost가 바뀔 때마다 form 값 자동 업데이트
  useEffect(() => {
    if (editPost) {
      setTitle(editPost.title || editPost.question || "");
      setContent(editPost.content || editPost.answer || "");
    } else {
      setTitle("");
      setContent("");
    }
  }, [editPost]);

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) {
      return alert("제목과 내용을 입력하세요.");
    }

    if (mode === "faq") {
      // FAQ: question / answer 로 맞춰서 전달
      onSubmit({
        id: editPost?.id,
        question: title.trim(),
        answer: content.trim(),
      });
    } else {
      // NOTICE: title / content 그대로 전달
      onSubmit({
        id: editPost?.id,
        title: title.trim(),
        content: content.trim(),
      });
    }
  };

  return (
    <div className="write-tab">
      <div className="write-form">
        <h2>{editPost ? "수정하기" : "작성하기"}</h2>

        <div className="write-row">
          <label>제목</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
          />
        </div>

        <div className="write-row">
          <label>내용</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용을 입력하세요"
          />
        </div>

        <div className="write-btns">
          <button className="common-btn" onClick={handleSubmit}>
            {editPost ? "수정" : "등록"}
          </button>
          <button className="cancel-btn" onClick={onBack}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
}

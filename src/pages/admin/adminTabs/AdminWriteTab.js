import React, { useState, useEffect } from "react";
import "../../../styles/community/Tabs.css";

export default function AdminWriteTab({ onBack, onSubmit, editPost }) {
  const [title, setTitle] = useState(editPost ? editPost.title : "");
  const [content, setContent] = useState(editPost ? editPost.content : "");

  useEffect(() => {
    if (editPost) {
      setTitle(editPost.title);
      setContent(editPost.content);
    }
  }, [editPost]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !content) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }
    onSubmit({ ...editPost, title, content });
    onBack();
  };

  return (
    <div className="write-tab">
      <div className="write-form">
        <h2>{editPost ? "수정하기" : "새 글 작성"}</h2>

        <div className="write-row">
          <label>제목</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div className="write-row">
          <label>내용</label>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} />
        </div>

        <div className="write-btns">
          <button className="common-btn" onClick={handleSubmit}>
            {editPost ? "수정" : "등록"}
          </button>
          <button className="cancel-btn" onClick={onBack}>취소</button>
        </div>
      </div>
    </div>
  );
}

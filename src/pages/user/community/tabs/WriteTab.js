import React, { useState } from "react";
import "../../../../styles/community/Tabs.css";

function WriteTab({ onBack, onSubmit }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !content) {
      alert("제목과 내용을 모두 입력해주세요");
      return;
    }

    // 부모(FaqQnaTab)로 전달
    if (onSubmit) {
      onSubmit({ title, content });
    }

    alert("등록되었습니다");
    setTitle("");
    setContent("");
  };

  return (
    <div className="tab-inner write-tab">
      <h2>글쓰기</h2>

      <form onSubmit={handleSubmit} className="write-form">
        <div className="write-row">
          <label htmlFor="title">제목</label>
          <input
            id="title"
            type="text"
            placeholder="제목을 입력하세요."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="write-row">
          <label htmlFor="content">내용</label>
          <textarea
            id="content"
            placeholder="내용을 입력하세요."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div className="write-btns">
          <button type="submit" className="common-btn">등록</button>
          <button
            type="button"
            className="cancel-btn"
            onClick={onBack}
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
}

export default WriteTab;
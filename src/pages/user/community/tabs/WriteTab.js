import React, { useState, useEffect } from "react";
import "../../../../styles/community/Tabs.css";

function WriteTab({ onBack, onSubmit, editPost }) {
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
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    // 등록 / 수정
    if (editPost) {
      // 수정 모드
      onSubmit({ ...editPost, title, content });
      alert("수정되었습니다.");
    } else {
      // 새 글 작성
      onSubmit({ title, content });
      alert("등록되었습니다.");
    }

    // 입력 초기화 후 뒤로
    setTitle("");
    setContent("");
    onBack();
  };

  return (
    <div className="tab-inner write-tab">
      <h2>{editPost ? "글 수정" : "글쓰기"}</h2>

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
          {/* 등록 / 수정 버튼 구분 */}
          <button type="submit" className="common-btn">
            {editPost ? "수정" : "등록"}
          </button>
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

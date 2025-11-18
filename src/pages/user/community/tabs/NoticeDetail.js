import React from "react";
import "../../../../styles/community/Tabs.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";

function NoticeDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const { item, noticeList } = location.state || {};

  if (!item || !noticeList) {
    navigate("/user/community/notice");
    return null;
  }

  const index = noticeList.findIndex((n) => n.id === Number(id));

  const handlePrev = () => {
    if (index === noticeList.length - 1) return alert("이전글이 없습니다.");
    const prev = noticeList[index + 1];
    navigate(`/user/community/notice-detail/${prev.id}`, {
      state: { item: prev, noticeList },
    });
  };

  const handleNext = () => {
    if (index === 0) return alert("다음글이 없습니다.");
    const next = noticeList[index - 1];
    navigate(`/user/community/notice-detail/${next.id}`, {
      state: { item: next, noticeList },
    });
  };

  return (
    <div className="tab-inner notice-tab">
      {/* FAQ와 완전히 동일한 디자인 */}
      <div className="write-form">
        <h2>{item.title}</h2>
        <hr />

        <p style={{ whiteSpace: "pre-wrap", lineHeight: "1.6" }}>
          {item.content}
        </p>

        <p style={{ color: "#777", marginTop: "10px" }}>
          작성시간: {new Date(item.createdAt).toLocaleString()}
        </p>
      </div>

      <div className="btn-right" style={{ gap: "8px", marginTop: "20px" }}>
        <button className="common-btn small-btn" onClick={handlePrev}>
          {"< 이전글"}
        </button>
        <button className="common-btn small-btn" onClick={handleNext}>
          {"다음글 >"}
        </button>
        <button
          className="cancel-btn small-btn"
          onClick={() => navigate("/user/community/notice")}
        >
          목록으로
        </button>
      </div>
    </div>
  );
}

export default NoticeDetail;

import React, { useEffect, useState } from "react";
import "../../../../styles/community/Tabs.css";
import { useNavigate, useParams } from "react-router-dom";
import { getNotices, getNoticeById } from "../../../../utils/api";

function NoticeDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [item, setItem] = useState(null);
  const [noticeList, setNoticeList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const list = await getNotices();
        const sorted = list.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setNoticeList(sorted);

        const detail = await getNoticeById(id);
        setItem(detail);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  if (loading) return <p style={{ padding: 20 }}>로딩 중...</p>;
  if (!item) return <p style={{ padding: 20 }}>공지를 찾을 수 없습니다.</p>;

  const index = noticeList.findIndex((n) => n.id === item.id);

  const handlePrev = () => {
    if (index === noticeList.length - 1) return alert("이전글이 없습니다.");
    const prev = noticeList[index + 1];
    navigate(`/user/community/notice-detail/${prev.id}`);
  };

  const handleNext = () => {
    if (index === 0) return alert("다음글이 없습니다.");
    const next = noticeList[index - 1];
    navigate(`/user/community/notice-detail/${next.id}`);
  };

  return (
    <div className="tab-inner">
      <div className="faq-item-box">

        <h2 className="faq-detail-title">{item.title}</h2>
        <hr />

        <p className="faq-detail-content">{item.content}</p>

        <p className="faq-detail-time">
          작성시간: {new Date(item.createdAt).toLocaleString()}
        </p>

        <div className="btn-right">
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
    </div>
  );
}

export default NoticeDetail;

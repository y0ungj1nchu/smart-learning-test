import React, { useEffect, useState } from "react";
import "../../../../styles/community/Tabs.css";
import { useNavigate, useParams } from "react-router-dom";
import { getNoticeById, getNotices } from "../../../../utils/api";

function NoticeDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [item, setItem] = useState(null);
  const [noticeList, setNoticeList] = useState([]);

  // ✅ 상세 정보 + 공지 목록 불러오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const detail = await getNoticeById(id);   // ← 수정됨
        setItem(detail);

        const list = await getNotices();
        setNoticeList(list);
      } catch (err) {
        alert("공지사항을 불러오지 못했습니다.");
        navigate("/user/community/notice");
      }
    };

    fetchData();
  }, [id, navigate]);

  if (!item) return null;

  // 현재 글 index 찾기
  const index = noticeList.findIndex((n) => n.id === Number(id));

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
    <div className="tab-inner notice-tab">
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

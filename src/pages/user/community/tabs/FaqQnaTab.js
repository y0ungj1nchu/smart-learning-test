import React, { useState, useEffect, Fragment } from "react"; // (수정) Fragment 추가
import "../../../../styles/community/Tabs.css";
import { Search } from "lucide-react";
import WriteTab from ".//WriteTab"; 

import { getFaqs, getMyInquiries, createInquiry } from "../../../../utils/api";

const formatDateTime = (isoString) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toLocaleString('ko-KR', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false,
  });
};

function FaqQnaTab() {
  const [activeSubTab, setActiveSubTab] = useState("faq");
  const [search, setSearch] = useState("");
  const [isWriting, setIsWriting] = useState(false);

  const [faqList, setFaqList] = useState([]);
  const [qnaList, setQnaList] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- 1. (추가) 현재 클릭해서 열어볼 Q&A 항목 ID ---
  const [selectedInquiryId, setSelectedInquiryId] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        if (activeSubTab === "faq") {
          // FAQ 탭이면, Q&A 상세 내용을 닫음
          setSelectedInquiryId(null); 
          const faqData = await getFaqs();
          setFaqList(faqData);
        } else {
          // Q&A 탭이면, Q&A 목록을 불러옴
          const qnaData = await getMyInquiries();
          setQnaList(qnaData);
        }
      } catch (error) {
        console.error("데이터 로드 실패:", error);
        alert("데이터를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [activeSubTab]); 

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleAddQna = async (newPost) => {
    if (!newPost.title || !newPost.content) {
        alert("제목과 내용을 모두 입력해야 합니다.");
        return;
    }
    try {
      await createInquiry({ title: newPost.title, content: newPost.content });
      alert("문의가 등록되었습니다.");
      
      const qnaData = await getMyInquiries(); // 목록 새로고침
      setQnaList(qnaData);
      setIsWriting(false); // 목록으로 복귀
      
    } catch (error) {
        alert("문의 등록에 실패했습니다: " + error.message);
    }
  };

  const handleBackToList = () => {
    setSelectedPost(null);
    setEditPost(null);
    setIsWriting(false);
  };

  // --- 2. (추가) Q&A 항목 클릭(토글) 핸들러 ---
  const handleInquiryClick = (id) => {
    // 이미 열려있으면 닫고, 닫혀있으면 연다.
    if (selectedInquiryId === id) {
      setSelectedInquiryId(null);
    } else {
      setSelectedInquiryId(id);
    }
  };

  // 검색 필터링
  const filteredFaqList = faqList.filter(
    (item) =>
      item.question.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase())
  );
  const filteredQnaList = qnaList.filter(
    (item) =>
      item.title.toLowerCase().includes(search.toLowerCase())
  );

  // FAQ 테이블
  const renderFaqTable = (list) => (
    <table className="table">
      <thead>
        <tr>
          <th style={{width: "15%"}}>카테고리</th>
          <th>제목 (질문)</th>
        </tr>
      </thead>
      <tbody>
        {list.length === 0 ? (
          <tr><td colSpan="2">검색 결과가 없습니다.</td></tr>
        ) : (
          list.map((item) => (
            // (참고: FAQ도 Q&A처럼 클릭 시 답변을 보여줄 수 있습니다)
            <React.Fragment key={item.id}>
              <tr className="clickable-row" onClick={() => handleInquiryClick(item.id)}>
                <td>{item.category}</td>
                <td className="table-title">{item.question}</td>
              </tr>
              {/* FAQ 내용/답변이 펼쳐지는 부분 */}
              {selectedInquiryId === item.id && (
                <tr className="detail-row">
                  <td colSpan="2">
                    <div className="inquiry-content">
                      <p>{item.answer}</p>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))
        )}
      </tbody>
    </table>
  );

  // --- 3. (수정) Q&A 테이블 (내용 보기 기능 추가) ---
  const renderQnaTable = (list) => (
    <table className="table">
      <thead>
        <tr>
          <th style={{width: "10%"}}>상태</th>
          <th>제목</th>
          <th style={{width: "25%"}}>작성시간</th>
        </tr>
      </thead>
      <tbody>
        {list.length === 0 ? (
          <tr><td colSpan="3">작성한 문의가 없거나 검색 결과가 없습니다.</td></tr>
        ) : (
          list.map((item) => (
            // Fragment를 사용해 1개의 항목당 2개의 row(제목, 내용)를 묶음
            <Fragment key={item.id}>
              {/* 1. 제목 행 (클릭 가능) */}
              <tr 
                className="clickable-row" 
                onClick={() => handleInquiryClick(item.id)}
              >
                <td>{item.status === 'pending' ? '답변대기' : '답변완료'}</td>
                <td className="table-title">{item.title}</td>
                <td>{formatDateTime(item.createdAt)}</td>
              </tr>
              
              {/* 2. 내용 행 (클릭된 ID와 일치할 때만 보임) */}
              {selectedInquiryId === item.id && (
                <tr className="detail-row">
                  <td colSpan="3">
                    <div className="inquiry-content">
                      <strong>[문의 내용]</strong>
                      {/* (참고: whiteSpace: 'pre-wrap' CSS가 필요) */}
                      <p>{item.content}</p>
                      
                      <hr />
                      
                      <strong>[관리자 답변]</strong>
                      <p>
                        {item.status === 'answered' && item.answer 
                          ? item.answer 
                          : '답변 대기 중입니다.'}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </Fragment>
          ))
        )}
      </tbody>
    </table>
  );


  if (isWriting) {
    return <WriteTab onBack={handleBackToList} onSubmit={handleAddQna} />;
  }

  return (
    <div className="tab-inner faq-tab">
      <h2>{activeSubTab === "faq" ? "자주 묻는 질문" : "1:1 문의"}</h2>

      <div className="faq-tabs">
        <button
          className={activeSubTab === "faq" ? "active" : ""}
          onClick={() => setActiveSubTab("faq")}
        >
          FAQ
        </button>
        <button
          className={activeSubTab === "qna" ? "active" : ""}
          onClick={() => setActiveSubTab("qna")}
        >
          Q&A
        </button>
      </div>

      <div className="search-box">
        <input
          type="text"
          placeholder="검색하세요."
          value={search}
          onChange={handleSearchChange}
        />
        <button className="search-btn" onClick={handleSearchClick}>
          <Search size={18} />
        </button>

        {/* 검색 초기화 버튼 */}
        <button
          className="reset-btn"
          onClick={() => {
            setSearch("");
            setFaqList(originalFaqList);
            setQnaList(originalQnaList);
          }}
        >
          전체보기
        </button>
      </div>

      {loading ? (
        <p>데이터를 불러오는 중입니다...</p>
      ) : activeSubTab === "faq" ? (
        renderFaqTable(filteredFaqList)
      ) : (
        renderQnaTable(filteredQnaList)
      )}

      {/* Q&A 탭에만 글쓰기 버튼 노출 */}
      {activeSubTab === "qna" && (
        <div className="btn-right">
          <button className="common-btn" onClick={() => setIsWriting(true)}>
            문의하기
          </button>
        </div>
      )}
    </div>
  );
}

export default FaqQnaTab;

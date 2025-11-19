import React, { useMemo, useState, useEffect, useCallback } from "react";
import Header1 from "../../../components/common/Header1";
import Header2 from "../../../components/common/Header2";
import writeIcon from "../../../assets/writebutton.png";
import rewriteIcon from "../../../assets/rewritebutton.png";
import deleteIcon from "../../../assets/delete.png";
import "../../../styles/calendar/Calendar.css";
import {
  getCalendarData,
  addTodo,
  updateTodo,
  toggleTodo,
  deleteTodoApi,
  addDiary,
  updateDiary,
  deleteDiaryApi
} from "../../../utils/api"; 

// 날짜 포맷팅 함수
function pad(n) { return n.toString().padStart(2, "0"); }
function ymd(date) {
  const localDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  const y = localDate.getUTCFullYear();
  const m = pad(localDate.getUTCMonth() + 1);
  const d = pad(localDate.getUTCDate());
  return `${y}-${m}-${d}`;
}

const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

export default function CalendarPage() {
  const [current, setCurrent] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [selected, setSelected] = useState(() => new Date());
  const [showTodoModal, setShowTodoModal] = useState(false);
  const [showDiaryModal, setShowDiaryModal] = useState(false);
  
  const [editingTodo, setEditingTodo] = useState(null); 
  const [editingDiary, setEditingDiary] = useState(null);

  // 모달 입력 상태
  const [todoTitle, setTodoTitle] = useState("");
  const [todoMemo, setTodoMemo] = useState(""); // (메모 상태 활성화)
  const [diaryTitle, setDiaryTitle] = useState("");
  const [diaryContent, setDiaryContent] = useState("");

  const [todos, setTodos] = useState([]);
  const [diary, setDiary] = useState(null);

  /* 데이터 로딩 */
  const fetchData = useCallback(async () => {
    try {
      const dateStr = ymd(selected);
      const data = await getCalendarData(dateStr); 
      setTodos(data.todos || []);
      setDiary(data.diary || null);
    } catch (error) {
      console.error("데이터 로딩 실패:", error);
      alert("데이터를 불러오는 중 오류가 발생했습니다.");
      setTodos([]);
      setDiary(null);
    }
  }, [selected]); 

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /* 달력 UI 계산 */
  const grid = useMemo(() => {
    const y = current.getFullYear();
    const m = current.getMonth();
    return Array.from(
      { length: 42 },
      (_, i) => new Date(y, m, 1 - new Date(y, m, 1).getDay() + i)
    );
  }, [current]);

  const monthLabel = useMemo(() => `${current.getFullYear()}년 ${current.getMonth() + 1}월`, [current]);
  const dateLabel = useMemo(() => {
    const m = selected.getMonth() + 1, d = selected.getDate();
    const koDayNames = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    return `${m}월 ${d}일 ${koDayNames[selected.getDay()]}`;
  }, [selected]);

  const prevMonth = () => setCurrent(new Date(current.getFullYear(), current.getMonth() - 1, 1));
  const nextMonth = () => setCurrent(new Date(current.getFullYear(), current.getMonth() + 1, 1));
  
  const isSameDate = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  /* 모달 닫기 및 초기화 함수 */
  const closeTodoModal = () => {
    setShowTodoModal(false);
    setEditingTodo(null);
    setTodoTitle("");
    setTodoMemo(""); // (메모 초기화 활성화)
  }
  const closeDiaryModal = () => {
    setShowDiaryModal(false);
    setEditingDiary(null);
    setDiaryTitle("");
    setDiaryContent("");
  }

  /* --- API 연동 함수 (수정됨) --- */

  /* 할 일 (Todo) */
  const saveTodo = async () => {
    if (!todoTitle.trim()) {
      alert("할 일 내용을 입력해주세요.");
      return;
    }
    try {
      const todoData = {
        title: todoTitle.trim(),
        dueDate: ymd(selected),
        memo: todoMemo.trim()
      };

      if (editingTodo) { 
        await updateTodo(editingTodo.id, todoData);
      } else { 
        await addTodo(todoData);
      }
      closeTodoModal();
      fetchData(); 
    } catch (error) {
      alert(`할 일 저장 실패: ${error.message}`);
    }
  };

  const toggleTodoDone = async (todoItem) => {
    try {
      await toggleTodo(todoItem.id, !todoItem.isCompleted); 
      fetchData();
    } catch (error) {
      alert(`할 일 상태 변경 실패: ${error.message}`);
    }
  };

  const deleteTodo = async (todoId) => {
    if (window.confirm("정말로 삭제하시겠습니까?")) {
      try {
        await deleteTodoApi(todoId);
        fetchData();
      } catch (error) {
        alert(`할 일 삭제 실패: ${error.message}`);
      }
    }
  };

  // 할 일 수정 모달 열기
  const handleOpenEditTodo = (todoItem) => {
    setEditingTodo(todoItem);
    setTodoTitle(todoItem.title);
    setTodoMemo(todoItem.memo || "");
    setShowTodoModal(true);
  };

  // 할 일 추가 모달 열기
  const handleOpenAddTodo = () => {
    setEditingTodo(null); 
    setTodoTitle("");
    setTodoMemo(""); // (메모 초기화 활성화)
    setShowTodoModal(true);
  };

  /* 일기 (Diary) - (수정 불필요) */
  const saveDiary = async () => {
    if (!diaryTitle.trim() && !diaryContent.trim()) {
      alert("제목이나 내용을 입력해주세요.");
      return;
    }
    try {
      const diaryData = {
        title: diaryTitle.trim(),
        content: diaryContent.trim(),
        diaryDate: ymd(selected)
      };

      if (editingDiary) {
        await updateDiary(editingDiary.id, diaryData);
      } else { 
        await addDiary(diaryData);
      }
      closeDiaryModal();
      fetchData();
    } catch (error) {
      alert(`일기 저장 실패: ${error.message}`);
    }
  };

  const clearDiary = async () => {
    if (diary && window.confirm("일기를 삭제하시겠습니까?")) {
      try {
        await deleteDiaryApi(diary.id);
        fetchData(); 
      } catch (error) {
        alert(`일기 삭제 실패: ${error.message}`);
      }
    }
  };

  const openEditDiary = () => {
    if (diary) {
      setEditingDiary(diary); 
      setDiaryTitle(diary.title);
      setDiaryContent(diary.content || "");
      setShowDiaryModal(true);
    }
  };

  const openNewDiary = () => {
    setEditingDiary(null);
    setDiaryTitle("");
    setDiaryContent("");
    setShowDiaryModal(true);
  };

  /* --- JSX 렌더링 (수정됨) --- */
  return (
    <div className="calendar-page">
      <Header1 isLoggedIn={true} />
      <Header2 isLoggedIn={true} />

      <div className="calendar-layout">
        {/* 캘린더 */}
        <div className="calendar-card">
          <div className="calendar-head">
            <button className="nav-btn" onClick={prevMonth}>‹</button>
            <div className="month-label">{monthLabel}</div>
            <button className="nav-btn" onClick={nextMonth}>›</button>
          </div>
          <div className="weekday-row">
            {weekDays.map((w) => <div key={w} className="weekday">{w}</div>)}
          </div>
          <div className="grid">
            {grid.map((d, i) => {
              const inMonth = d.getMonth() === current.getMonth();
              const isSel = isSameDate(d, selected);
              return (
                <div
                  key={i}
                  className={`cell ${inMonth ? "" : "dim"} ${isSel ? "selected" : ""}`}
                  onClick={() => setSelected(d)}
                >
                  <span className="day">{d.getDate()}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 오른쪽 패널: To-Do 리스트 + 한 줄 일기 */}
        <div className="side-panel">
          {/* To-Do 리스트 */}
          <div className="panel-card">
            <div className="panel-head">
              <h3>To-Do List</h3>
              <img src={writeIcon} alt="추가" className="icon-img large" onClick={handleOpenAddTodo} />
            </div>
            <div className="date-chip">{dateLabel}</div>
            <ul className="todo-list">
              {todos.length === 0 ? (
                <li className="muted">(등록된 할 일이 없습니다)</li>
              ) : (
                todos.map((t) => (
                  <li key={t.id} className="todo-item" onClick={() => handleOpenEditTodo(t)}>
                    <div className="todo-left">
                      <input
                        type="checkbox"
                        checked={t.isCompleted} 
                        onChange={() => toggleTodoDone(t)} 
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div>
                        <div className={`todo-title ${t.isCompleted ? "done" : ""}`}>{t.title}</div>
                        {/* --- 🔥 3. memo 렌더링 활성화 --- */}
                        {t.memo && <div className="todo-memo">{t.memo}</div>}
                        {/* ----------------------------- */}
                      </div>
                    </div>
                    {/* 삭제 버튼: deleteTodo 호출 */}
                    <img
                      src={deleteIcon}
                      alt="삭제"
                      className="icon-img large"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteTodo(t.id);
                      }}
                    />
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* 한 줄 일기 */}
          <div className="panel-card diary-section">
            <div className="panel-head">
              <h3>한 줄 일기</h3>
              <div className="head-actions spaced">
                {!diary ? (
                  // 작성 버튼: openNewDiary 호출
                  <img src={writeIcon} alt="작성" className="icon-img large" onClick={openNewDiary} />
                ) : (
                  <>
                    {/* 수정 버튼: openEditDiary 호출 */}
                    <img src={rewriteIcon} alt="수정" className="icon-img large" onClick={openEditDiary} />
                    {/* 삭제 버튼: clearDiary 호출 */}
                    <img src={deleteIcon} alt="삭제" className="icon-img large" onClick={clearDiary} />
                  </>
                )}
              </div>
            </div>
            {diary ? (
              <div className="diary-box">
                {diary.title && <div className="diary-title">{diary.title}</div>}
                <div className="diary-content">{diary.content || "(내용 없음)"}</div>
              </div>
            ) : (
              <div className="empty-text">작성된 일기가 없습니다.</div>
            )}
          </div>
        </div>
      </div>

      {/* To-Do 모달 */}
      {showTodoModal && (
        <div className="modal-backdrop" onClick={closeTodoModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">{editingTodo ? "할 일 수정" : "할 일 추가"}</div>
            <div className="modal-body">
              <label className="field">
                <span>할 일 내용</span>
                <input value={todoTitle} onChange={(e) => setTodoTitle(e.target.value)} placeholder="예: React 강의 듣기" />
              </label>
              
              {/* --- 🔥 4. memo 입력 UI 활성화 --- */}
              <label className="field">
                <span>메모 (선택)</span>
                <textarea rows={4} value={todoMemo} onChange={(e) => setTodoMemo(e.target.value)} placeholder="상세 내용을 입력하세요." />
              </label>
              {/* ----------------------------- */}

            </div>
            <div className="modal-actions">
              <button className="btn secondary" onClick={closeTodoModal}>취소</button>
              <button className="btn primary" onClick={saveTodo}>확인</button>
            </div>
          </div>
        </div>
      )}

      {/* 한 줄 일기 모달 */}
      {showDiaryModal && (
        <div className="modal-backdrop" onClick={closeDiaryModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">{editingDiary ? "일기 수정" : "일기 작성"}</div>
            <div className="modal-body">
              <label className="field">
                <span>제목</span>
                <input value={diaryTitle} onChange={(e) => setDiaryTitle(e.target.value)} placeholder="오늘 하루를 요약한다면?" />
              </label>
              <label className="field">
                <span>내용</span>
                <textarea rows={6} value={diaryContent} onChange={(e) => setDiaryContent(e.target.value)} placeholder="오늘 배운 점이나 느낀 점을 기록해보세요." />
              </label>
            </div>
            <div className="modal-actions">
              <button className="btn secondary" onClick={closeDiaryModal}>취소</button>
              <button className="btn primary" onClick={saveDiary}>확인</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
import React, { useMemo, useState, useEffect } from "react";
import Header1 from "../../../components/common/Header1";
import Header2 from "../../../components/common/Header2";
import writeIcon from "../../../assets/writebutton.png";
import rewriteIcon from "../../../assets/rewritebutton.png";
import deleteIcon from "../../../assets/delete.png";
import "../../../styles/calendar/Calendar.css";

function pad(n) { return n.toString().padStart(2, "0"); }
function ymd(d) {
  const y = d.getFullYear();
  const m = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  return `${y}-${m}-${day}`;
}
const weekDays = ["일","월","화","수","목","금","토"];

export default function CalendarPage() {
  /* 상태 */
  const [current, setCurrent] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [selected, setSelected] = useState(() => new Date());
  const [showTodoModal, setShowTodoModal] = useState(false);
  const [showDiaryModal, setShowDiaryModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const [todoTitle, setTodoTitle] = useState("");
  const [todoMemo, setTodoMemo] = useState("");
  const [diaryTitle, setDiaryTitle] = useState("");
  const [diaryContent, setDiaryContent] = useState("");

  const keyTodo = `todos:${ymd(selected)}`;
  const keyDiary = `diary:${ymd(selected)}`;
  const [todos, setTodos] = useState([]);
  const [diary, setDiary] = useState(null);

  /* 로컬스토리지 로드 */
  useEffect(() => {
  const t = JSON.parse(localStorage.getItem(keyTodo) || "[]");
  const cleaned = (Array.isArray(t) ? t : []).filter(item => item && item.title);
  const normalized = cleaned.map(item => ({
    title: item.title || "",
    memo: item.memo || "",
    checklist: item.checklist ?? true,
    done: item.done ?? false
  }));
  setTodos(normalized);

  const d = JSON.parse(localStorage.getItem(keyDiary) || "null");
  setDiary(d);
}, [keyTodo, keyDiary]);

  /* 달력 생성 */
  const grid = useMemo(() => {
    const y = current.getFullYear();
    const m = current.getMonth();
    return Array.from({ length: 42 }, (_, i) => new Date(y, m, 1 - new Date(y, m, 1).getDay() + i));
  }, [current]);

  const monthLabel = useMemo(() => `${current.getFullYear()}년 ${current.getMonth() + 1}월`, [current]);
  const dateLabel = useMemo(() => {
    const m = selected.getMonth() + 1, d = selected.getDate();
    const koDayNames = ["일요일","월요일","화요일","수요일","목요일","금요일","토요일"];
    return `${m}월 ${d}일 ${koDayNames[selected.getDay()]}`;
  }, [selected]);

  const prevMonth = () => setCurrent(new Date(current.getFullYear(), current.getMonth() - 1, 1));
  const nextMonth = () => setCurrent(new Date(current.getFullYear(), current.getMonth() + 1, 1));

  /* To-Do 리스트 */
  const saveTodo = () => {
    if (!todoTitle.trim()) return;
    const next = [...todos];
    const newItem = { title: todoTitle.trim(), memo: todoMemo.trim(), checklist: true, done: false };
    if (editIndex !== null) next[editIndex] = newItem;
    else next.unshift(newItem);
    setTodos(next);
    localStorage.setItem(keyTodo, JSON.stringify(next));
    setTodoTitle("");
    setTodoMemo("");
    setEditIndex(null);
    setShowTodoModal(false);
  };

  const openEditTodo = (i) => {
    setEditIndex(i);
    setTodoTitle(todos[i].title);
    setTodoMemo(todos[i].memo);
    setShowTodoModal(true);
  };

  const deleteTodo = (i) => {
    const next = todos.filter((_, idx) => idx !== i);
    setTodos(next);
    localStorage.setItem(keyTodo, JSON.stringify(next));
  };

  const toggleTodoDone = (i) => {
    const next = [...todos];
    next[i].done = !next[i].done;
    setTodos(next);
    localStorage.setItem(keyTodo, JSON.stringify(next));
  };

  /* 한 줄 일기 */
  const saveDiary = () => {
    if (!diaryTitle.trim() && !diaryContent.trim()) return;
    const data = { title: diaryTitle.trim(), content: diaryContent.trim() };
    setDiary(data);
    localStorage.setItem(keyDiary, JSON.stringify(data));
    setDiaryTitle("");
    setDiaryContent("");
    setShowDiaryModal(false);
  };

  const openEditDiary = () => {
    if (diary) {
      setDiaryTitle(diary.title);
      setDiaryContent(diary.content);
    }
    setShowDiaryModal(true);
  };

  const clearDiary = () => {
    setDiary(null);
    localStorage.removeItem(keyDiary);
  };

  const openNewDiary = () => {
    setDiaryTitle("");
    setDiaryContent("");
    setShowDiaryModal(true);
  };

  const isSameDate = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

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

        {/* To-Do 리스트 + 한 줄 일기 */}
        <div className="side-panel">
          {/* To-Do 리스트 */}
          <div className="panel-card">
            <div className="panel-head">
              <h3>To-Do List</h3>
              <img src={writeIcon} alt="추가" className="icon-img large" onClick={() => setShowTodoModal(true)} />
            </div>
            <div className="date-chip">{dateLabel}</div>

            <ul className="todo-list">
              {todos.length === 0 ? (
                <li className="muted">(등록된 체크리스트가 없습니다)</li>
              ) : (
                todos.map((t, i) => (
                  <li key={i} className="todo-item" onClick={() => openEditTodo(i)}>
                    <div className="todo-left">
                      {t.checklist && (
                        <input
                          type="checkbox"
                          checked={t.done}
                          onChange={() => toggleTodoDone(i)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      )}
                      <div>
                        <div className={`todo-title ${t.done ? "done" : ""}`}>{t.title}</div>
                        {t.memo && <div className="todo-memo">{t.memo}</div>}
                      </div>
                    </div>
                    <img
                      src={deleteIcon}
                      alt="삭제"
                      className="icon-img large"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteTodo(i);
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
                  <img src={writeIcon} alt="작성" className="icon-img large" onClick={openNewDiary} />
                ) : (
                  <>
                    <img src={rewriteIcon} alt="수정" className="icon-img large" onClick={openEditDiary} />
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
              <div className="empty-text">내용이 없습니다.</div>
            )}
          </div>
        </div>
      </div>

      {/* To-Do 모달 */}
      {showTodoModal && (
        <div className="modal-backdrop" onClick={() => setShowTodoModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">{editIndex !== null ? "체크리스트 수정" : "체크리스트 추가"}</div>
            <div className="modal-body">
              <label className="field">
                <span>항목 이름</span>
                <input value={todoTitle} onChange={(e) => setTodoTitle(e.target.value)} />
              </label>
              <label className="field">
                <span>메모</span>
                <textarea rows={4} value={todoMemo} onChange={(e) => setTodoMemo(e.target.value)} />
              </label>
            </div>
            <div className="modal-actions">
              <button className="btn secondary" onClick={() => setShowTodoModal(false)}>취소</button>
              <button className="btn primary" onClick={saveTodo}>확인</button>
            </div>
          </div>
        </div>
      )}

      {/* 한 줄 일기 모달 */}
      {showDiaryModal && (
        <div className="modal-backdrop" onClick={() => setShowDiaryModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">한 줄 일기</div>
            <div className="modal-body">
              <label className="field">
                <span>제목</span>
                <input value={diaryTitle} onChange={(e) => setDiaryTitle(e.target.value)} />
              </label>
              <label className="field">
                <span>내용</span>
                <textarea rows={6} value={diaryContent} onChange={(e) => setDiaryContent(e.target.value)} />
              </label>
            </div>
            <div className="modal-actions">
              <button className="btn secondary" onClick={() => setShowDiaryModal(false)}>취소</button>
              <button className="btn primary" onClick={saveDiary}>확인</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useMemo, useState, useEffect } from "react";
import Header1 from "../../../components/common/Header1";
import Header2 from "../../../components/common/Header2";
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
  const [current, setCurrent] = useState(() => {
    const t = new Date();
    return new Date(t.getFullYear(), t.getMonth(), 1);
  });
  const [selected, setSelected] = useState(() => new Date());
  const [showTodoModal, setShowTodoModal] = useState(false);
  const [showDiaryModal, setShowDiaryModal] = useState(false);

  // 입력 상태
  const [todoTitle, setTodoTitle] = useState("");
  const [todoMemo, setTodoMemo] = useState("");
  const [diaryTitle, setDiaryTitle] = useState("");
  const [diaryContent, setDiaryContent] = useState("");

  // 로컬스토리지 키
  const keyTodo = `todos:${ymd(selected)}`;
  const keyDiary = `diary:${ymd(selected)}`;

  const [todos, setTodos] = useState([]);
  const [diary, setDiary] = useState(null); // {title, content} or null

  // 선택 날짜 바뀌면 저장된 내용 로드
  useEffect(() => {
    const t = JSON.parse(localStorage.getItem(keyTodo) || "[]");
    const d = JSON.parse(localStorage.getItem(keyDiary) || "null");
    setTodos(Array.isArray(t) ? t : []);
    setDiary(d);
  }, [keyTodo, keyDiary]);

  // 달력 그리드
  const grid = useMemo(() => {
    const year = current.getFullYear();
    const month = current.getMonth();
    const firstDay = new Date(year, month, 1);
    const startOffset = firstDay.getDay(); // 0=Sun
    const startDate = new Date(year, month, 1 - startOffset);
    const cells = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      cells.push(d);
    }
    return cells;
  }, [current]);

  // 요일/날짜 라벨
  const koDayNames = ["일요일","월요일","화요일","수요일","목요일","금요일","토요일"];
  const dateLabel = useMemo(() => {
    const m = selected.getMonth() + 1;
    const d = selected.getDate();
    const day = koDayNames[selected.getDay()];
    return `${m}월 ${d}일 ${day}`;
  }, [selected]);

  // 월/년
  const monthLabel = useMemo(() => {
    const y = current.getFullYear();
    const m = current.getMonth() + 1;
    return `${y}년 ${m}월`;
  }, [current]);

  // 이동
  const prevMonth = () => setCurrent(new Date(current.getFullYear(), current.getMonth() - 1, 1));
  const nextMonth = () => setCurrent(new Date(current.getFullYear(), current.getMonth() + 1, 1));

  // To-Do 추가/삭제
  const addTodo = () => {
    if (!todoTitle.trim()) return;
    const next = [{ title: todoTitle.trim(), memo: todoMemo.trim() }, ...todos];
    setTodos(next);
    localStorage.setItem(keyTodo, JSON.stringify(next));
    setTodoTitle("");
    setTodoMemo("");
    setShowTodoModal(false);
  };
  const removeTodo = (idx) => {
    const next = todos.filter((_, i) => i !== idx);
    setTodos(next);
    localStorage.setItem(keyTodo, JSON.stringify(next));
  };

  // Diary 저장/삭제
  const saveDiary = () => {
    if (!diaryTitle.trim() && !diaryContent.trim()) return;
    const data = { title: diaryTitle.trim(), content: diaryContent.trim() };
    setDiary(data);
    localStorage.setItem(keyDiary, JSON.stringify(data));
    setDiaryTitle("");
    setDiaryContent("");
    setShowDiaryModal(false);
  };
  const clearDiary = () => {
    setDiary(null);
    localStorage.removeItem(keyDiary);
  };

  // 선택된 셀인지와 이번달 셀인지
  const isSameDate = (a, b) => a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate();

  return (
    <div className="calendar-page">
      {/* 상단 헤더 */}
      <Header1 isLoggedIn={true} />
      <Header2 isLoggedIn={true} />

      <div className="calendar-layout">
        {/* 좌측: To-Do List / 한 줄 일기 */}
        <div className="side-panel">
          {/* To-Do List */}
          <div className="panel-card">
            <div className="panel-head">
              <h3>To-Do List</h3>
              <button className="ghost-btn" onClick={() => setShowTodoModal(true)}>작성</button>
            </div>
            {/* 선택 날짜 라벨 */}
            <div className="date-chip">{dateLabel}</div>
            <ul className="todo-list">
              {todos.length === 0 ? (
                <li className="muted">(등록된 할 일이 없습니다)</li>
              ) : (
                todos.map((t, i) => (
                  <li key={i} className="todo-item">
                    <div>
                      <div className="todo-title">{t.title}</div>
                      {t.memo && <div className="todo-memo">{t.memo}</div>}
                    </div>
                    <button className="icon-btn" onClick={() => removeTodo(i)}>✕</button>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* 한 줄 일기 */}
          <div className="panel-card">
            <div className="panel-head">
              <h3>한 줄 일기</h3>
              <div className="head-actions">
                <button className="ghost-btn" onClick={() => setShowDiaryModal(true)}>작성</button>
                {diary && <button className="ghost-btn danger" onClick={clearDiary}>삭제</button>}
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

        {/* 우측: 달력 */}
        <div className="calendar-card">
          <div className="calendar-head">
            <button className="nav-btn" onClick={prevMonth}>‹</button>
            <div className="month-label">{monthLabel}</div>
            <button className="nav-btn" onClick={nextMonth}>›</button>
          </div>

          <div className="weekday-row">
            {weekDays.map((w) => (
              <div key={w} className="weekday">{w}</div>
            ))}
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
      </div>

      {/* To-Do 작성 */}
      {showTodoModal && (
        <div className="modal-backdrop" onClick={() => setShowTodoModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">To-Do List</div>
            <div className="modal-body">
              <label className="field">
                <span>일정 이름</span>
                <input value={todoTitle} onChange={(e) => setTodoTitle(e.target.value)} />
              </label>
              <label className="field">
                <span>메모</span>
                <textarea rows={4} value={todoMemo} onChange={(e) => setTodoMemo(e.target.value)} />
              </label>
            </div>
            <div className="modal-actions">
              <button className="btn secondary" onClick={() => setShowTodoModal(false)}>취소</button>
              <button className="btn primary" onClick={addTodo}>확인</button>
            </div>
          </div>
        </div>
      )}

      {/* 일기 작성 */}
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

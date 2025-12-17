import React, { useMemo, useState, useEffect, useCallback } from "react";
import Header1 from "../../../components/common/Header1";
import Header2 from "../../../components/common/Header2";
import writeIcon from "../../../assets/writebutton.png";
import rewriteIcon from "../../../assets/rewritebutton.png";
import deleteIcon from "../../../assets/delete.png";
import "../../../styles/calendar/Calendar.css";

import {
  getCalendarMonthSummary,
  getCalendarDay,
  addTodo,
  updateTodo,
  toggleTodo,
  deleteTodoApi,
  addDiary,
  updateDiary,
  deleteDiaryApi,
} from "../../../utils/api";

/* ================= 날짜 유틸 ================= */
function pad(n) {
  return n.toString().padStart(2, "0");
}
function ymd(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}`;
}

const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

export default function CalendarPage() {
  const [current, setCurrent] = useState(
    () => new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );
  const [selected, setSelected] = useState(() => new Date());

  const [monthSummary, setMonthSummary] = useState([]);
  const [todos, setTodos] = useState([]);
  const [diary, setDiary] = useState(null);

  const [showTodoModal, setShowTodoModal] = useState(false);
  const [showDiaryModal, setShowDiaryModal] = useState(false);

  const [editingTodo, setEditingTodo] = useState(null);
  const [editingDiary, setEditingDiary] = useState(null);

  const [todoTitle, setTodoTitle] = useState("");
  const [todoMemo, setTodoMemo] = useState("");

  const [diaryTitle, setDiaryTitle] = useState("");
  const [diaryContent, setDiaryContent] = useState("");

  /* ================= 날짜 라벨 ================= */
  const dateLabel = (() => {
    const m = selected.getMonth() + 1;
    const d = selected.getDate();
    const ko = [
      "일요일",
      "월요일",
      "화요일",
      "수요일",
      "목요일",
      "금요일",
      "토요일",
    ];
    return `${m}월 ${d}일 ${ko[selected.getDay()]}`;
  })();

  /* ================= 월 요약 ================= */
  const fetchMonth = useCallback(async () => {
    try {
      const y = current.getFullYear();
      const m = current.getMonth() + 1;
      const data = await getCalendarMonthSummary(y, m);
      setMonthSummary(data || []);
    } catch {
      setMonthSummary([]);
    }
  }, [current]);

  useEffect(() => {
    fetchMonth();
  }, [fetchMonth]);

  /* ================= 일 데이터 ================= */
  const fetchDay = useCallback(async () => {
    try {
      const data = await getCalendarDay(ymd(selected));
      setTodos(data.todos || []);
      setDiary(data.diary || null);
    } catch {
      setTodos([]);
      setDiary(null);
    }
  }, [selected]);

  useEffect(() => {
    fetchDay();
  }, [fetchDay]);

  /* ================= 달력 grid ================= */
  const grid = useMemo(() => {
    const y = current.getFullYear();
    const m = current.getMonth();
    return Array.from({ length: 42 }, (_, i) => {
      return new Date(y, m, 1 - new Date(y, m, 1).getDay() + i);
    });
  }, [current]);

  const monthLabel = `${current.getFullYear()}년 ${
    current.getMonth() + 1
  }월`;

  const getDaySummary = (dateStr) =>
    monthSummary.find((d) => d.date === dateStr) || {
      todoCount: 0,
      hasDiary: 0,
    };

  const isSameDate = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  /* ================= Todo ================= */
  const saveTodo = async () => {
    if (!todoTitle.trim()) return;

    const body = {
      title: todoTitle.trim(),
      memo: todoMemo.trim(),
      dueDate: ymd(selected),
    };

    try {
      if (editingTodo) {
        await updateTodo(editingTodo.id, body);
      } else {
        await addTodo(body);
      }
      closeTodoModal();
      fetchDay();
      fetchMonth();
    } catch {
      alert("저장 실패");
    }
  };

  const toggleTodoDone = async (todo) => {
    try {
      await toggleTodo(todo.id, !todo.isCompleted);
      fetchDay();
      fetchMonth();
    } catch {
      alert("변경 실패");
    }
  };

  const deleteTodoItem = async (id) => {
    if (!window.confirm("삭제할까요?")) return;
    try {
      await deleteTodoApi(id);
      fetchDay();
      fetchMonth();
    } catch {
      alert("삭제 실패");
    }
  };

  const closeTodoModal = () => {
    setShowTodoModal(false);
    setEditingTodo(null);
    setTodoTitle("");
    setTodoMemo("");
  };

  /* ================= Diary ================= */
  const saveDiaryEntry = async () => {
    const body = {
      title: diaryTitle.trim(),
      content: diaryContent.trim(),
      diaryDate: ymd(selected),
    };

    try {
      if (editingDiary) {
        await updateDiary(editingDiary.id, body);
      } else {
        await addDiary(body);
      }
      closeDiaryModal();
      fetchDay();
      fetchMonth();
    } catch {
      alert("저장 실패");
    }
  };

  const clearDiary = async () => {
    if (!window.confirm("삭제하시겠습니까?")) return;
    try {
      await deleteDiaryApi(diary.id);
      fetchDay();
      fetchMonth();
    } catch {
      alert("삭제 실패");
    }
  };

  const closeDiaryModal = () => {
    setShowDiaryModal(false);
    setEditingDiary(null);
    setDiaryTitle("");
    setDiaryContent("");
  };

  /* ================= JSX ================= */
  return (
    <div className="calendar-page">
      <Header1 isLoggedIn />
      <Header2 isLoggedIn />

      <div className="page-content" style={{ paddingTop: "93px" }}>
        <div className="calendar-layout">

          {/* ===== 달력 ===== */}
          <div className="calendar-card">
            <div className="calendar-head">
              <button
                className="nav-btn"
                onClick={() =>
                  setCurrent(
                    new Date(
                      current.getFullYear(),
                      current.getMonth() - 1,
                      1
                    )
                  )
                }
              >
                ‹
              </button>
              <div className="month-label">{monthLabel}</div>
              <button
                className="nav-btn"
                onClick={() =>
                  setCurrent(
                    new Date(
                      current.getFullYear(),
                      current.getMonth() + 1,
                      1
                    )
                  )
                }
              >
                ›
              </button>
            </div>

            <div className="weekday-row">
              {weekDays.map((w) => (
                <div key={w} className="weekday">
                  {w}
                </div>
              ))}
            </div>

            <div className="grid">
              {grid.map((d, i) => {
                const dateStr = ymd(d);
                const { todoCount, hasDiary } = getDaySummary(dateStr);
                const inMonth = d.getMonth() === current.getMonth();
                const isSel = isSameDate(d, selected);

                return (
                  <div
                    key={i}
                    className={`cell ${inMonth ? "" : "dim"} ${
                      isSel ? "selected" : ""
                    }`}
                    onClick={() => setSelected(d)}
                  >
                    <span className="day day-left">{d.getDate()}</span>
                    {todoCount > 0 && (
                      <span className="todo-underline">{todoCount}</span>
                    )}
                    {hasDiary ? <span className="diary-dot"></span> : null}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ===== 오른쪽 패널 ===== */}
          <div className="side-panel">
            {/* Todo */}
            <div className="panel-card">
              <div className="panel-head">
                <h3>To-Do List</h3>
                <img
                  src={writeIcon}
                  className="icon-img large"
                  onClick={() => setShowTodoModal(true)}
                />
              </div>

              <div className="date-chip">{dateLabel}</div>

              <ul className="todo-list scrollable-list">
                {todos.length === 0 ? (
                  <li className="muted">(등록된 체크리스트가 없습니다)</li>
                ) : (
                  todos.map((t) => (
                    <li key={t.id} className="todo-item">
                      <div className="todo-left">
                        <input
                          type="checkbox"
                          checked={t.isCompleted}
                          onChange={(e) => {
                            e.stopPropagation();
                            toggleTodoDone(t);
                          }}
                        />
                        <div
                          className="todo-text-area"
                          onClick={() => {
                            setEditingTodo(t);
                            setTodoTitle(t.title);
                            setTodoMemo(t.memo || "");
                            setShowTodoModal(true);
                          }}
                        >
                          <div
                            className={`todo-title ${
                              t.isCompleted ? "done" : ""
                            }`}
                          >
                            {t.title}
                          </div>
                          {t.memo && (
                            <div className="todo-memo">{t.memo}</div>
                          )}
                        </div>
                      </div>

                      <img
                        src={deleteIcon}
                        className="icon-delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteTodoItem(t.id);
                        }}
                      />
                    </li>
                  ))
                )}
              </ul>
            </div>

            {/* Diary */}
            <div className="panel-card diary-section">
              <div className="panel-head">
                <h3>한 줄 일기</h3>

                {!diary ? (
                  <img
                    src={writeIcon}
                    className="icon-img large"
                    onClick={() => setShowDiaryModal(true)}
                  />
                ) : (
                  <>
                    <img
                      src={rewriteIcon}
                      className="icon-img large"
                      onClick={() => {
                        setEditingDiary(diary);
                        setDiaryTitle(diary.title);
                        setDiaryContent(diary.content);
                        setShowDiaryModal(true);
                      }}
                    />
                    <img
                      src={deleteIcon}
                      className="icon-delete"
                      onClick={clearDiary}
                    />
                  </>
                )}
              </div>

              {diary ? (
                <div className="diary-box diary-scroll">
                  {diary.title && (
                    <div className="diary-title">{diary.title}</div>
                  )}
                  <div className="diary-content">{diary.content}</div>
                </div>
              ) : (
                <div className="empty-text">내용이 없습니다.</div>
              )}
            </div>
          </div>
        </div>

        {/* Todo Modal */}
        {showTodoModal && (
          <div className="modal-backdrop" onClick={closeTodoModal}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-title">
                {editingTodo ? "체크리스트 수정" : "체크리스트 추가"}
              </div>

              <div className="modal-body">
                <label className="field">
                  <span>항목 이름</span>
                  <input
                    value={todoTitle}
                    onChange={(e) => setTodoTitle(e.target.value)}
                  />
                </label>

                <label className="field">
                  <span>메모</span>
                  <textarea
                    rows={4}
                    value={todoMemo}
                    onChange={(e) => setTodoMemo(e.target.value)}
                  />
                </label>
              </div>

              <div className="modal-actions">
                <button
                  className="btn secondary"
                  onClick={closeTodoModal}
                >
                  취소
                </button>
                <button className="btn primary" onClick={saveTodo}>
                  확인
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Diary Modal */}
        {showDiaryModal && (
          <div className="modal-backdrop" onClick={closeDiaryModal}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-title">
                {editingDiary ? "일기 수정" : "일기 작성"}
              </div>

              <div className="modal-body">
                <label className="field">
                  <span>제목</span>
                  <input
                    value={diaryTitle}
                    onChange={(e) => setDiaryTitle(e.target.value)}
                  />
                </label>

                <label className="field">
                  <span>내용</span>
                  <textarea
                    rows={6}
                    value={diaryContent}
                    onChange={(e) => setDiaryContent(e.target.value)}
                  />
                </label>
              </div>

              <div className="modal-actions">
                <button
                  className="btn secondary"
                  onClick={closeDiaryModal}
                >
                  취소
                </button>
                <button
                  className="btn primary"
                  onClick={saveDiaryEntry}
                >
                  확인
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

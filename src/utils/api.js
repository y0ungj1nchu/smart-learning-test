/**
 * 갓생 제조기 - 프론트엔드 API 통신 모듈
 * 백엔드 서버(http://localhost:3001)와 통신을 담당합니다.
 */

const API_BASE_URL = "http://localhost:3001/api";

/* -----------------------------------------------------
   TOKEN 관리
----------------------------------------------------- */
const getToken = () => localStorage.getItem("authToken");

/* -----------------------------------------------------
   기본 JSON 요청 함수
----------------------------------------------------- */
const request = async (endpoint, method = "GET", body = null) => {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const config = { method, headers };
  if (body) config.body = JSON.stringify(body);

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP 에러 발생: ${response.status}`);
    }
    return data;
  } catch (err) {
    console.error(`API 요청 실패 → ${method} ${endpoint}`, err);
    throw err;
  }
};

/* -----------------------------------------------------
   multipart/form-data 요청 함수
----------------------------------------------------- */
const requestWithFile = async (endpoint, formData) => {
  const token = getToken();
  const headers = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers,
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || `파일 업로드 실패`);
    }

    return data;
  } catch (err) {
    console.error(`파일 업로드 실패 → ${endpoint}`, err);
    throw err;
  }
};

/* -----------------------------------------------------
   JWT에서 role 얻기
----------------------------------------------------- */
export const getUserRole = () => {
  const token = localStorage.getItem("authToken");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role;
  } catch {
    return null;
  }
};

/* ========================================================================
    1. 인증 API
=========================================================================== */
export const signupUser = (data) => {
  return request("/auth/signup", "POST", {
    email: data.email,
    password: data.password,
    nickname: data.name,
  });
};

export const loginUser = (data) => {
  return request("/auth/login", "POST", {
    email: data.id,
    password: data.password,
  });
};

/* ========================================================================
    2. 사용자 정보 API
=========================================================================== */
export const getMyProfile = () => request("/user/me");

export const updateNickname = (nickname) =>
  request("/user/nickname", "PUT", { newNickname: nickname });

export const updateCharacterName = (name) =>
  request("/user/character/name", "PUT", { characterName: name });

export const updateCharacterImage = (image) =>
  request("/user/character/image", "PUT", { characterImage: image });

export const updatePassword = (curr, next) =>
  request("/user/password", "PUT", {
    currentPassword: curr,
    newPassword: next,
  });

/* ========================================================================
    3. 캘린더(일기 + 할일)
=========================================================================== */

// Todo
export const addTodo = (data) => request("/todos", "POST", data);
export const updateTodo = (id, data) =>
  request(`/todos/${id}`, "PUT", data);
export const toggleTodo = (id, isCompleted) =>
  request(`/todos/${id}/toggle`, "PUT", { isCompleted });
export const deleteTodoApi = (id) => request(`/todos/${id}`, "DELETE");

// Diary
export const addDiary = (data) => request("/diaries", "POST", data);
export const updateDiary = (id, data) =>
  request(`/diaries/${id}`, "PUT", data);
export const deleteDiaryApi = (id) => request(`/diaries/${id}`, "DELETE");

export const getCalendarData = (date) =>
  request(`/diaries/date/${date}`, "GET");

/* ========================================================================
    4. 순공시간(Study)
=========================================================================== */
export const startStudySession = () =>
  request("/study/start", "POST");

export const stopStudySession = (logId) =>
  request(`/study/stop/${logId}`, "PUT");

export const getStudySummary = () => request("/study/summary");
export const getCurrentStudySession = () => request("/study/current");

/* ========================================================================
    5. 단어 게임 — 사용자용 words.js 기반 API
=========================================================================== */

// XLSX 템플릿 다운로드
export const downloadTemplateAPI = async () => {
  const token = getToken();

  const res = await fetch(`${API_BASE_URL}/words/template`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (!res.ok) throw new Error("템플릿 다운로드 실패");

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "WordSetTemplate.xlsx";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

// 사용자 업로드 단어장 업로드
export const uploadWordSetAPI = (title, file) => {
  const form = new FormData();
  form.append("setTitle", title);
  form.append("wordFile", file);
  return requestWithFile("/words/upload", form);
};

// 사용자 업로드 단어장 목록
export const fetchWordSetsAPI = () => request("/words/wordsets");

// 사용자 단어장 → 퀴즈 생성
export const getWordsForSetAPI = (id) =>
  request(`/words/wordsets/${id}`);

// 사용자 업로드 단어장 삭제
export const deleteWordSetAPI = (id) =>
  request(`/words/wordsets/${id}`, "DELETE");

/* ========================================================================
    ★ 관리자 제공 단어장 — USER PAGE BASIC WORD GAME에서 사용하는 API ★
=========================================================================== */

// 관리자(ADMIN) 계정이 만든 단어장만 조회
export const fetchAdminWordSetsAPI = () =>
  request("/words/admin-sets", "GET");

/* ========================================================================
    6. FAQ API
=========================================================================== */
export const getFaqs = () => request("/faq");

/* ========================================================================
    7. 1:1 문의(Inquiry)
=========================================================================== */
export const getMyInquiries = () => request("/inquiry");
export const createInquiry = (data) =>
  request("/inquiry", "POST", data);
export const updateInquiry = (id, data) =>
  request(`/inquiry/${id}`, "PUT", data);
export const deleteInquiry = (id) =>
  request(`/inquiry/${id}`, "DELETE");

/* ========================================================================
    8. 공지사항(Notice)
=========================================================================== */
export const getNotices = () => request("/notice");
export const getNoticeById = (id) => request(`/notice/${id}`);
export const createNotice = (data) =>
  request("/notice", "POST", data);
export const updateNotice = (id, data) =>
  request(`/notice/${id}`, "PUT", data);
export const deleteNotice = (id) =>
  request(`/notice/${id}`, "DELETE");

/* ========================================================================
    9. 랭킹
=========================================================================== */
export const getRanking = () => request("/ranking", "GET");
export const getAdminDashboard = () => request("/admin/dashboard");

/* ========================================================================
    10. 관리자 캐릭터 관리
=========================================================================== */
export const fetchCharacterTemplates = () => request("/characters");
export const fetchAdminCharacters = () => request("/admin/characters");
export const createAdminCharacter = (formData) =>
  requestWithFile("/admin/characters", formData);
export const deleteAdminCharacter = (id) =>
  request(`/admin/characters/${id}`, "DELETE");

/* ========================================================================
    11. 관리자 단어게임 API(admin/game)
=========================================================================== */
export const getAdminWordSets = () =>
  request("/admin/game/sets", "GET");

export const createAdminWordSet = (title) =>
  request("/admin/game/sets", "POST", { title });

export const deleteAdminWordSet = (id) =>
  request(`/admin/game/sets/${id}`, "DELETE");

export const getAdminWordsBySet = (setId) =>
  request(`/admin/game/sets/${setId}/words`);

export const addAdminWord = (wordSetId, question, answer) =>
  request("/admin/game/word", "POST", {
    wordSetId,
    question,
    answer,
  });

export const deleteAdminWord = (id) =>
  request(`/admin/game/word/${id}`, "DELETE");

export const updateAdminWord = (id, question, answer) =>
  request(`/admin/game/word/${id}`, "PUT", {
    question,
    answer,
  });

export const uploadAdminWordExcel = (file) => {
  const form = new FormData();
  form.append("wordFile", file);   // backend upload.single("wordFile") 일치
  return requestWithFile("/admin/game/upload", form);
};

export const getAdminWordSetQuiz = (setId) =>
  request(`/words/admin-sets/${setId}`, "GET");

/* ===================== 관리자 공지사항 API ====================== */
export const getAdminNotices = () =>
  request("/admin/notice", "GET");

export const createAdminNotice = (data) =>
  request("/admin/notice", "POST", data);

export const updateAdminNotice = (id, data) =>
  request(`/admin/notice/${id}`, "PUT", data);

export const deleteAdminNotice = (id) =>
  request(`/admin/notice/${id}`, "DELETE");

// 관리자 FAQ
export const getAdminFaqs = () =>
  request("/admin/faq", "GET");

export const createAdminFaq = (question, answer) =>
  request("/admin/faq", "POST", {
    question,
    answer,
  });

export const updateAdminFaq = (id, question, answer) =>
  request(`/admin/faq/${id}`, "PUT", {
    question,
    answer,
  });

export const deleteAdminFaq = (id) =>
  request(`/admin/faq/${id}`, "DELETE");

// ===================== 관리자 1:1 문의 API ======================
export const getAdminInquiries = () =>
  request("/admin/inquiry", "GET");

export const getAdminInquiryById = (id) =>
  request(`/admin/inquiry/${id}`, "GET");

export const answerAdminInquiry = (id, answer) =>
  request(`/admin/inquiry/${id}/answer`, "PUT", { answer });

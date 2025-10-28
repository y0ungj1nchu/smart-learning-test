// src/utils/api.js (새 파일 생성)
const API_BASE_URL = 'http://localhost:3001/api';

// 로컬 스토리지에서 토큰 가져오는 함수
const getToken = () => localStorage.getItem('authToken');

// API 요청 기본 함수
const request = async (endpoint, method = 'GET', body = null) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  const token = getToken();
  if (token) {
    // 토큰이 있으면 Authorization 헤더 추가
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json(); // 응답은 항상 JSON으로 파싱

    if (!response.ok) {
      // 응답 상태가 'ok'가 아니면 백엔드 메시지를 포함한 에러 발생
      throw new Error(data.message || `HTTP 에러! 상태: ${response.status}`);
    }
    return data; // 성공 시 파싱된 데이터 반환
  } catch (error) {
    console.error(`API 호출 실패: ${method} ${endpoint}`, error);
    throw error; // 컴포넌트에서 에러를 처리할 수 있도록 다시 던짐
  }
};

// 특정 API 호출 함수들
export const signupUser = (userData) => request('/auth/signup', 'POST', userData); //
export const loginUser = (credentials) => request('/auth/login', 'POST', credentials); //
export const getCalendarData = (date) => request(`/diaries/date/${date}`);

// 할 일(Todo) API 함수들
export const addTodo = (todoData) => request('/todos', 'POST', todoData);
export const updateTodo = (id, todoData) => request(`/todos/${id}`, 'PUT', todoData);
export const toggleTodo = (id, isCompleted) => request(`/todos/${id}/toggle`, 'PUT', { isCompleted });
export const deleteTodoApi = (id) => request(`/todos/${id}`, 'DELETE');

// 일기(Diary) API 함수들
export const addDiary = (diaryData) => request('/diaries', 'POST', diaryData);
export const updateDiary = (id, diaryData) => request(`/diaries/${id}`, 'PUT', diaryData);
export const deleteDiaryApi = (id) => request(`/diaries/${id}`, 'DELETE');
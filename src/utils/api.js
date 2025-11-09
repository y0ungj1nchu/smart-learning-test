/**
 * 갓생 제조기 - 프론트엔드 API 통신 모듈
 * 백엔드 서버(http://localhost:3001)와 통신을 담당합니다.
 */

// 백엔드 서버 주소
const API_BASE_URL = 'http://localhost:3001/api';

/**
 * 로컬 스토리지에서 인증 토큰을 가져옵니다.
 * @returns {string | null} 저장된 JWT 토큰 또는 null
 */
const getToken = () => {
  return localStorage.getItem('authToken');
};

/**
 * API 요청을 보내는 기본 헬퍼 함수 (JSON 데이터용)
 * @param {string} endpoint - '/api' 이후의 경로 (예: '/auth/login')
 * @param {string} method - 'GET', 'POST', 'PUT', 'DELETE' 등
 * @param {object} body - POST 또는 PUT 요청 시 보낼 JSON 객체
 * @returns {Promise<any>} 서버에서 받은 JSON 응답
 */
const request = async (endpoint, method = 'GET', body = null) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  const token = getToken();
  if (token) {
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
    const data = await response.json();

    if (!response.ok) {
      // 서버가 4xx, 5xx 상태 코드를 반환한 경우
      throw new Error(data.message || `HTTP 에러! 상태: ${response.status}`);
    }
    
    return data; // 성공 시 파싱된 데이터 반환

  } catch (error) {
    console.error(`API 호출 실패: ${method} ${endpoint}`, error);
    // 컴포넌트 레벨에서 에러를 처리(예: alert)할 수 있도록 다시 던짐
    throw error;
  }
};

/**
 * 파일(FormData) 업로드용 헬퍼 함수
 * 'Content-Type'을 'multipart/form-data'로 자동 설정 (JSON.stringify 안 함)
 * @param {string} endpoint - '/api' 이후의 경로
 * @param {FormData} formData - 'wordFile'과 'setTitle'이 포함된 FormData
 * @returns {Promise<any>} 서버에서 받은 JSON 응답
 */
const requestWithFile = async (endpoint, formData) => {
  const headers = {};
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData, // FormData는 stringify하지 않음
    });
    
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `파일 업로드 실패: ${response.status}`);
    }
    
    return data;

  } catch (error) {
    console.error(`파일 업로드 API 호출 실패: ${endpoint}`, error);
    throw error;
  }
};


// ================================================================
// 1. 인증 API (routes/auth.js)
// ================================================================

/**
 * 회원가입을 요청합니다.
 * (참고: 프론트엔드는 'name', 백엔드는 'nickname'을 사용하니 통일 필요)
 * @param {object} userData - { email, password, nickname }
 */
export const signupUser = (userData) => {
    // 프론트엔드(Register.js)의 'name'을 백엔드(auth.js)의 'nickname'으로 맞춰줌
    const dataToSend = {
        email: userData.email,
        password: userData.password,
        nickname: userData.name // 'name'을 'nickname'으로 매핑
    };
    return request('/auth/signup', 'POST', dataToSend);
};

/**
 * 로그인을 요청합니다.
 * (참고: 프론트엔드(Login.js)는 'id', 백엔드는 'email'을 사용하니 통일 필요)
 * @param {object} credentials - { email, password }
 */
export const loginUser = (credentials) => {
    // 프론트엔드(Login.js)의 'id'를 백엔드(auth.js)의 'email'로 맞춰줌
    const dataToSend = {
        email: credentials.id, // 'id'를 'email'로 매핑
        password: credentials.password
    };
    return request('/auth/login', 'POST', dataToSend);
};

// ----------------------------------------------------------------
// (누락된 기능) 아이디/비밀번호 찾기 API (routes/auth.js에 추가 필요)
// ----------------------------------------------------------------
// export const findUserEmail = (email) => request('/auth/find-id', 'POST', { email });
// export const resetUserPassword = (token, newPassword) => request('/auth/reset-password', 'POST', { token, newPassword });


// ================================================================
// 2. 사용자 정보 API (routes/user.js)
// ================================================================

/**
 * 현재 로그인한 사용자의 프로필 정보(닉네임, 레벨, 경험치 등)를 가져옵니다.
 */
export const getMyProfile = () => request('/user/me');

/**
 * 사용자의 닉네임을 변경합니다.
 * @param {string} newNickname - 새 닉네임
 */
export const updateNickname = (newNickname) => request('/user/nickname', 'PUT', { newNickname });

/**
 * 사용자의 "캐릭터 닉네임"을 변경합니다. (Characters.characterName)
 * @param {string} characterName - 새 캐릭터 닉네임
 */
export const updateCharacterName = (characterName) => {
  return request('/user/character/name', 'PUT', { characterName });
};

/**
 * 사용자의 "캐릭터 이미지"를 변경합니다. (Characters.characterImage)
 * @param {string} characterImage - 새 캐릭터 이미지 이름 (예: "snoopy2")
 */
export const updateCharacterImage = (characterImage) => {
  return request('/user/character/image', 'PUT', { characterImage });
};
// ----------------------------

/**
 * 사용자의 비밀번호를 변경합니다.
 * @param {string} currentPassword - 현재 비밀번호
 * @param {string} newPassword - 새 비밀번호
 */
export const updatePassword = (currentPassword, newPassword) => {
  return request('/user/password', 'PUT', { currentPassword, newPassword });
};


// ================================================================
// 3. 캘린더 (일기 + 할 일) API (routes/diary.js, routes/todos.js)
// ================================================================

/**
 * 특정 날짜의 캘린더 데이터 (일기 1개 + 할 일 목록)를 조회합니다.
 * @param {string} date - 'YYYY-MM-DD' 형식의 날짜
 */
export const getCalendarData = (date) => request(`/diaries/date/${date}`);

// --- 할 일 (Todo) ---

/**
 * 새로운 할 일을 추가합니다.
 * @param {object} todoData - { title, dueDate }
 */
export const addTodo = (todoData) => request('/todos', 'POST', todoData);

/**
 * 할 일 내용을 수정합니다. (제목, 마감일)
 * @param {number} id - 수정할 Todo의 ID
 * @param {object} todoData - { title, dueDate }
 */
export const updateTodo = (id, todoData) => request(`/todos/${id}`, 'PUT', todoData);

/**
 * 할 일 완료/미완료 상태를 토글합니다.
 * @param {number} id - 토글할 Todo의 ID
 * @param {boolean} isCompleted - 새 완료 상태 (true/false)
 */
export const toggleTodo = (id, isCompleted) => request(`/todos/${id}/toggle`, 'PUT', { isCompleted });

/**
 * 할 일을 삭제합니다.
 * @param {number} id - 삭제할 Todo의 ID
 */
export const deleteTodoApi = (id) => request(`/todos/${id}`, 'DELETE');

// --- 일기 (Diary) ---

/**
 * 새로운 일기를 작성합니다.
 * @param {object} diaryData - { title, content, diaryDate }
 */
export const addDiary = (diaryData) => request('/diaries', 'POST', diaryData);

/**
 * 일기를 수정합니다.
 * @param {number} id - 수정할 Diary의 ID
 * @param {object} diaryData - { title, content }
 */
export const updateDiary = (id, diaryData) => request(`/diaries/${id}`, 'PUT', diaryData);

/**
 * 일기를 삭제합니다.
 * @param {number} id - 삭제할 Diary의 ID
 */
export const deleteDiaryApi = (id) => request(`/diaries/${id}`, 'DELETE');


// ================================================================
// 4. 순공시간 API (routes/study.js)
// ================================================================

/**
 * 순공시간 측정을 시작합니다.
 * @returns {Promise<{logId: number, message: string}>}
 */
export const startStudySession = () => request('/study/start', 'POST');

/**
 * 순공시간 측정을 종료합니다.
 * @param {number} logId - 'start' 시 발급받은 로그 ID
 */
export const stopStudySession = (logId) => request(`/study/stop/${logId}`, 'PUT');
//  학습 기록 요약 조회
// ----------------------------------------------------------------
/**
오늘 및 이번 주 학습 시간 요약을 가져옵니다.
 */
export const getStudySummary = () => request('/study/summary');

export const getCurrentStudySession = () => request('/study/current');

// ================================================================
// 5. 단어 게임 API (routes/words.js)
// ================================================================

/**
 * CSV 단어장 템플릿 파일을 다운로드합니다. (JSON을 반환하지 않음)
 */
export const downloadWordTemplate = async () => {
    const token = getToken();
    try {
        const response = await fetch(`${API_BASE_URL}/words/template`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error('템플릿 다운로드 실패');
        
        // CSV 파일 다운로드 처리
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'word_template.csv';
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);

    } catch (error) {
         console.error('템플릿 다운로드 API 오류:', error);
         alert(error.message);
    }
};

/**
 * CSV 파일과 제목을 FormData로 업로드하여 단어장을 생성합니다.
 * @param {string} setTitle - 단어장 제목
 * @param {File} file - 업로드할 .csv 파일
 */
export const uploadWordSet = (setTitle, file) => {
    const formData = new FormData();
    formData.append('setTitle', setTitle);
    formData.append('wordFile', file);
    return requestWithFile('/words/upload', formData);
};

/**
 * 사용자가 생성한 모든 단어장 목록을 조회합니다.
 */
export const getWordsets = () => request('/words/wordsets');

/**
 * 특정 단어장에 포함된 모든 단어(문제/정답) 목록을 조회합니다.
 * @param {number} id - 단어장(WordSet)의 ID
 */
export const getWordsForSet = (id) => request(`/words/wordsets/${id}`);


// ----------------------------------------------------------------
//  단어장 삭제 (routes/words.js에 추가 필요)
// ----------------------------------------------------------------
/**
 * 특정 단어장을 삭제합니다.
 * @param {number} id - 삭제할 단어장(WordSet)의 ID
 */
export const deleteWordSet = (id) => request(`/words/wordsets/${id}`, 'DELETE');

// =================================================================
// FAQ API
// =================================================================

/**
 * FAQ 목록을 조회합니다.
 */
export const getFaqs = () => {
  // (참고: request 함수는 기본적으로 /api (proxy)로 요청을 보냅니다)
  return request('/faq', 'GET');
};

// =================================================================
// Inquiry (1:1 문의) API
// =================================================================

/**
 * 내가 작성한 1:1 문의 목록을 조회합니다.
 */
export const getMyInquiries = () => {
  return request('/inquiry', 'GET');
};

/**
 * 새 1:1 문의를 작성합니다.
 * @param {object} data - { title: string, content: string }
 */
export const createInquiry = (data) => {
  return request('/inquiry', 'POST', data);
};

// =================================================================
// 랭킹 API (신규 추가)
// =================================================================

/**
 * 랭킹 목록을 조회합니다. (c.userId, c.level, c.exp, u.nickname)
 */
export const getRanking = () => {
  // 기본 'request' 헬퍼 함수를 사용합니다.
  return request('/ranking', 'GET');
};
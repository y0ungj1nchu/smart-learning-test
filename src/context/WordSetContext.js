import React, { createContext, useContext, useState, useEffect } from "react";

// --- 수정된 부분 (API 임포트) ---
import { getWordsets, deleteWordSet } from "../utils/api"; // deleteWordSet 추가
// ------------------------------

const WordSetContext = createContext();

export function WordSetProvider({ children }) {
  const [userSets, setUserSets] = useState([]);

  // (페이지 로드 시 단어장 목록 불러오기 - 이전 단계에서 수정됨)
  useEffect(() => {
    const loadSets = async () => {
      try {
        const data = await getWordsets();
        setUserSets(data.wordsets || []); 
      } catch (error) {
        console.error("단어장 목록을 불러오는데 실패했습니다:", error);
        setUserSets([]);
      }
    };
    if (localStorage.getItem("authToken")) {
      loadSets();
    }
  }, []);

  // (세트 추가 함수 - 이전 단계에서 수정됨)
  const addUserSet = (customName, wordList) => {
    const newSet = {
      id: Date.now(), // (임시 ID)
      setName: customName,
      wordList,
    };
    setUserSets((prev) => [...prev, newSet]);
  };

  // --- 수정된 부분 (삭제 API 연동) ---
  const deleteUserSet = async (id) => {
    try {
      // 1. API 호출 (DB에서 삭제)
      await deleteWordSet(id);
      
      // 2. API 성공 시 프론트엔드 상태(UI)에서도 삭제
      setUserSets((prev) => prev.filter((s) => s.id !== id));

    } catch (error) {
      console.error("단어장 삭제 실패:", error);
      // 에러를 발생시켜 WordGamePageCustom.js의 모달이 알림을 띄우도록 함
      throw error; 
    }
  };
  // ------------------------------------

  return (
    <WordSetContext.Provider
      value={{
        userSets,
        addUserSet,
        deleteUserSet,
      }}
    >
      {children}
    </WordSetContext.Provider>
  );
}

export function useWordSets() {
  return useContext(WordSetContext);
}
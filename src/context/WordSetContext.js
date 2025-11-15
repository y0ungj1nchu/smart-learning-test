// src/context/WordSetContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { getWordsets, deleteWordSet } from "../utils/api";

const WordSetContext = createContext();

export function WordSetProvider({ children }) {
  const [userSets, setUserSets] = useState([]);

  // 페이지 최초 로드 → 사용자 단어장 불러오기
  useEffect(() => {
    const loadSets = async () => {
      try {
        const data = await getWordsets();
        setUserSets(data.wordsets || []);
      } catch (error) {
        console.error("단어장 목록 불러오기 실패:", error);
      }
    };

    if (localStorage.getItem("authToken")) {
      loadSets();
    }
  }, []);

  // 단어장 추가
  const addUserSet = (id, title) => {
    const newSet = {
      id,
      setName: title,
    };
    setUserSets((prev) => [...prev, newSet]);
  };

  // 단어장 삭제
  const deleteUserSetContext = async (id) => {
    try {
      await deleteWordSet(id); // 백엔드에서 삭제
      setUserSets((prev) => prev.filter((s) => s.id !== id));
    } catch (error) {
      console.error("삭제 실패:", error);
      throw error;
    }
  };

  return (
    <WordSetContext.Provider
      value={{
        userSets,
        addUserSet,
        deleteUserSet: deleteUserSetContext,
      }}
    >
      {children}
    </WordSetContext.Provider>
  );
}

export function useWordSets() {
  return useContext(WordSetContext);
}

import React, { createContext, useContext, useState } from "react";

const WordSetContext = createContext();

export function WordSetProvider({ children }) {
  const [userSets, setUserSets] = useState([]);

  // 세트 추가 시 이름을 받아서 저장
  const addUserSet = (customName, wordList) => {
    const newSet = {
      id: Date.now(),
      setName: customName,
      wordList,
    };
    setUserSets((prev) => [...prev, newSet]);
  };

  const deleteUserSet = (id) => {
    setUserSets((prev) => prev.filter((s) => s.id !== id));
  };

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

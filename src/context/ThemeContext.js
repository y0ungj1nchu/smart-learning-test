import React, { createContext, useState, useEffect, useContext } from "react";
import { getMyProfile, updateThemeColor } from "../utils/api";
import { AuthContext } from "./AuthContext";

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const { user, role, isLoggedIn, authLoaded } = useContext(AuthContext);
  const [themeColor, setThemeColor] = useState("#FFD400");

  // ----------------------------------------------------
  // 1) 로그인 시 HTML에 user-mode / admin-mode 클래스 적용
  // ----------------------------------------------------
  useEffect(() => {
    if (!authLoaded) return;

    const root = document.documentElement;

    if (isLoggedIn) {
      if (role === "ADMIN") {
        root.classList.add("admin-mode");
        root.classList.remove("user-mode");
      } else {
        root.classList.add("user-mode");
        root.classList.remove("admin-mode");
      }
    } else {
      root.classList.remove("user-mode");
      root.classList.remove("admin-mode");
    }
  }, [isLoggedIn, role, authLoaded]);

  // ----------------------------------------------------
  // 2) 사용자 테마 불러오기 → CSS 변수 적용
  // ----------------------------------------------------
  useEffect(() => {
    if (!authLoaded || !isLoggedIn || !user?.themeColor) return;

    const color = user.themeColor;
    setThemeColor(color);

    // 저장 변수
    document.documentElement.style.setProperty("--user-theme-bg", color + "20");
    document.documentElement.style.setProperty("--user-theme-accent", color);

    // 실제 적용 변수
    document.documentElement.style.setProperty("--theme-bg", color + "20");
    document.documentElement.style.setProperty("--theme-accent", color);
  }, [user, authLoaded, isLoggedIn]);

  // ----------------------------------------------------
  // 3) 테마 변경 함수 (DB 반영 + CSS 즉시 반영)
  // ----------------------------------------------------
  const applyTheme = async (color) => {
    setThemeColor(color);

    // 저장 변수
    document.documentElement.style.setProperty("--user-theme-bg", color + "20");
    document.documentElement.style.setProperty("--user-theme-accent", color);

    // UI 즉시 반영
    document.documentElement.style.setProperty("--theme-bg", color + "20");
    document.documentElement.style.setProperty("--theme-accent", color);

    try {
      await updateThemeColor(color);
    } catch (err) {
      console.error("테마 저장 오류:", err);
    }
  };

  return (
    <ThemeContext.Provider value={{ themeColor, applyTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

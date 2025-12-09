import React, { createContext, useState, useEffect, useContext } from "react";
import { updateThemeColor } from "../utils/api";
import { AuthContext } from "./AuthContext";

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const { user, role, isLoggedIn, authLoaded } = useContext(AuthContext);
  const [themeColor, setThemeColor] = useState("#FFD400");

  const root = document.documentElement;

  // ----------------------------------------------------
  // ⭐ 1) 로그인 시 user-mode / admin-mode 클래스 적용
  // ----------------------------------------------------
  useEffect(() => {
    if (!authLoaded) return;

    if (isLoggedIn) {
      if (role === "ADMIN") {
        root.classList.add("admin-mode");
        root.classList.remove("user-mode");
      } else {
        root.classList.add("user-mode");
        root.classList.remove("admin-mode");
      }
    } else {
      // 로그아웃 시 모든 모드 제거
      root.classList.remove("user-mode");
      root.classList.remove("admin-mode");

      // ⭐ CSS 변수 완전 초기화 (footer 잔색 문제 해결 핵심)
      root.style.removeProperty("--theme-bg");
      root.style.removeProperty("--theme-accent");
      root.style.removeProperty("--user-theme-bg");
      root.style.removeProperty("--user-theme-accent");
      root.style.removeProperty("--admin-theme-bg");
      root.style.removeProperty("--admin-theme-accent");
    }
  }, [isLoggedIn, role, authLoaded]);

  // ----------------------------------------------------
  // ⭐ 2) 로그인 후 사용자 테마 적용
  // ----------------------------------------------------
  useEffect(() => {
    if (!authLoaded || !isLoggedIn || !user?.themeColor) return;

    const color = user.themeColor;
    setThemeColor(color);

    // 저장용 변수
    root.style.setProperty("--user-theme-bg", color + "20");
    root.style.setProperty("--user-theme-accent", color);

    // 실제 적용 변수
    root.style.setProperty("--theme-bg", color + "20");
    root.style.setProperty("--theme-accent", color);
  }, [user, authLoaded, isLoggedIn]);

  // ----------------------------------------------------
  // ⭐ 3) 테마 변경 함수 (DB 업데이트 + CSS 반영)
  // ----------------------------------------------------
  const applyTheme = async (color) => {
    setThemeColor(color);

    root.style.setProperty("--user-theme-bg", color + "20");
    root.style.setProperty("--user-theme-accent", color);

    root.style.setProperty("--theme-bg", color + "20");
    root.style.setProperty("--theme-accent", color);

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

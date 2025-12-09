import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(null);
  const [authLoaded, setAuthLoaded] = useState(false);

  const API_BASE = "http://localhost:3001/api";
  const isLoggedIn = !!token;

  const DEFAULT_THEME_COLOR = "#FFD400";

  // -----------------------------------------------------
  // 📌 /me 호출하여 실제 로그인 상태 확인
  // -----------------------------------------------------
  const fetchMe = async (savedToken) => {
    try {
      const res = await fetch(`${API_BASE}/user/me`, {
        method: "GET",
        headers: { Authorization: `Bearer ${savedToken}` },
      });

      if (!res.ok) throw new Error("ME API 실패");

      const data = await res.json();

      const userData = {
        ...data,
        themeColor: data.themeColor || DEFAULT_THEME_COLOR,
      };

      setUser(userData);
      setRole(userData.role?.toUpperCase());

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("role", userData.role?.toUpperCase());
      localStorage.setItem("themeColor", userData.themeColor);
    } catch (err) {
      console.error("❌ /me 에러 → 토큰 무효, 자동 로그아웃", err);
      logout();
    } finally {
      setAuthLoaded(true);
    }
  };

  // -----------------------------------------------------
  // ▣ 새로고침 시 토큰 복원 후 /me 요청
  // -----------------------------------------------------
  useEffect(() => {
    const savedToken = localStorage.getItem("authToken");

    if (savedToken) {
      setToken(savedToken);
      fetchMe(savedToken);
    } else {
      setAuthLoaded(true);
    }
  }, []);

  // -----------------------------------------------------
  // ▣ 로그인
  // -----------------------------------------------------
  const login = (newToken, userInfo) => {
    const userData = {
      ...userInfo,
      themeColor: userInfo.themeColor || DEFAULT_THEME_COLOR,
    };

    setToken(newToken);
    setUser(userData);
    setRole(userData.role?.toUpperCase());

    localStorage.setItem("authToken", newToken);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("role", userData.role?.toUpperCase());
    localStorage.setItem("themeColor", userData.themeColor);
  };

  // -----------------------------------------------------
  // ▣ 로그아웃 (테마 초기화 포함)
  // -----------------------------------------------------
  const logout = async () => {
    try {
      const savedToken = localStorage.getItem("authToken");

      if (savedToken) {
        await fetch(`${API_BASE}/auth/logout`, {
          method: "POST",
          headers: { Authorization: `Bearer ${savedToken}` },
        });
      }
    } catch (e) {
      console.warn("⚠ 로그아웃 API 실패(무시 가능)");
    }

    // 🔥 React 상태 초기화
    setToken(null);
    setUser(null);
    setRole(null);
    setAuthLoaded(true);

    // 🔥 로컬스토리지 초기화
    localStorage.clear();

    // 🔥 ⭐⭐⭐ CSS 테마 초기화 (문제 해결 핵심) ⭐⭐⭐
    const root = document.documentElement;

    root.classList.remove("user-mode");
    root.classList.remove("admin-mode");

    root.style.removeProperty("--theme-bg");
    root.style.removeProperty("--theme-accent");

    root.style.removeProperty("--user-theme-bg");
    root.style.removeProperty("--user-theme-accent");

    root.style.removeProperty("--admin-theme-bg");
    root.style.removeProperty("--admin-theme-accent");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        token,
        isLoggedIn,
        login,
        logout,
        authLoaded,
        fetchMe,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

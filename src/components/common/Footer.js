import React from "react";
import "./Footer.css";
import { useAuth } from "../../context/useAuth";

function Footer() {
  const { isLoggedIn, role } = useAuth();

  let footerClass = "footer footer-default";

  if (isLoggedIn) {
    footerClass =
      role === "ADMIN"
        ? "footer footer-admin"
        : "footer footer-user";
  }

  return (
    <footer className={footerClass}>
      <p>© 2025 갓생제작소 2학기 융합프로젝트</p>
    </footer>
  );
}

export default Footer;

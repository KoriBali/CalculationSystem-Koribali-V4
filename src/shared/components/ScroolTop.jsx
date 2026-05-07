import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // scroll ke atas tiap kali route berubah
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return null; // komponen ini tidak menampilkan apa pun
}

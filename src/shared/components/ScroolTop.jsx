import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { resetScrollDirection } from "../../hooks/useScrollDirection";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // scroll ke atas tiap kali route berubah
    window.scrollTo(0, 0);
    resetScrollDirection();
  }, [pathname]);

  return null; // komponen ini tidak menampilkan apa pun
}

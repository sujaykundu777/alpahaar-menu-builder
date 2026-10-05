"use client";

import Link from "next/link";
import { useApp } from "./AppProvider";

export default function Header() {
  const { data } = useApp();
  const initial = (data.email[0] ?? "A").toUpperCase();
  return (
    <header>
      <div className="header-left">
        <div className="logo">Alpahaar Foods</div>
        <div className="subtitle">Maa Ke Haath Ka Swaad</div>
      </div>
      <div className="header-right">
        <Link href="/settings" className="icon-btn" aria-label="Settings">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <circle cx="12" cy="12" r="3" />
            <path d="M12 1v6m0 6v6m8.66-13l-5.2 3m-2.92 1.68l-5.2 3M23 12h-6m-6 0H5m13.66 8l-5.2-3m-2.92-1.68l-5.2-3" />
          </svg>
        </Link>
        <div className="avatar" title={data.email}>{initial}</div>
      </div>
    </header>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/menu", icon: "📝", label: "Menu Builder" },
  { href: "/preview", icon: "👁️", label: "Preview" },
  { href: "/prices", icon: "💰", label: "Prices" },
  { href: "/settings", icon: "⚙️", label: "Settings" },
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="bottom-nav" aria-label="Main">
      {TABS.map((t) => {
        const active = pathname === t.href;
        return (
          <Link key={t.href} href={t.href} className={`nav-item${active ? " active" : ""}`} aria-current={active ? "page" : undefined}>
            <div className="nav-icon">{t.icon}</div>
            <div className="nav-label">{t.label}</div>
          </Link>
        );
      })}
    </nav>
  );
}

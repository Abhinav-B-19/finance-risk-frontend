"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";

const navItems = [
  {
    label: "Predict",
    href: "/predict",
  },

  {
    label: "History",
    href: "/history",
  },
];

const Navbar = () => {
  const pathname =
    usePathname();

  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link
          href="/predict"
          className="text-xl font-bold tracking-tight"
        >
          FinanceRisk AI
        </Link>

        <nav className="flex items-center gap-2">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-black text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-black"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
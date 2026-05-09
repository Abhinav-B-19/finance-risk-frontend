"use client";

import Link from "next/link";

import {
  usePathname,
  useRouter,
} from "next/navigation";

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

  const router = useRouter();

  const isResultsPage =
    pathname?.startsWith(
      "/results/"
    );

  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
      <div className="relative flex h-16 items-center justify-between px-6">
        
        {/* LEFT SECTION */}
        <div className="flex items-center">
          {isResultsPage && (
            <button
              onClick={() =>
                router.back()
              }
              className="rounded-xl border px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-black"
            >
              ← Back
            </button>
          )}
        </div>

        {/* CENTER LOGO */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <Link
            href="/predict"
            className="text-2xl font-bold tracking-tight"
          >
            FinanceRisk AI
          </Link>
        </div>

        {/* RIGHT NAVIGATION */}
        <nav className="ml-auto flex items-center gap-2">
          {navItems.map((item) => {
            const isActive =
              item.href === "/history"
                ? pathname === "/history" ||
                  pathname.startsWith(
                    "/results/"
                  )
                : pathname === item.href;

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
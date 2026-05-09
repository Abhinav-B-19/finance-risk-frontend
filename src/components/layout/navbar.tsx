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
    <header className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur">
      <div className="mx-auto grid h-16 max-w-screen-2xl grid-cols-3 items-center px-3 sm:px-6 lg:px-8">
        
        {/* LEFT */}
        <div className="flex items-center justify-start">
          {isResultsPage ? (
            <button
              onClick={() =>
                router.back()
              }
              className="rounded-xl border px-3 py-2 text-xs font-medium text-gray-600 transition hover:bg-gray-100 hover:text-black sm:text-sm"
            >
              ← Back
            </button>
          ) : (
            <div className="h-10 w-[72px]" />
          )}
        </div>

        {/* CENTER */}
        <div className="flex justify-center">
          <Link
            href="/predict"
            className="truncate text-center text-lg font-bold tracking-tight sm:text-2xl"
          >
            FinanceRisk AI
          </Link>
        </div>

        {/* RIGHT */}
        <nav className="flex items-center justify-end gap-2">
          {navItems.map((item) => {
            const isActive =
              item.href === "/history"
                ? pathname ===
                    "/history" ||
                  pathname.startsWith(
                    "/results/"
                  )
                : pathname ===
                  item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex h-10 w-[88px] items-center justify-center rounded-xl text-xs font-medium transition sm:text-sm ${
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
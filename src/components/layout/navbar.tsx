"use client";

import Link from "next/link";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  usePathname,
  useRouter,
} from "next/navigation";

import {
  ActiveUserSession,
} from "@/types/prediction";

import {
  clearActiveUser,
  getActiveUser,
  getStoredUsers,
  selectActiveUser,
  USER_SESSION_CHANGED_EVENT,
} from "@/lib/user-session";

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
  const pathname = usePathname();
  const router = useRouter();

  const dropdownRef =
    useRef<HTMLDivElement | null>(null);

  const [storedUsers, setStoredUsers] =
    useState<ActiveUserSession[]>([]);

  const [activeUser, setActiveUser] =
    useState<ActiveUserSession | null>(
      null
    );

  const [isDropdownOpen, setIsDropdownOpen] =
    useState(false);

  const isResultsPage =
    pathname?.startsWith(
      "/results/"
    );

  const shouldShowUserSwitcher =
    pathname === "/predict" ||
    pathname === "/history" ||
    isResultsPage;

  const refreshUsers = () => {
    setStoredUsers(getStoredUsers());
    setActiveUser(getActiveUser());
  };

  useEffect(() => {
    refreshUsers();

    const handleSessionChanged = () => {
      refreshUsers();
    };

    window.addEventListener(
      USER_SESSION_CHANGED_EVENT,
      handleSessionChanged
    );

    return () => {
      window.removeEventListener(
        USER_SESSION_CHANGED_EVENT,
        handleSessionChanged
      );
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (
      event: MouseEvent
    ) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target as Node
        )
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const handleSelectUser = (
    userKey: string
  ) => {
    const selectedUser =
      selectActiveUser(userKey);

    if (!selectedUser) {
      return;
    }

    refreshUsers();
    setIsDropdownOpen(false);
  };

  const handleAddNewUser = () => {
    setIsDropdownOpen(false);

    router.push(
      "/predict?mode=new-user"
    );
  };

  const handleClearCurrentUser = () => {
    const currentUser = getActiveUser();

    if (!currentUser) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to remove ${currentUser.name} (${currentUser.email}) from this device? This will only clear the local cached user, not backend data.`
    );

    if (!confirmed) {
      return;
    }

    clearActiveUser();

    refreshUsers();

    setIsDropdownOpen(false);
  };

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
            href="/"
            className="truncate text-center text-lg font-bold tracking-tight sm:text-2xl"
          >
            FinanceRisk AI
          </Link>
        </div>

        {/* RIGHT */}
        <nav className="flex items-center justify-end gap-2">
          {shouldShowUserSwitcher && (
            <div
              ref={dropdownRef}
              className="relative block"
            >
              <button
                type="button"
                onClick={() =>
                  setIsDropdownOpen(
                    (value) => !value
                  )
                }
                className="flex h-10 max-w-[210px] items-center gap-2 rounded-xl border px-3 text-xs font-medium text-gray-700 transition hover:bg-gray-100"
              >
                <span className="max-w-[105px] truncate">
                  {activeUser
                    ? activeUser.name
                    : "No User"}
                </span>

                <span className="text-gray-400">
                  |
                </span>

                <span>Switch</span>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-[320px] rounded-3xl border bg-white p-4 shadow-xl">
                  <div className="mb-3">
                    <p className="text-sm font-semibold text-gray-950">
                      Switch User
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Select a cached user
                      for this device.
                    </p>
                  </div>

                  {storedUsers.length > 0 ? (
                    <div className="max-h-[260px] space-y-2 overflow-y-auto pr-1">
                      {storedUsers.map(
                        (user) => {
                          const isActive =
                            activeUser?.userKey ===
                            user.userKey;

                          return (
                            <button
                              key={
                                user.userKey
                              }
                              type="button"
                              onClick={() =>
                                handleSelectUser(
                                  user.userKey
                                )
                              }
                              className={`w-full rounded-2xl border p-3 text-left transition ${
                                isActive
                                  ? "border-black bg-gray-100"
                                  : "border-gray-200 hover:bg-gray-50"
                              }`}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <p className="truncate text-sm font-semibold text-gray-950">
                                    {user.name}
                                  </p>

                                  <p className="mt-1 truncate text-xs text-gray-500">
                                    {user.email}
                                  </p>
                                </div>

                                {isActive && (
                                  <span className="rounded-full bg-black px-2 py-1 text-[10px] font-semibold text-white">
                                    Active
                                  </span>
                                )}
                              </div>
                            </button>
                          );
                        }
                      )}
                    </div>
                  ) : (
                    <div className="rounded-2xl bg-gray-50 p-4 text-sm text-gray-500">
                      No cached users found.
                    </div>
                  )}

                  <div className="mt-4 flex gap-2 border-t pt-4">
                    <button
                      type="button"
                      onClick={
                        handleAddNewUser
                      }
                      className="flex-1 rounded-2xl bg-black px-4 py-2 text-xs font-semibold text-white transition hover:bg-gray-800"
                    >
                      Add New User
                    </button>

                    {activeUser && (
                      <button
                        type="button"
                        onClick={
                          handleClearCurrentUser
                        }
                        className="flex-1 rounded-2xl border px-4 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-100"
                      >
                        Clear User
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

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
import { ActiveUserSession } from "@/types/prediction";

const USERS_KEY = "financeRiskUsers";
const ACTIVE_USER_KEY = "financeRiskActiveUserKey";

const OLD_SINGLE_USER_KEY = "financeRiskActiveUser";
const OLD_USER_KEY = "userKey";

export const USER_SESSION_CHANGED_EVENT =
  "financeRiskUserSessionChanged";

const normalizeEmail = (email: string) =>
  email.trim().toLowerCase();

const notifyUserSessionChanged = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(
    new Event(USER_SESSION_CHANGED_EVENT)
  );
};

export const getStoredUsers =
  (): ActiveUserSession[] => {
    if (typeof window === "undefined") {
      return [];
    }

    const stored =
      localStorage.getItem(USERS_KEY);

    if (!stored) {
      return [];
    }

    try {
      const users = JSON.parse(
        stored
      ) as ActiveUserSession[];

      if (!Array.isArray(users)) {
        localStorage.removeItem(
          USERS_KEY
        );

        return [];
      }

      return users;
    } catch {
      localStorage.removeItem(USERS_KEY);

      return [];
    }
  };

export const saveStoredUsers = (
  users: ActiveUserSession[]
): void => {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(
    USERS_KEY,
    JSON.stringify(users)
  );
};

export const getActiveUserKey =
  (): string | null => {
    if (typeof window === "undefined") {
      return null;
    }

    return localStorage.getItem(
      ACTIVE_USER_KEY
    );
  };

export const setActiveUserKey = (
  userKey: string
): void => {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(
    ACTIVE_USER_KEY,
    userKey
  );

  notifyUserSessionChanged();
};

export const getActiveUser =
  (): ActiveUserSession | null => {
    const users = getStoredUsers();
    const activeUserKey =
      getActiveUserKey();

    if (!users.length) {
      return null;
    }

    if (!activeUserKey) {
      return users[0] ?? null;
    }

    return (
      users.find(
        (user) =>
          user.userKey === activeUserKey
      ) ?? users[0] ?? null
    );
  };

export const setActiveUser = (
  user: ActiveUserSession
): void => {
  if (typeof window === "undefined") {
    return;
  }

  const users = getStoredUsers();

  const existingIndex =
    users.findIndex(
      (storedUser) =>
        storedUser.userKey ===
          user.userKey ||
        normalizeEmail(
          storedUser.email
        ) === normalizeEmail(user.email)
    );

  const cleanedUser: ActiveUserSession = {
    userKey: user.userKey,
    name: user.name.trim(),
    email: user.email.trim(),
  };

  if (existingIndex >= 0) {
    users[existingIndex] = cleanedUser;
  } else {
    users.push(cleanedUser);
  }

  saveStoredUsers(users);

  localStorage.setItem(
    ACTIVE_USER_KEY,
    cleanedUser.userKey
  );

  localStorage.removeItem(
    OLD_SINGLE_USER_KEY
  );

  localStorage.removeItem(OLD_USER_KEY);

  notifyUserSessionChanged();
};

export const selectActiveUser = (
  userKey: string
): ActiveUserSession | null => {
  const users = getStoredUsers();

  const selectedUser =
    users.find(
      (user) => user.userKey === userKey
    ) ?? null;

  if (!selectedUser) {
    return null;
  }

  if (typeof window !== "undefined") {
    localStorage.setItem(
      ACTIVE_USER_KEY,
      selectedUser.userKey
    );
  }

  notifyUserSessionChanged();

  return selectedUser;
};

export const clearActiveUser =
  (): ActiveUserSession | null => {
    if (typeof window === "undefined") {
      return null;
    }

    const activeUser = getActiveUser();

    if (!activeUser) {
      localStorage.removeItem(
        ACTIVE_USER_KEY
      );

      notifyUserSessionChanged();

      return null;
    }

    const remainingUsers =
      getStoredUsers().filter(
        (user) =>
          user.userKey !==
          activeUser.userKey
      );

    saveStoredUsers(remainingUsers);

    const nextUser =
      remainingUsers[0] ?? null;

    if (nextUser) {
      localStorage.setItem(
        ACTIVE_USER_KEY,
        nextUser.userKey
      );
    } else {
      localStorage.removeItem(
        ACTIVE_USER_KEY
      );
    }

    localStorage.removeItem(
      OLD_SINGLE_USER_KEY
    );

    localStorage.removeItem(OLD_USER_KEY);

    notifyUserSessionChanged();

    return nextUser;
  };

export const clearAllUsers = (): void => {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(USERS_KEY);
  localStorage.removeItem(ACTIVE_USER_KEY);
  localStorage.removeItem(
    OLD_SINGLE_USER_KEY
  );
  localStorage.removeItem(OLD_USER_KEY);

  notifyUserSessionChanged();
};

export const findUserByEmail = (
  email: string
): ActiveUserSession | null => {
  const users = getStoredUsers();

  return (
    users.find(
      (user) =>
        normalizeEmail(user.email) ===
        normalizeEmail(email)
    ) ?? null
  );
};

export const isSameActiveUser = (
  email: string
): boolean => {
  const activeUser = getActiveUser();

  if (!activeUser) {
    return false;
  }

  return (
    normalizeEmail(activeUser.email) ===
    normalizeEmail(email)
  );
};

export const hasStoredUsers = (): boolean => {
  return getStoredUsers().length > 0;
};
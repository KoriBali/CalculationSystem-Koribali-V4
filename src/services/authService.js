// services/authService.js
import api from "../config/api";
import { getRefreshToken } from "../utils/auth";

// Every gateway response is wrapped as { success, data, message }.
// /login only returns the token pair — no user object — so the caller
// must follow up with getMe() to populate the session's user profile.
export const loginUser = async ({ email, password }) => {
  const { data } = await api.post("/api/identity/login", {
    usernameOrEmail: email,
    password,
  });

  return {
    accessToken: data.data.accessToken,
    refreshToken: data.data.refreshToken,
  };
};

export const logoutUser = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return;

  await api.post("/api/identity/logout", { refreshToken });
};

export const getMe = async () => {
  const { data } = await api.get("/api/identity/me");
  const me = data.data;

  // Layout/ProfileDropdown expect `name`; the gateway returns `fullName`.
  return { ...me, name: me.fullName };
};

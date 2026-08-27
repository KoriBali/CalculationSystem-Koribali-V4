// utils/auth.js
import Cookies from "js-cookie";

const ACCESS_TOKEN_KEY = "auth_access_token";
const REFRESH_TOKEN_KEY = "auth_refresh_token";
const USER_KEY = "auth_user";

const REFRESH_TOKEN_EXPIRES_DAYS = 7; // matches BE's backup token lifetime

const cookieOptions = {
  secure: window.location.protocol === "https:",
  sameSite: "strict",
};

// Save login session — access token is a session cookie (cleared on browser
// close, since it's short-lived and kept fresh by the refresh flow anyway).
// Refresh token persists for REFRESH_TOKEN_EXPIRES_DAYS.
export const setAuthSession = ({ accessToken, refreshToken, user }) => {
  Cookies.set(ACCESS_TOKEN_KEY, accessToken, cookieOptions);
  Cookies.set(REFRESH_TOKEN_KEY, refreshToken, {
    ...cookieOptions,
    expires: REFRESH_TOKEN_EXPIRES_DAYS,
  });
  sessionStorage.setItem(USER_KEY, JSON.stringify(user));
};

// Update just the access (and optionally rotated refresh) token after a
// successful /refresh call, without touching the stored user.
export const setTokens = ({ accessToken, refreshToken }) => {
  Cookies.set(ACCESS_TOKEN_KEY, accessToken, cookieOptions);
  if (refreshToken) {
    Cookies.set(REFRESH_TOKEN_KEY, refreshToken, {
      ...cookieOptions,
      expires: REFRESH_TOKEN_EXPIRES_DAYS,
    });
  }
};

// Update just the stored user profile (e.g. after a getMe() call).
export const setUser = (user) => {
  sessionStorage.setItem(USER_KEY, JSON.stringify(user));
};

// Clear login session
export const clearAuthSession = () => {
  Cookies.remove(ACCESS_TOKEN_KEY);
  Cookies.remove(REFRESH_TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
};

export const getAccessToken = () => Cookies.get(ACCESS_TOKEN_KEY) || null;

export const getRefreshToken = () => Cookies.get(REFRESH_TOKEN_KEY) || null;

// Get logged in user
export const getUser = () => {
  const user = sessionStorage.getItem(USER_KEY);

  return user ? JSON.parse(user) : null;
};

// A refresh token present means there's a session worth trying to keep
// alive, even if the access token has momentarily expired.
export const isAuthenticated = () => {
  return !!getRefreshToken();
};

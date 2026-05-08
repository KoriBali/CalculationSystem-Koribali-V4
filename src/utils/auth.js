// utils/auth.js

export const setAuth = ({ token, user }) => {
  localStorage.setItem("access_token", token);

  localStorage.setItem("user_session", JSON.stringify(user));
};

export const clearAuth = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("user_session");
};

export const getToken = () => {
  return localStorage.getItem("access_token");
};

export const getUser = () => {
  const user = localStorage.getItem("user_session");

  return user ? JSON.parse(user) : null;
};

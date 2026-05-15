// // utils/auth.js

// export const setAuth = ({ token, user }) => {
//   localStorage.setItem("access_token", token);

//   localStorage.setItem("user_session", JSON.stringify(user));
// };

// export const clearAuth = () => {
//   localStorage.removeItem("access_token");
//   localStorage.removeItem("user_session");
// };

// export const getToken = () => {
//   return localStorage.getItem("access_token");
// };

// export const getUser = () => {
//   const user = localStorage.getItem("user_session");

//   return user ? JSON.parse(user) : null;
// };
// utils/auth.js

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

export const setAuthSession = ({ token, user }) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearAuthSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const getUser = () => {
  const user = localStorage.getItem(USER_KEY);

  return user ? JSON.parse(user) : null;
};

export const isAuthenticated = () => {
  return !!getToken();
};

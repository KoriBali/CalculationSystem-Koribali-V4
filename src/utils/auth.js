// // utils/auth.js

// export const setAuth = ({ token, user }) => {
//   sessionStorage.setItem("access_token", token);

//   sessionStorage.setItem("user_session", JSON.stringify(user));
// };

// export const clearAuth = () => {
//   sessionStorage.removeItem("access_token");
//   sessionStorage.removeItem("user_session");
// };

// export const getToken = () => {
//   return sessionStorage.getItem("access_token");
// };

// export const getUser = () => {
//   const user = sessionStorage.getItem("user_session");

//   return user ? JSON.parse(user) : null;
// };
// utils/auth.js

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

// Save login session
export const setAuthSession = ({ token, user }) => {
  sessionStorage.setItem(TOKEN_KEY, token);
  sessionStorage.setItem(USER_KEY, JSON.stringify(user));
};

// Clear login session
export const clearAuthSession = () => {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
};

// Get auth token
export const getToken = () => {
  return sessionStorage.getItem(TOKEN_KEY);
};

// Get logged in user
export const getUser = () => {
  const user = sessionStorage.getItem(USER_KEY);

  return user ? JSON.parse(user) : null;
};

// Check auth status
export const isAuthenticated = () => {
  return !!getToken();
};

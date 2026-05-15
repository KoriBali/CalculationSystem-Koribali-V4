// // hooks/useAuth.js
// import { getToken, getUser } from "../utils/auth";

// export const useAuth = () => {
//   const token = getToken();
//   const user = getUser();

//   return {
//     token,
//     user,
//     isAuthenticated: !!token,
//   };
// };

// hooks/useAuth.js

import { getToken, getUser, isAuthenticated } from "../utils/auth";

export const useAuth = () => {
  return {
    token: getToken(),
    user: getUser(),
    isAuthenticated: isAuthenticated(),
  };
};

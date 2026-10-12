// Where the user last was inside the Requests menu (request list, project
// type, new request form, a calculation …), so the sidebar's Requests link
// takes them back there after visiting another menu. Per browser tab.
const STORAGE_KEY = "requests_last_path";
const REQUESTS_ROOT = "/requests";

export const rememberRequestsPath = (path) => {
  if (!path.startsWith(REQUESTS_ROOT)) return;
  try {
    sessionStorage.setItem(STORAGE_KEY, path);
  } catch {
    // Not remembered — the link falls back to the request list.
  }
};

export const lastRequestsPath = () => {
  try {
    return sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
};

export const forgetRequestsPath = () => {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing to forget.
  }
};

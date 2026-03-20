export const setUser = (user) => {
  return {
    type: "SET_USER",
    payload: user,
  };
};

export const logoutUser = () => {
  return {
    type: "LOGOUT_USER",
  };
};

export const setSettings = (user) => {
  return {
    type: "SET_SETTING",
    payload: user,
  };
};

export const setWebsiteSettings = (user) => {
  return {
    type: "SET_WEBSITE_SETTING",
    payload: user,
  };
};

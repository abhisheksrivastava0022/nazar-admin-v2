import { combineReducers } from "redux";

const userReducer = (state = null, action) => {
  switch (action.type) {
    case "SET_USER":
      return action.payload;
    case "LOGOUT_USER":
      return null;
    default:
      return state;
  }
};

const settingReducer = (state = null, action) => {
  switch (action.type) {
    case "SET_SETTING":
      return action.payload;
    default:
      return state;
  }
};

const websiteSettingReducer = (state = null, action) => {
  switch (action.type) {
    case "SET_WEBSITE_SETTING":
      return action.payload;
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  user: userReducer,
  setting: settingReducer,
  website_setting: websiteSettingReducer,
});

export default rootReducer;

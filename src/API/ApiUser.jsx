import React from "react";
import { useDispatch } from "react-redux";
// import { setSettings, setWebsiteSettings } from "../../action/index";
import ApiClient from "./ApiClient";
import { ExposureTwoTone } from "@mui/icons-material";

const ApiUser = () => {
  const dispatch = useDispatch();
  const { getRequestApi, postRequestApi, patchRequest } = ApiClient();
  const loadUserList = async () => {
    return await getRequestApi("api/user/list", {});
  };
  const userCreate = async (data) => {
    return await postRequestApi("api/user", data);
  };
  const userDetails = async (data) => {
    return await getRequestApi("api/user/" + data, {});
  };
  const userUpdate = async (id, data) => {
    return await patchRequest("api/user/" + id, data);
  };
  const updateMeta = async (data) => {
    return await patchRequest("api/user/meta/", data);
  };

  return { loadUserList, userCreate, userDetails, userUpdate, updateMeta };
};

export default ApiUser;

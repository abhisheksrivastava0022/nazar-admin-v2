// src/utils/apiClient.js
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser } from "../action/index";
const BASE_URL_API = `${import.meta.env.VITE_BASE_URL}/`;
const VITE_APP_BASE_PREFIX = `${import.meta.env.VITE_APP_BASE_PREFIX}`;
const ApiClient = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userCheckApi = async (endpoint, options = {}) => {
    let apiUrl = `${BASE_URL_API}${endpoint}`;
    try {
      const response = await fetch(apiUrl, {
        method: "get",
        headers: {
          // "Content-Type": "application/json",
          //  Authorization: 'Bearer ' + token
        },
        credentials: "include",
      });
      if (response.status != 200) {
        // navigate('/login');
        return;
      }
      // Parse JSON response if the status code is not 401
      const data = await response.json();
      if (data.status) {
        navigate("/");
      }
      return data;
    } catch (error) {
      //navigate('/login');
      console.error("API request error:", error);
      //throw error;
    }
  };
  const userChecklogin = async (endpoint, options = {}) => {
    let apiUrl = `${BASE_URL_API}${endpoint}`;
    try {
      const response = await fetch(apiUrl, {
        method: "get",
        headers: {
          // "Content-Type": "application/json",
          //  Authorization: 'Bearer ' + token
        },
        credentials: "include",
      });
      if (response.status == 401) {
        // navigate("/login");
        window.location.href = `${import.meta.env.VITE_APP_BASE_PREFIX}/login`;

        return;
      }
      // Parse JSON response if the status code is not 401
      const data = await response.json();
      if (!data.status) {
        navigate("/login");
      }
      dispatch(setUser(data.data));

      return data;
    } catch (error) {
      navigate("/login");
      console.error("API request error:", error);
    }
  };
  const getRequestApi = async (endpoint, options = {}) => {
    try {
      const params = new URLSearchParams(options);
      let apiUrl = `${BASE_URL_API}${endpoint}`;
      if (params) {
        apiUrl += `?${params}`;
      }
      const response = await fetch(apiUrl, {
        method: "get",
        headers: {
          // "Content-Type": "application/json",
          //  Authorization: 'Bearer ' + token
        },
        credentials: "include",
      });

      if (response.status == 401) {
        localStorage.removeItem("token");
        navigate("/login"); // Redirect to login page
        return;
      }

      // Parse JSON response if the status code is not 401
      const data = await response.json();
      return data;
    } catch (error) {
      localStorage.removeItem("token");
      console.error("API request error:", error);
      navigate("/login");
      //throw error;
    }
  };
  const ApiUploadFile = async (endpoint, options) => {
    //const formData = new FormData();
    const formData = new FormData();
    formData.append("file", options);

    // options.forEach((file) => {
    //   formData.append("files[]", file); // Adjust name if your backend expects "files"
    // });
    try {
      const response = await fetch(`${BASE_URL_API}${endpoint}`, {
        method: "post",
        headers: {
          //   "Content-Type": "application/json",
          //   A  uthorization: 'Bearer ' + token
        },
        body: formData,
        credentials: "include",
      });

      if (response.status == 401) {
        navigate("/"); // Redirect to login page
        return;
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("API request error:", error);
      throw error;
    }
  };
  const postRequestApi = async (endpoint, options = {}) => {
    //const formData = new FormData();
    const jsondata = JSON.stringify(options);

    try {
      const response = await fetch(`${BASE_URL_API}${endpoint}`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          //   A  uthorization: 'Bearer ' + token
        },
        body: jsondata,
        credentials: "include",
      });

      if (response.status == 401) {
        navigate("/"); // Redirect to login page
        return;
      }

      // Parse JSON response if the status code is not 401
      const data = await response.json();

      return data;
    } catch (error) {
      console.error("API request error:", error);
      // throw error;
    }
  };
  const deleteRequest = async (endpoint, options = {}) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${BASE_URL_API}${endpoint}`, {
        method: "DELETE",
        headers: {
          // "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        credentials: "include",
      });

      if (response.status == 401) {
        localStorage.removeItem("token");
        navigate("/"); // Redirect to login page
        return;
      }

      // Parse JSON response if the status code is not 401
      const data = await response.json();
      return data;
    } catch (error) {
      localStorage.removeItem("token");
      console.error("API request error:", error);
      // throw error;
    }
  };
  const getRequest = async (endpoint, options = {}) => {
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams(options);
      let apiUrl = `${BASE_URL_API}${endpoint}`;
      if (params) {
        apiUrl += `?${params}`;
      }
      const response = await fetch(apiUrl, {
        method: "get",
        headers: {
          // "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        credentials: "include",
      });

      if (response.status == 401) {
        localStorage.removeItem("token");
        navigate("/"); // Redirect to login page
        return;
      }

      // Parse JSON response if the status code is not 401
      const data = await response.json();

      return data;
    } catch (error) {
      console.error("API request error:", error);
      // throw error;
    }
  };
  const postRequest = async (endpoint, options = {}) => {
    const formData = new FormData();
    for (const key in options) {
      let dataassign = options[key];
      if (options[key] == "null" || options[key] == null) {
        dataassign = "";
      }
      formData.append(key, dataassign);
    }
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${BASE_URL_API}${endpoint}`, {
        method: "post",
        headers: {
          // "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: formData,
      });

      if (response.status == 401) {
        navigate("/"); // Redirect to login page
        return;
      }

      // Parse JSON response if the status code is not 401
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("API request error:", error);
      throw error;
    }
  };
  const putRequest = async (endpoint, options = {}) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${BASE_URL_API}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(options),
      });

      if (response.status == 401) {
        navigate("/"); // Redirect to login page
        return;
      }

      // Parse JSON response if the status code is not 401
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("API request error:", error);
      throw error;
    }
  };
  const patchRequest = async (endpoint, options = {}) => {
    //const formData = new FormData();
    const jsondata = JSON.stringify(options);

    try {
      const response = await fetch(`${BASE_URL_API}${endpoint}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          //   A  uthorization: 'Bearer ' + token
        },
        body: jsondata,
        credentials: "include",
      });

      if (response.status == 401) {
        navigate("/"); // Redirect to login page
        return;
      }

      // Parse JSON response if the status code is not 401
      const data = await response.json();

      return data;
    } catch (error) {
      console.error("API request error:", error);
      throw error;
    }
  };

  return {
    ApiUploadFile,
    userChecklogin,
    userCheckApi,
    postRequestApi,
    getRequestApi,
    postRequest,
    getRequest,
    putRequest,
    deleteRequest,
    patchRequest,
  };
};

export default ApiClient;

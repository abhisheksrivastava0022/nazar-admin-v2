// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Link, useNavigate } from "react-router-dom";
// import { setUser } from "../action/index";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiClient from "../API/ApiClient";
import ApiUser from "../API/ApiUser";
import { useSelector } from "react-redux";
const basePath = import.meta.env.VITE_APP_BASE_PREFIX || "/";

const Header = () => {
  // const dispatch = useDispatch();

  // const { getRequestApiwithLogin } = ApiClient();
  // const userData = useSelector((state) => state.user);

  // const token = localStorage.getItem("token");
  // const [showprofile, setShowprofile] = useState(null);
  // const [showFormFor, setShowFormFor] = useState(null);
  // const [
  //   delegate_accredation_admin_access,
  //   setDelegate_accredation_admin_access,
  // ] = useState(null);

  // useEffect(() => {
  //   if (userData?.data) {
  //     const data = userData.data;
  //     if (data.delegate_other_details && data.delegate) {
  //       // navigate('/profile');
  //       setShowprofile("profile");
  //     } else if (data.delegate) {
  //       if (data.delegate_accredation.admin_access) {
  //         setDelegate_accredation_admin_access(true);
  //       }

  //       setShowprofile("profile-delegate");
  //     } else if (data.delegate_other_details) {
  //       const details = data.delegate_other_details.event_edition_form;
  //       setShowFormFor({
  //         url: details.type == 2 ? "delegate-registration" : "delegate-form",
  //         name: `Please complete your ${details.form_name}`,
  //       });
  //     }
  //   }
  // }, [userData]);

  // useEffect(() => {
  //   loadUserData();
  // }, [token]);
  // const loadUserData = async () => {
  //   console.log({ token });
  //   if (token) {
  //     const response = await getRequestApiwithLogin("delegate/profile");

  //     if (response.status) {
  //       dispatch(setUser(response.data));
  //     }
  //   }
  // };

  // const navigate = useNavigate();
  // const hangleLogout = () => {
  //   localStorage.removeItem("token");
  //   navigate("/");
  // };

  const { userChecklogin, getRequestApi } = ApiClient();

  const { updateMeta } = ApiUser();
  const navigate = useNavigate();

  const [workingWebsite, setWorkingWebsite] = useState(
    localStorage.getItem("website_id"),
  );

  const user = useSelector((state) => state.user);
  const HandleChangeWebsite = async (id = 1) => {
    //alert(id)
    // e.preventDefault();
    localStorage.setItem("website_id", id);
    setWorkingWebsite(id);
    await updateMeta({ website_id: id });
    //  navigate("/");
  };
  const preloading = async () => {
    await userChecklogin("api/user", {});
    const checkwebexist = localStorage.getItem("website_id");
    if (!checkwebexist) {
      if (user?.user_meta) {
        console.log(user);
        if (user?.user_meta?.website_id) {
          localStorage.setItem("website_id", user?.user_meta?.website_id);
        }
      }
    }

    localStorage.setItem("language", "en");
  };
  useEffect(() => {
    preloading();
    HandleChangeWebsite();
    return;
  }, [workingWebsite]);

  return (
    <>
      <header className="d-flex align-items-center mt-2 py-2 ">
        <a href="/" className="d-block me-3" aria-label="Home">
          <img
            src={`${basePath}/nazar.png`}
            alt="National Anti-Piracy and Zero-Tolerance Action on Rights Infringement"
            className="img-fluid"
            style={{ maxHeight: "60px" }}
            loading="lazy"
          />
        </a>

        <a
          href="/"
          className="parhari d-block"
          aria-label="Ministry of Information & Broadcasting"
        >
          <img
            src={`${basePath}/mib.png`}
            alt="Ministry of Information & Broadcasting"
            className="img-fluid"
            style={{ maxHeight: "60px" }}
            loading="lazy"
          />
        </a>
      </header>
    </>
  );
};

export default Header;

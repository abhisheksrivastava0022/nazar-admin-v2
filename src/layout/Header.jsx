import { useEffect, useState } from "react";
import ApiClient from "../API/ApiClient";
import ApiUser from "../API/ApiUser";
import { useSelector } from "react-redux";
const basePath = import.meta.env.VITE_APP_BASE_PREFIX || "/";

const Header = () => {
  const { userChecklogin } = ApiClient();

  const { updateMeta } = ApiUser();

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

  return <></>;
};

export default Header;

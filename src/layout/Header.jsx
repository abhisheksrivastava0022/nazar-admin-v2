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

  return (
    <>
      <header className="bg-white shadow-sm rounded-3 px-4 py-2 mb-3 border-bottom border-2 border-primary">
        <div className="d-flex justify-content-between">
          <div className="d-flex align-items-center gap-3 flex-wrap">
            <a href="/" className="d-block me-3" aria-label="Home">
              <img
                src={`${basePath}/nazar.png`}
                alt="National Anti-Piracy and Zero-Tolerance Action on Rights Infringement"
                className="img-fluid"
                style={{ maxHeight: "60px" }}
                loading="lazy"
              />
            </a>
            <div
              className="vr d-none d-sm-block"
              style={{ height: "40px" }}
            ></div>

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
          </div>
          <div className="d-flex align-items-center gap-3 flex-wrap">
            <a
              href="/"
              className="parhari d-block"
              aria-label="Ministry of Information & Broadcasting"
            >
              <img
                src={`${basePath}/images/nfdc.png`}
                // src="/public/images/nfdc.png"
                alt="Ministry of Information & Broadcasting"
                className="img-fluid"
                style={{ maxHeight: "60px" }}
                loading="lazy"
              />
            </a>

            <div
              className="vr d-none d-sm-block"
              style={{ height: "40px" }}
            ></div>

            <a
              href="/"
              className="parhari d-block"
              aria-label="Ministry of Information & Broadcasting"
            >
              <img
                src={`${basePath}/images/i4cpng.png`}
                // src="/public/images/i4cpng.png"
                alt="Ministry of Information & Broadcasting"
                className="img-fluid"
                style={{ maxHeight: "60px" }}
                loading="lazy"
              />
            </a>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;

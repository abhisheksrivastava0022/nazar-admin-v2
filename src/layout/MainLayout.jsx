import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Outlet, useNavigate } from "react-router-dom";
import ApiClient from "../API/ApiClient";
import { useSelector } from "react-redux";
const basePath = import.meta.env.VITE_APP_BASE_PREFIX || "/";

const MainLayout = () => {
  const { getRequestApi } = ApiClient();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  const logoutHandler = async () => {
    try {
      const data = await getRequestApi("api/user/logout");

      if (data?.status) {
        // console.log(data);
        setTimeout(() => navigate("/login"), 1000);
      } else {
        alert(data?.message || "Failed to logout. Please try again.");
      }
    } catch {
      alert("An error occurred. Please try again.");
    }
  };

  const [count, setCount] = useState([]);

  const loadData = async () => {
    try {
      const res = await getRequestApi("api/producer/status-count");

      if (res?.status) {
        setCount(res?.data || []);
      } else {
        setCount([]); // fallback
      }
    } catch (error) {
      console.warn(error);
      setCount([]); // important fallback
    }
  };

  useEffect(() => {
    loadData();
    setCount({ count });
  }, []);

  const getStatusCount = (statusId) => {
    if (!Array.isArray(count)) return 0;

    const item = count.find((i) => Number(i.status) === Number(statusId));

    return item?.count || 0;
  };

  return (
    <>
      <div className="container mb-4">
        <Header />
        <div className="mt-3">
          <div className="card">
            <div className="">
              {/* Main content area */}
              <div className="row">
                <div className="col-md-3 g-0">
                  <div className="menu-header">
                    {/* User Detail's */}
                    <div className="user-detail">
                      <div>
                        <p className="mb-0">
                          <i class="bi bi-person-circle"></i>
                        </p>
                      </div>
                      <div>
                        <p className="mb-0">Welcome</p>
                        <h6>
                          {user?.first_name} {user?.last_name}
                        </h6>
                      </div>
                    </div>
                    {/* Menu List */}
                    <div className="menu-list">
                      <div
                        class="nav flex-column nav-pills "
                        id="v-tabs"
                        role="tablist"
                      >
                        {user?.role?.includes("ministry_level_1") ? (
                          <>
                            <button
                              className={`nav-link ${
                                location.pathname.includes("user-request")
                                  ? "active"
                                  : ""
                              }`}
                              data-bs-toggle="pill"
                              data-bs-target="#tab1"
                              type="button"
                              onClick={() => navigate("/user-request")}
                            >
                              <i class="bi bi-person-lines-fill"></i> User
                              Request
                              <span className="badge bg-secondary ms-2">
                                {getStatusCount(0)}
                              </span>
                            </button>
                          </>
                        ) : (
                          <></>
                        )}

                        {user?.role?.includes("ministry_level_2") ? (
                          <>
                            <button
                              className={`nav-link ${
                                location.pathname.includes("user-request")
                                  ? "active"
                                  : ""
                              }`}
                              data-bs-toggle="pill"
                              data-bs-target="#tab1"
                              type="button"
                              onClick={() => navigate("/user-request")}
                            >
                              <i class="bi bi-person-lines-fill"></i> Dashboard
                            </button>
                            {/* <button
                              class={`nav-link ${location.pathname == "/verified-request" ? "active" : ""}`}
                              data-bs-toggle="pill"
                              data-bs-target="#tab2"
                              type="button"
                              onClick={() => navigate("/verified-request")}
                            >
                              <i class="bi bi-patch-check"></i> Verified Request
                            </button> */}
                          </>
                        ) : (
                          <></>
                        )}

                        <button
                          className={`nav-link ${
                            location.pathname.includes("pending-request")
                              ? "active"
                              : ""
                          }`}
                          type="button"
                          onClick={() => navigate("/pending-request")}
                        >
                          <i className="bi bi-hourglass-split"></i>
                          Pending Required
                          <span className="badge bg-secondary ms-2">
                            {getStatusCount(0)}
                          </span>
                        </button>

                        <button
                          className={`nav-link ${
                            location.pathname.includes("send-request")
                              ? "active"
                              : ""
                          }`}
                          data-bs-toggle="pill"
                          data-bs-target="#tab3"
                          type="button"
                          onClick={() => navigate("/send-request")}
                        >
                          <i className="bi bi-send-check"></i> Sent to Sehyog{" "}
                          <span className="badge bg-secondary ms-2">
                            {getStatusCount(7)}
                          </span>
                        </button>

                        <button
                          className={`nav-link ${
                            location.pathname.includes("clarification-request")
                              ? "active"
                              : ""
                          }`}
                          data-bs-toggle="pill"
                          data-bs-target="#tab1"
                          type="button"
                          onClick={() => navigate("/clarification-request")}
                        >
                          <i className="bi bi-question-circle"></i>
                          Clarification Required
                          <span className="badge bg-secondary ms-2">
                            {getStatusCount(8)}
                          </span>
                        </button>
                        <button
                          className={`nav-link ${
                            location.pathname.includes("information-received")
                              ? "active"
                              : ""
                          }`}
                          data-bs-toggle="pill"
                          data-bs-target="#tab1"
                          type="button"
                          onClick={() => navigate("/information-received")}
                        >
                          <i className="bi bi-info-circle"></i>
                          Information Received
                          <span className="badge bg-secondary ms-2">
                            {getStatusCount(9)}
                          </span>
                        </button>
                        <button
                          className={`nav-link ${
                            location.pathname.includes("resolved")
                              ? "active"
                              : ""
                          }`}
                          data-bs-toggle="pill"
                          data-bs-target="#tab1"
                          type="button"
                          onClick={() => navigate("/resolved")}
                        >
                          <i className="bi bi-check2-circle"></i>
                          Resolved
                          <span className="badge bg-secondary ms-2">
                            {getStatusCount(10)}
                          </span>
                        </button>
                        <button
                          className={`nav-link ${
                            location.pathname.includes("compliance")
                              ? "active"
                              : ""
                          }`}
                          data-bs-toggle="pill"
                          data-bs-target="#tab1"
                          type="button"
                          onClick={() => navigate("/compliance")}
                        >
                          <i className="bi bi-shield-check"></i>
                          Compliance
                          <span className="badge bg-secondary ms-2">
                            {getStatusCount(6)}
                          </span>
                        </button>
                        <button
                          className={`nav-link ${
                            location.pathname.includes("rejected")
                              ? "active"
                              : ""
                          }`}
                          data-bs-toggle="pill"
                          data-bs-target="#tab1"
                          type="button"
                          onClick={() => navigate("/rejected")}
                        >
                          <i className="bi bi-x-circle"></i>
                          Rejected
                          <span className="badge bg-secondary ms-2">
                            {getStatusCount(4)}
                          </span>
                        </button>

                        {/* <button
                          class={`nav-link ${location.pathname == "/approved-request" ? "active" : ""}`}
                          data-bs-toggle="pill"
                          data-bs-target="#tab3"
                          type="button"
                          onClick={() => navigate("/approved-request")}
                        >
                          <i class="bi bi-check-circle"></i> Approved Request
                        </button> */}

                        <button
                          className={`nav-link ${
                            location.pathname.includes("producer")
                              ? "active"
                              : ""
                          }`}
                          data-bs-toggle="pill"
                          data-bs-target="#tab4"
                          type="button"
                          onClick={() => navigate("/producer")}
                        >
                          <i class="bi bi-people"></i> Producer
                        </button>

                        <button
                          className={`nav-link ${
                            location.pathname.includes("intermediary")
                              ? "active"
                              : ""
                          }`}
                          data-bs-toggle="pill"
                          data-bs-target="#tab5"
                          type="button"
                          onClick={() => navigate("/intermediary")}
                        >
                          <i class="bi bi-cassette"></i> Intermediary
                        </button>
                        {user?.role?.includes("administrator") ? (
                          <button
                            className={`nav-link ${
                              location.pathname.includes("user") ? "active" : ""
                            }`}
                            data-bs-toggle="pill"
                            data-bs-target="#tab6"
                            type="button"
                            onClick={() => navigate("/user")}
                          >
                            <i class="bi bi-person"></i> User
                          </button>
                        ) : (
                          <></>
                        )}

                        {/* Log Out Btn */}
                        <button
                          class={`nav-link logout-btn`}
                          data-bs-toggle="pill"
                          data-bs-target="#tab6"
                          type="button"
                          onClick={logoutHandler}
                        >
                          <i class="bi bi-box-arrow-right"></i> Logout
                        </button>
                      </div>
                    </div>
                    <div className="menu-image">
                      <img
                        src={`${basePath}/images/menu-img.png`}
                        alt=""
                        className="img-fluid"
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-9 g-0">
                  {/* Calling Component By using Outlet */}
                  <Outlet />
                </div>
              </div>
            </div>
            <div className="card-footer">
              {/* Footer actions or information */}
              <Footer />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MainLayout;

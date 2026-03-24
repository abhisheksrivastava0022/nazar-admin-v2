import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Outlet, useNavigate } from "react-router-dom";
import ApiClient from "../API/ApiClient";

const MainLayout = () => {
  const { getRequestApi } = ApiClient();
  const navigate = useNavigate();

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
                        <h6>Digital Team</h6>
                      </div>
                    </div>
                    {/* Menu List */}
                    <div className="menu-list">
                      <div
                        class="nav flex-column nav-pills "
                        id="v-tabs"
                        role="tablist"
                      >
                        <button
                          class={`nav-link ${location.pathname == "/user-request" ? "active" : ""}`}
                          data-bs-toggle="pill"
                          data-bs-target="#tab2"
                          type="button"
                          onClick={() => navigate("/user-request")}
                        >
                          <i class="bi bi-people"></i> User Request
                        </button>
                        <button
                          class={`nav-link ${location.pathname == "/user-request" ? "active" : ""}`}
                          data-bs-toggle="pill"
                          data-bs-target="#tab2"
                          type="button"
                          onClick={() => navigate("/approved-request")}
                        >
                          <i class="bi bi-people"></i> Approved Request
                        </button>
                        <button
                          class={`nav-link ${location.pathname == "/user-request" ? "active" : ""}`}
                          data-bs-toggle="pill"
                          data-bs-target="#tab2"
                          type="button"
                          onClick={() => navigate("/completed-request")}
                        >
                          <i class="bi bi-people"></i> Completed Request
                        </button>
                        <button
                          class={`nav-link ${location.pathname == "/producer" ? "active" : ""}`}
                          data-bs-toggle="pill"
                          data-bs-target="#tab2"
                          type="button"
                          onClick={() => navigate("/producer")}
                        >
                          <i class="bi bi-people"></i> Producer
                        </button>

                        <button
                          class={`nav-link ${location.pathname == "/user" ? "active" : ""}`}
                          data-bs-toggle="pill"
                          data-bs-target="#tab2"
                          type="button"
                          onClick={() => navigate("/user")}
                        >
                          <i class="bi bi-people"></i> User
                        </button>

                        {/* Log Out Btn */}
                        <button
                          class={`nav-link logout-btn`}
                          data-bs-toggle="pill"
                          data-bs-target="#tab4"
                          type="button"
                          onClick={logoutHandler}
                        >
                          <i class="bi bi-box-arrow-right"></i> Logout
                        </button>
                      </div>
                    </div>
                    <div className="menu-image">
                      <img
                        src="/images/menu-img.png"
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

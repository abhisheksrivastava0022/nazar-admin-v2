import { useCallback, useEffect, useMemo, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import Header from "./Header copy";
import Footer from "./Footer";
import ApiClient from "../API/ApiClient";

const MENU_ITEMS = [
  {
    path: "/",
    label: "Dashboard",
    icon: "bi bi-speedometer2",
    color: "primary",
    role: "all",
    statusId: null,
  },
  {
    path: "/user-request",
    label: "User Request",
    icon: "bi bi-person-lines-fill",
    color: "primary",
    role: "all",
    statusId: 0,
  },
  {
    path: "/intermediary",
    label: "Intermediary",
    icon: "bi bi-cassette",
    color: "primary",
    role: "all",
    statusId: null,
  },
  {
    path: "/producer",
    label: "Producer",
    icon: "bi bi-person",
    color: "primary",
    role: "all",
    statusId: null,
  },
  {
    path: "/user",
    label: "User",
    icon: "bi bi-person",
    color: "primary",
    role: "administrator",
    statusId: null,
  },
];

const MainLayout = () => {
  const { getRequestApi } = ApiClient();

  const navigate = useNavigate();

  const user = useSelector((state) => state.user);

  const [statusCounts, setStatusCounts] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [loggingOut, setLoggingOut] = useState(false);

  // ----------------------------------------
  // User Role
  // ----------------------------------------
  const userRole = useMemo(() => {
    return (
      user?.role ||
      user?.role_name ||
      user?.user_type ||
      user?.type ||
      ""
    )
      ?.toString()
      ?.toLowerCase();
  }, [user]);

  // ----------------------------------------
  // Load Status Counts
  // ----------------------------------------
  const loadStatusCounts = useCallback(async () => {
    try {
      const response = await getRequestApi("api/producer/status-count");

      if (response?.status && Array.isArray(response?.data)) {
        setStatusCounts(response.data);
      } else {
        setStatusCounts([]);
      }
    } catch (error) {
      console.error("Failed to load status counts:", error);
      setStatusCounts([]);
    }
  }, [getRequestApi]);

  // ----------------------------------------
  // Load Data
  // ----------------------------------------
  useEffect(() => {
    loadStatusCounts();
  }, [refresh]);

  // ----------------------------------------
  // Get Status Count
  // ----------------------------------------
  const getStatusCount = useCallback(
    (statusId) => {
      if (statusId === null || statusId === undefined) {
        return null;
      }

      const item = statusCounts.find(
        (item) => Number(item?.status) === Number(statusId),
      );

      return Number(item?.count || 0);
    },
    [statusCounts],
  );

  // ----------------------------------------
  // Check Menu Permission
  // ----------------------------------------
  const canShowMenu = useCallback(
    (item) => {
      if (!item?.role || item.role === "all") {
        return true;
      }

      return userRole === item.role.toLowerCase();
    },
    [userRole],
  );

  // ----------------------------------------
  // Visible Menu
  // ----------------------------------------
  const visibleMenuItems = useMemo(() => {
    return MENU_ITEMS.filter(canShowMenu);
  }, [canShowMenu]);

  // ----------------------------------------
  // Logout
  // ----------------------------------------
  const logoutHandler = async () => {
    if (loggingOut) return;

    try {
      setLoggingOut(true);

      const response = await getRequestApi("api/user/logout");

      if (response?.status) {
        navigate("/login", { replace: true });
        return;
      }

      alert(response?.message || "Failed to logout. Please try again.");
    } catch (error) {
      console.error("Logout error:", error);

      alert("An error occurred while logging out.");
    } finally {
      setLoggingOut(false);
    }
  };

  // ----------------------------------------
  // User Name
  // ----------------------------------------
  const fullName =
    [user?.first_name, user?.last_name].filter(Boolean).join(" ") || "User";

  // ----------------------------------------
  // Initial
  // ----------------------------------------
  const userInitial =
    user?.first_name?.charAt(0)?.toUpperCase() ||
    user?.last_name?.charAt(0)?.toUpperCase() ||
    "U";

  return (
    <>
      <div className="container-fluid mb-4">
        {/* ================= HEADER ================= */}
        <Header />

        <div className="mt-3">
          <div className="row g-3">
            {/* ================= SIDEBAR ================= */}
            <div className="col-12 col-lg-3">
              <aside className="bg-white rounded-3 shadow-sm h-100">
                <div className="p-3 p-lg-4">
                  {/* ================= USER PROFILE ================= */}
                  <div className="d-flex align-items-center gap-3 pb-4 mb-3 border-bottom">
                    <div className="flex-shrink-0">
                      <div
                        className="avatar-gradient rounded-3 d-flex align-items-center justify-content-center text-white shadow-sm fw-bold"
                        style={{
                          width: "56px",
                          height: "56px",
                          fontSize: "20px",
                        }}
                      >
                        {userInitial}
                      </div>
                    </div>

                    <div className="flex-grow-1" style={{ minWidth: 0 }}>
                      <div className="text-uppercase text-muted small fw-semibold">
                        Welcome
                      </div>

                      <h6
                        className="fw-bold text-dark mb-1 text-truncate"
                        title={fullName}
                      >
                        {fullName}
                      </h6>

                      <span className="badge bg-success-subtle text-success rounded-pill px-3 py-1">
                        <span className="badge-dot bg-success"></span>
                        Active
                      </span>
                    </div>
                  </div>

                  {/* ================= NAVIGATION ================= */}
                  <nav className="nav flex-column gap-1">
                    {visibleMenuItems.map((item, index) => {
                      const count = getStatusCount(item.statusId);

                      return (
                        <NavLink
                          key={`${item.path}-${item.label}-${index}`}
                          to={item.path}
                          end={item.path === "/user-request"}
                          className={({ isActive }) =>
                            `menu-btn nav-link d-flex align-items-center gap-3 px-3 py-2 rounded-3 border-0 ${
                              isActive
                                ? "active-nav text-dark"
                                : "text-secondary hover-nav"
                            }`
                          }
                        >
                          {({ isActive }) => (
                            <>
                              {/* ICON */}
                              <div
                                className={`icon-wrapper d-flex align-items-center justify-content-center rounded-2 flex-shrink-0 ${
                                  isActive
                                    ? `bg-${item.color} text-white shadow-sm`
                                    : "bg-light text-secondary"
                                }`}
                                style={{
                                  width: "38px",
                                  height: "38px",
                                }}
                              >
                                <i className={`${item.icon} fs-5`}></i>
                              </div>

                              {/* LABEL */}
                              <span className="fw-medium flex-grow-1">
                                {item.label}
                              </span>

                              {/* COUNT */}
                              {count !== null && count > 0 && (
                                <span className="badge bg-primary rounded-pill">
                                  {count}
                                </span>
                              )}

                              {/* ACTIVE INDICATOR */}
                              {isActive && (
                                <span
                                  className="active-indicator bg-primary rounded-pill"
                                  aria-hidden="true"
                                ></span>
                              )}
                            </>
                          )}
                        </NavLink>
                      );
                    })}

                    {/* ================= LOGOUT ================= */}
                    <div className="border-top mt-3 pt-3">
                      <button
                        type="button"
                        onClick={logoutHandler}
                        disabled={loggingOut}
                        className="nav-link d-flex align-items-center gap-3 px-3 py-2 rounded-3 text-danger hover-danger border-0 w-100 text-start"
                      >
                        <div
                          className="icon-wrapper d-flex align-items-center justify-content-center rounded-2 bg-danger-subtle text-danger flex-shrink-0"
                          style={{
                            width: "38px",
                            height: "38px",
                          }}
                        >
                          {loggingOut ? (
                            <span
                              className="spinner-border spinner-border-sm"
                              role="status"
                            ></span>
                          ) : (
                            <i className="bi bi-box-arrow-right fs-5"></i>
                          )}
                        </div>

                        <span className="fw-medium">
                          {loggingOut ? "Logging out..." : "Logout"}
                        </span>
                      </button>
                    </div>
                  </nav>
                </div>
              </aside>
            </div>

            {/* ================= MAIN CONTENT ================= */}
            <div className="col-12 col-lg-9">
              <main className="bg-white rounded-3 shadow-sm">
                <Outlet
                  context={{
                    setRefresh: () => setRefresh((prev) => prev + 1),
                    refresh,
                    reloadStatusCounts: loadStatusCounts,
                  }}
                />
              </main>
            </div>
          </div>

          {/* ================= FOOTER ================= */}
          <div className="mt-4">
            <Footer />
          </div>
        </div>

        {/* ================= CUSTOM CSS ================= */}
        <style>{`
          .avatar-gradient {
            background: linear-gradient(
              135deg,
              #0d6efd 0%,
              #6f42c1 100%
            );
          }

          .bg-primary-subtle {
            background-color: rgba(13, 110, 253, 0.08) !important;
          }

          .bg-success-subtle {
            background-color: rgba(25, 135, 84, 0.08) !important;
          }

          .bg-danger-subtle {
            background-color: rgba(220, 53, 69, 0.08) !important;
          }

          .menu-btn {
            position: relative;
            transition:
              background-color 0.2s ease,
              color 0.2s ease,
              transform 0.2s ease;
          }

          .menu-btn:hover {
            transform: translateX(2px);
          }

          .hover-nav:hover {
            background-color: rgba(13, 110, 253, 0.05);
            color: #212529 !important;
          }

          .active-nav {
            background-color: rgba(13, 110, 253, 0.08);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
          }

          .hover-danger:hover {
            background-color: rgba(220, 53, 69, 0.08);
          }

          .active-indicator {
            width: 4px;
            height: 22px;
            flex-shrink: 0;
          }

          .badge-dot {
            display: inline-block;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            margin-right: 5px;
            vertical-align: middle;
          }

          @media (max-width: 991.98px) {
            .menu-btn {
              padding-top: 10px !important;
              padding-bottom: 10px !important;
            }
          }
        `}</style>
      </div>
    </>
  );
};

export default MainLayout;

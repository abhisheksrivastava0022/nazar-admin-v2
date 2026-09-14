import { useCallback, useEffect, useMemo, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import Header from "./Header";
import Footer from "./Footer";
import ApiClient from "../API/ApiClient";
const basePath = import.meta.env.VITE_APP_BASE_PREFIX || "/";

const MENU_ITEMS = [
  {
    path: "/",
    label: "Overview",
    icon: "bi bi-grid-1x2-fill",
    color: "#0877F3",
    role: "all",
    statusId: null,
  },
  {
    path: "/complants",
    label: "Complaints",
    icon: "bi bi-chat-square-text",
    color: "#7C3AED",
    role: "all",
    statusId: null,
  },
  {
    path: "/more-clarification",
    label: "More Clarification",
    icon: "bi bi-question-circle",
    color: "#F59E0B",
    role: "all",
    statusId: null,
  },
  {
    path: "/films",
    label: "Films",
    icon: "bi bi-camera-reels",
    color: "#0877F3",
    role: "all",
    statusId: null,
  },
  {
    path: "/user-request",
    label: "Requests",
    icon: "bi bi-send-plus",
    color: "#7C3AED",
    role: "all",
    statusId: 0,
  },
  {
    path: "/intermediary",
    label: "Intermediaries",
    icon: "bi bi-diagram-3",
    color: "#059669",
    role: "all",
    statusId: null,
  },
  {
    path: "/producer",
    label: "Producers",
    icon: "bi bi-briefcase-fill",
    color: "#D97706",
    role: "all",
    statusId: null,
  },
  {
    path: "/user",
    label: "Users",
    icon: "bi bi-people-fill",
    color: "#DC2626",
    role: "administrator",
    statusId: null,
  },
];

// Sample notifications data - You can replace this with API data
const SAMPLE_NOTIFICATIONS = [
  {
    id: 1,
    title: "New user request received",
    message: "John Doe has submitted a new request for content access",
    time: "2 minutes ago",
    type: "request",
    read: false,
    icon: "bi bi-person-plus",
    color: "#7C3AED",
  },
  {
    id: 2,
    title: "Producer application approved",
    message: "Producer ABC Corp has been approved for content distribution",
    time: "15 minutes ago",
    type: "producer",
    read: false,
    icon: "bi bi-check-circle",
    color: "#059669",
  },
  {
    id: 3,
    title: "System update completed",
    message: "Platform has been updated to version 2.4.1 with new features",
    time: "1 hour ago",
    type: "system",
    read: true,
    icon: "bi bi-gear",
    color: "#0877F3",
  },
  {
    id: 4,
    title: "Payment processing",
    message: "Monthly subscription payment for 5 users is being processed",
    time: "3 hours ago",
    type: "payment",
    read: true,
    icon: "bi bi-credit-card",
    color: "#D97706",
  },
  {
    id: 5,
    title: "New intermediary registered",
    message: "TechSolutions Inc has registered as an intermediary",
    time: "5 hours ago",
    type: "intermediary",
    read: true,
    icon: "bi bi-building",
    color: "#059669",
  },
];

const MainLayout = () => {
  const { getRequestApi } = ApiClient();

  const navigate = useNavigate();
  const location = useLocation();

  const user = useSelector((state) => state.user);

  const [statusCounts, setStatusCounts] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [loggingOut, setLoggingOut] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] =
    useState(false);
  const [notifications, setNotifications] = useState(SAMPLE_NOTIFICATIONS);

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

  // ----------------------------------------
  // Current Time
  // ----------------------------------------
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  // ----------------------------------------
  // Notification Handlers
  // ----------------------------------------
  const unreadCount = notifications.filter((n) => !n.read).length;

  const toggleNotificationDrawer = () => {
    setIsNotificationDrawerOpen(!isNotificationDrawerOpen);
    // Close mobile menu if open
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const getTimeAgo = (time) => {
    return time;
  };

  return (
    <>
      <div className="MainLayout">
        <div className="logo-header">
          <div className="logo-icon">
            <a href="/" className="d-block me-3" aria-label="Home">
              <img
                // src={`${basePath}/images/nazar-white.png`}
                src={`${basePath}/nazar.png`}
                alt="National Anti-Piracy and Zero-Tolerance Action on Rights Infringement"
                className="img-fluid"
                style={{ maxHeight: "50px" }}
                loading="lazy"
              />
            </a>
            <a href="/" className="d-block me-3" aria-label="Home">
              <img
                src={`${basePath}/mib.png`}
                alt="National Anti-Piracy and Zero-Tolerance Action on Rights Infringement"
                className="img-fluid"
                style={{ maxHeight: "50px" }}
                loading="lazy"
              />
            </a>
          </div>

          <div className="page-actions">
            <button
              className="btn-notification"
              onClick={toggleNotificationDrawer}
            >
              <i className="bi bi-bell"></i>
              {unreadCount > 0 && (
                <span className="notification-dot">{unreadCount}</span>
              )}
            </button>
          </div>
        </div>
        <div className="app-container">
          {/* ============================================ */}
          {/* MOBILE OVERLAY */}
          {/* ============================================ */}
          {isMobileMenuOpen && (
            <div
              className="mobile-overlay"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}

          {/* ============================================ */}
          {/* SIDEBAR */}
          {/* ============================================ */}
          <aside
            className={`sidebar ${isMobileMenuOpen ? "sidebar-open" : ""}`}
          >
            <div className="sidebar-inner">
              {/* Logo */}
              {/* <div className="sidebar-logo">
              <div className="logo-icon">
                <a href="/" className="d-block me-3" aria-label="Home">
                  <img
                    src={`${basePath}/nazar.png`}
                    alt="National Anti-Piracy and Zero-Tolerance Action on Rights Infringement"
                    className="img-fluid"
                    style={{ maxHeight: "60px" }}
                    loading="lazy"
                  />
                </a>
              </div>
            </div> */}

              {/* User Profile */}
              <div className="sidebar-user">
                <div className="user-avatar">
                  {userInitial}
                  <span className="online-dot"></span>
                </div>
                <div className="user-info">
                  <div className="user-name">{fullName}</div>
                  <div className="user-role">Administrator</div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="sidebar-nav">
                <div className="nav-label">Main Menu</div>
                {visibleMenuItems.map((item, index) => {
                  const count = getStatusCount(item.statusId);
                  const isActive = location.pathname === item.path;

                  return (
                    <NavLink
                      key={`${item.path}-${item.label}-${index}`}
                      to={item.path}
                      end={item.path === "/user-request"}
                      className={`nav-item ${isActive ? "active" : ""}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="nav-item-inner">
                        <div
                          className="nav-icon"
                          style={{ color: isActive ? item.color : "#94A3B8" }}
                        >
                          <i className={`${item.icon}`}></i>
                        </div>
                        <span className="nav-label-text">{item.label}</span>
                        {count !== null && count > 0 && (
                          <span className="nav-badge">{count}</span>
                        )}
                        {isActive && <span className="nav-active-bar"></span>}
                      </div>
                    </NavLink>
                  );
                })}
              </nav>

              {/* Logout */}
              <div className="sidebar-footer">
                <button
                  type="button"
                  onClick={logoutHandler}
                  disabled={loggingOut}
                  className="logout-btn"
                >
                  <i
                    className={`bi ${loggingOut ? "bi-arrow-repeat spin" : "bi-box-arrow-right"}`}
                  ></i>
                  <span>{loggingOut ? "Logging out..." : "Logout"}</span>
                </button>
              </div>
            </div>
          </aside>

          {/* ============================================ */}
          {/* MAIN CONTENT */}
          {/* ============================================ */}
          <main className="main-content">
            {/* Header */}
            <Header />

            {/* Page Content */}
            <div className="page-content">
              {/* Greeting Section */}
              {/* <div className="page-header">
              <div>
                <h1 className="page-title">
                  {getGreeting()}, {fullName.split(" ")[0]} 👋
                </h1>
                <p className="page-subtitle">
                  Here's what's happening with your business today
                </p>
              </div>
              <div className="page-actions">
                <button
                  className="btn-notification"
                  onClick={toggleNotificationDrawer}
                >
                  <i className="bi bi-bell"></i>
                  {unreadCount > 0 && (
                    <span className="notification-dot">{unreadCount}</span>
                  )}
                </button>
              </div>
            </div> */}

              {/* Outlet */}
              {/* <div className="content-area"> */}
              <div className="">
                <Outlet
                  context={{
                    setRefresh: () => setRefresh((prev) => prev + 1),
                    refresh,
                    reloadStatusCounts: loadStatusCounts,
                  }}
                />
              </div>

              {/* Footer */}
              <Footer />
            </div>
          </main>

          {/* ============================================ */}
          {/* NOTIFICATION DRAWER */}
          {/* ============================================ */}
          <>
            {/* Overlay */}
            {isNotificationDrawerOpen && (
              <div
                className="drawer-overlay"
                onClick={toggleNotificationDrawer}
              />
            )}

            {/* Drawer */}
            <div
              className={`notification-drawer ${isNotificationDrawerOpen ? "drawer-open" : ""}`}
            >
              <div className="drawer-header">
                <div className="drawer-title-wrapper">
                  <h3 className="drawer-title">
                    <i className="bi bi-bell-fill"></i>
                    Notifications
                  </h3>
                  {unreadCount > 0 && (
                    <span className="drawer-badge">{unreadCount} new</span>
                  )}
                </div>
                <div className="drawer-actions">
                  {unreadCount > 0 && (
                    <button
                      className="drawer-action-btn mark-read-btn"
                      onClick={markAllAsRead}
                    >
                      <i className="bi bi-check2-all"></i>
                      Mark all read
                    </button>
                  )}
                  <button
                    className="drawer-close-btn"
                    onClick={toggleNotificationDrawer}
                  >
                    <i className="bi bi-x-lg"></i>
                  </button>
                </div>
              </div>

              <div className="drawer-body">
                {notifications.length === 0 ? (
                  <div className="empty-state">
                    <i className="bi bi-bell-slash"></i>
                    <p>No notifications</p>
                    <span>You're all caught up!</span>
                  </div>
                ) : (
                  <div className="notification-list">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`notification-item ${!notification.read ? "unread" : ""}`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div
                          className="notification-icon"
                          style={{
                            background: `${notification.color}15`,
                            color: notification.color,
                          }}
                        >
                          <i className={notification.icon}></i>
                        </div>
                        <div className="notification-content">
                          <div className="notification-header">
                            <h4 className="notification-title">
                              {notification.title}
                            </h4>
                            {!notification.read && (
                              <span className="unread-dot"></span>
                            )}
                          </div>
                          <p className="notification-message">
                            {notification.message}
                          </p>
                          <span className="notification-time">
                            <i className="bi bi-clock"></i>
                            {notification.time}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>

          {/* ============================================ */}
          {/* MOBILE MENU TOGGLE */}
          {/* ============================================ */}
          <button
            className="mobile-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <i className={`bi ${isMobileMenuOpen ? "bi-x-lg" : "bi-list"}`}></i>
          </button>

          {/* ============================================ */}
          {/* STYLES */}
          {/* ============================================ */}
        </div>
      </div>
    </>
  );
};

export default MainLayout;

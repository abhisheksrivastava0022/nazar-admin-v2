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
    icon: "bi bi-house-door",
    color: "#4F46E5",
    role: "all",
    statusId: null,
  },
  {
    path: "/complants",
    label: "complants",
    icon: "bi bi-inbox",
    color: "#4F46E5",
    role: "all",
    statusId: null,
  },
  {
    path: "/films",
    label: "Films",
    icon: "bi bi-inbox",
    color: "#4F46E5",
    role: "all",
    statusId: null,
  },
  {
    path: "/user-request",
    label: "Requests",
    icon: "bi bi-inbox",
    color: "#7C3AED",
    role: "all",
    statusId: 0,
  },
  {
    path: "/intermediary",
    label: "Intermediaries",
    icon: "bi bi-shuffle",
    color: "#059669",
    role: "all",
    statusId: null,
  },
  {
    path: "/producer",
    label: "Producers",
    icon: "bi bi-briefcase",
    color: "#D97706",
    role: "all",
    statusId: null,
  },
  {
    path: "/user",
    label: "Users",
    icon: "bi bi-people",
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
    color: "#4F46E5",
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
        <aside className={`sidebar ${isMobileMenuOpen ? "sidebar-open" : ""}`}>
          <div className="sidebar-inner">
            {/* Logo */}
            <div className="sidebar-logo">
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
            </div>

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
            <div className="page-header">
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
            </div>

            {/* Outlet */}
            <div className="content-area">
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
        <style>{`
          /* ===== Reset & Base ===== */
          * {
            box-sizing: border-box;
          }

          .app-container {
            display: flex;
            min-height: 100vh;
            background: #F8FAFC;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }

          /* ===== Sidebar ===== */
          .sidebar {
            width: 280px;
            background: #FFFFFF;
            border-right: 1px solid #E2E8F0;
            display: flex;
            flex-direction: column;
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            z-index: 1000;
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            overflow-y: auto;
          }

          .sidebar-inner {
            display: flex;
            flex-direction: column;
            height: 100%;
            padding: 24px 20px;
          }

          /* Logo */
          .sidebar-logo {
            display: flex;
            align-items: center;
            gap: 12px;
            padding-bottom: 24px;
            border-bottom: 1px solid #F1F5F9;
            margin-bottom: 24px;
          }

          .logo-icon {
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .logo-text {
            
            color: #0F172A;
            letter-spacing: -0.5px;
          }

          .logo-text span {
            color: #4F46E5;
          }

          /* User Profile */
          .sidebar-user {
            display: flex;
            align-items: center;
            gap: 14px;
            padding: 16px 12px;
            background: #F8FAFC;
            border-radius: 12px;
            margin-bottom: 28px;
          }

          .user-avatar {
            width: 44px;
            height: 44px;
            border-radius: 12px;
            background: linear-gradient(135deg, #4F46E5, #7C3AED);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            font-size: 16px;
            position: relative;
            flex-shrink: 0;
          }

          .online-dot {
            position: absolute;
            bottom: -2px;
            right: -2px;
            width: 12px;
            height: 12px;
            background: #10B981;
            border: 2px solid white;
            border-radius: 50%;
          }

          .user-info {
            flex: 1;
            min-width: 0;
          }

          .user-name {
            font-weight: 600;
            color: #0F172A;
            font-size: 14px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .user-role {
            font-size: 12px;
            color: #94A3B8;
          }

          /* Navigation */
          .sidebar-nav {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 4px;
          }

          .nav-label {
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #94A3B8;
            padding: 0 12px;
            margin-bottom: 12px;
          }

          .nav-item {
            text-decoration: none;
            color: #64748B;
            padding: 0 12px;
            border-radius: 10px;
            transition: all 0.2s ease;
          }

          .nav-item:hover {
            background: #F1F5F9;
            color: #0F172A;
          }

          .nav-item.active {
            background: #EEF2FF;
            color: #4F46E5;
          }

          .nav-item-inner {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 10px 0;
            position: relative;
          }

          .nav-icon {
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            flex-shrink: 0;
          }

          .nav-label-text {
            font-size: 14px;
            font-weight: 500;
            flex: 1;
          }

          .nav-badge {
            background: #4F46E5;
            color: white;
            font-size: 11px;
            font-weight: 600;
            padding: 2px 10px;
            border-radius: 20px;
            min-width: 20px;
            text-align: center;
          }

          .nav-active-bar {
            position: absolute;
            right: -12px;
            top: 50%;
            transform: translateY(-50%);
            width: 3px;
            height: 24px;
            background: #4F46E5;
            border-radius: 4px;
          }

          /* Sidebar Footer */
          .sidebar-footer {
            border-top: 1px solid #F1F5F9;
            padding-top: 16px;
            margin-top: 8px;
          }

          .logout-btn {
            display: flex;
            align-items: center;
            gap: 12px;
            width: 100%;
            padding: 10px 12px;
            border: none;
            background: transparent;
            border-radius: 10px;
            color: #EF4444;
            font-weight: 500;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .logout-btn:hover {
            background: #FEF2F2;
          }

          .logout-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }

          .logout-btn i {
            font-size: 18px;
          }

          .spin {
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          /* ===== Main Content ===== */
          .main-content {
            flex: 1;
            margin-left: 280px;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
          }

          .page-content {
            flex: 1;
            padding: 24px 32px 0;
          }

          /* Page Header */
          .page-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 32px;
          }

          .page-title {
            font-size: 28px;
            font-weight: 700;
            color: #0F172A;
            margin: 0 0 4px 0;
            letter-spacing: -0.5px;
          }

          .page-subtitle {
            font-size: 15px;
            color: #64748B;
            margin: 0;
          }

          .page-actions {
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .btn-notification {
            width: 40px;
            height: 40px;
            border-radius: 10px;
            border: 1px solid #E2E8F0;
            background: white;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            position: relative;
            transition: all 0.2s ease;
            color: #64748B;
            font-size: 18px;
          }

          .btn-notification:hover {
            background: #F8FAFC;
            border-color: #CBD5E1;
          }

          .notification-dot {
            position: absolute;
            top: -4px;
            right: -4px;
            min-width: 18px;
            height: 18px;
            padding: 0 5px;
            background: #EF4444;
            color: white;
            font-size: 10px;
            font-weight: 600;
            border-radius: 50%;
            border: 2px solid white;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .btn-primary-sm {
            padding: 8px 20px;
            background: #4F46E5;
            color: white;
            border: none;
            border-radius: 10px;
            font-weight: 500;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .btn-primary-sm:hover {
            background: #4338CA;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
          }

          /* Content Area */
          .content-area {
            background: white;
            border-radius: 16px;
            padding: 24px;
            min-height: 400px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
          }

          /* ===== Notification Drawer ===== */
          .drawer-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(15, 23, 42, 0.5);
            backdrop-filter: blur(4px);
            z-index: 1999;
            animation: fadeIn 0.3s ease;
          }

          .notification-drawer {
            position: fixed;
            top: 0;
            right: 0;
            width: 420px;
            max-width: 90vw;
            height: 100%;
            background: white;
            z-index: 2000;
            transform: translateX(100%);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            flex-direction: column;
            box-shadow: -4px 0 24px rgba(0, 0, 0, 0.08);
          }

          .notification-drawer.drawer-open {
            transform: translateX(0);
          }

          .drawer-header {
            padding: 20px 24px;
            border-bottom: 1px solid #F1F5F9;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-shrink: 0;
          }

          .drawer-title-wrapper {
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .drawer-title {
            font-size: 18px;
            font-weight: 700;
            color: #0F172A;
            margin: 0;
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .drawer-title i {
            color: #4F46E5;
          }

          .drawer-badge {
            background: #EF4444;
            color: white;
            font-size: 11px;
            font-weight: 600;
            padding: 2px 10px;
            border-radius: 20px;
          }

          .drawer-actions {
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .drawer-action-btn {
            padding: 6px 12px;
            border: none;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            background: transparent;
            color: #4F46E5;
          }

          .drawer-action-btn:hover {
            background: #EEF2FF;
          }

          .drawer-close-btn {
            width: 32px;
            height: 32px;
            border: none;
            background: transparent;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            color: #94A3B8;
            transition: all 0.2s ease;
            font-size: 16px;
          }

          .drawer-close-btn:hover {
            background: #F1F5F9;
            color: #0F172A;
          }

          .drawer-body {
            flex: 1;
            overflow-y: auto;
            padding: 16px 0;
          }

          /* Empty State */
          .empty-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            color: #94A3B8;
            padding: 40px 24px;
          }

          .empty-state i {
            font-size: 48px;
            margin-bottom: 16px;
            color: #CBD5E1;
          }

          .empty-state p {
            font-size: 16px;
            font-weight: 500;
            color: #64748B;
            margin: 0;
          }

          .empty-state span {
            font-size: 14px;
            color: #94A3B8;
            margin-top: 4px;
          }

          /* Notification List */
          .notification-list {
            display: flex;
            flex-direction: column;
          }

          .notification-item {
            display: flex;
            gap: 14px;
            padding: 16px 24px;
            cursor: pointer;
            transition: all 0.2s ease;
            border-left: 3px solid transparent;
          }

          .notification-item:hover {
            background: #F8FAFC;
          }

          .notification-item.unread {
            background: #F8FAFC;
            border-left-color: #4F46E5;
          }

          .notification-item.unread:hover {
            background: #F1F5F9;
          }

          .notification-icon {
            width: 40px;
            height: 40px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            flex-shrink: 0;
          }

          .notification-content {
            flex: 1;
            min-width: 0;
          }

          .notification-header {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 4px;
          }

          .notification-title {
            font-size: 14px;
            font-weight: 600;
            color: #0F172A;
            margin: 0;
            flex: 1;
          }

          .unread-dot {
            width: 6px;
            height: 6px;
            background: #4F46E5;
            border-radius: 50%;
            flex-shrink: 0;
          }

          .notification-message {
            font-size: 13px;
            color: #64748B;
            margin: 0 0 6px 0;
            line-height: 1.4;
          }

          .notification-time {
            font-size: 12px;
            color: #94A3B8;
            display: flex;
            align-items: center;
            gap: 4px;
          }

          .notification-time i {
            font-size: 11px;
          }

          /* ===== Mobile Overlay ===== */
          .mobile-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(15, 23, 42, 0.5);
            backdrop-filter: blur(4px);
            z-index: 999;
            animation: fadeIn 0.3s ease;
          }

          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          /* ===== Mobile Toggle ===== */
          .mobile-toggle {
            display: none;
            position: fixed;
            bottom: 24px;
            right: 24px;
            width: 56px;
            height: 56px;
            border-radius: 16px;
            background: #4F46E5;
            color: white;
            border: none;
            font-size: 24px;
            box-shadow: 0 8px 24px rgba(79, 70, 229, 0.4);
            cursor: pointer;
            z-index: 1001;
            transition: all 0.3s ease;
          }

          .mobile-toggle:hover {
            transform: scale(1.05);
          }

          /* ===== Responsive ===== */
          @media (max-width: 1024px) {
            .sidebar {
              transform: translateX(-100%);
            }

            .sidebar-open {
              transform: translateX(0);
            }

            .main-content {
              margin-left: 0;
            }

            .mobile-toggle {
              display: flex;
              align-items: center;
              justify-content: center;
            }

            .page-content {
              padding: 20px 16px 0;
            }

            .page-header {
              flex-direction: column;
              gap: 16px;
            }

            .page-title {
              font-size: 24px;
            }

            .page-actions {
              width: 100%;
              justify-content: flex-start;
            }
          }

          @media (max-width: 640px) {
            .content-area {
              padding: 16px;
              border-radius: 12px;
            }

            .page-title {
              font-size: 20px;
            }

            .page-subtitle {
              font-size: 14px;
            }

            .btn-primary-sm {
              padding: 6px 16px;
              font-size: 13px;
            }

            .notification-drawer {
              width: 100%;
              max-width: 100%;
            }
          }

          /* ===== Scrollbar ===== */
          .sidebar::-webkit-scrollbar,
          .drawer-body::-webkit-scrollbar {
            width: 4px;
          }

          .sidebar::-webkit-scrollbar-track,
          .drawer-body::-webkit-scrollbar-track {
            background: transparent;
          }

          .sidebar::-webkit-scrollbar-thumb,
          .drawer-body::-webkit-scrollbar-thumb {
            background: #E2E8F0;
            border-radius: 4px;
          }
        `}</style>
      </div>
    </>
  );
};

export default MainLayout;

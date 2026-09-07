import { Container } from "@mui/material";
import { NavLink, Outlet, useParams } from "react-router-dom";

const TABS = [
  {
    key: "complaints",
    label: "Complaints",
    icon: "bi bi-exclamation-circle",
    subTabs: [
      {
        key: "total",
        label: "Total Complaints",
        count: 120,
      },
      {
        key: "pending",
        label: "Pending",
        count: 20,
      },
    ],
  },
  {
    key: "nazar",
    label: "Nazar",
    icon: "bi bi-eye",
    subTabs: [
      {
        key: "total",
        label: "Total Nazar",
        count: 50,
      },
      {
        key: "pending",
        label: "Pending",
        count: 10,
      },
      {
        key: "resolved",
        label: "Resolved",
        count: 40,
      },
    ],
  },
  {
    key: "14c",
    label: "14C",
    icon: "bi bi-file-earmark-text",
    subTabs: [
      {
        key: "total",
        label: "Total 14C",
        count: 30,
      },
      {
        key: "pending",
        label: "Pending",
        count: 5,
      },
      {
        key: "resolved",
        label: "Resolved",
        count: 25,
      },
    ],
  },
];

const RequestComplaintDetails = () => {
  const { requestId, tab, subTab } = useParams();

  const activeTab = TABS.find((item) => item.key === tab) || TABS[0];

  const activeSubTab =
    activeTab.subTabs?.find((item) => item.key === subTab) ||
    activeTab.subTabs?.[0];

  return (
    <Container
      maxWidth="xl"
      sx={{
        py: 4,
        bgcolor: "background.default",
        minHeight: "100vh",
      }}
    >
      {/* ========================================
          HEADER
      ======================================== */}
      <div className="border-bottom border-2 border-primary pb-3 mb-4">
        <div className="d-flex align-items-center justify-content-between gap-3">
          <div>
            <h4 className="fw-bold text-primary mb-1 fs-5 fs-sm-4">
              Complaint Details
            </h4>

            <small className="text-muted">
              Request ID:{" "}
              <span className="fw-semibold text-dark">{requestId || "-"}</span>
            </small>
          </div>

          {/* Active Tab */}
          <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill">
            {activeTab.label}
          </span>
        </div>
      </div>

      {/* ========================================
          MAIN TABS
      ======================================== */}
      <div className="bg-white rounded-3 shadow-sm mb-3">
        <div className="d-flex  flex-wrap border-bottom">
          {TABS.map((item) => (
            <NavLink
              key={item.key}
              to={`/request/${requestId}/${item.key}/${item.subTabs[0].key}`}
              className={({ isActive }) =>
                `main-tab ${
                  isActive || item.key === activeTab.key ? "active" : ""
                }`
              }
            >
              <i className={`${item.icon} me-2`}></i>

              {item.label}
            </NavLink>
          ))}
        </div>

        {/* ========================================
            SUB TABS
        ======================================== */}
        {activeTab.subTabs?.length > 0 && (
          <div className="px-3 py-3 bg-light">
            <div className="d-flex flex-wrap gap-2">
              {activeTab.subTabs.map((item) => (
                <NavLink
                  key={item.key}
                  to={`/request/${requestId}/${activeTab.key}/${item.key}`}
                  className={({ isActive }) =>
                    `sub-tab ${
                      isActive || item.key === activeSubTab?.key ? "active" : ""
                    }`
                  }
                >
                  <span>{item.label}</span>

                  {item.count !== undefined && (
                    <span className="badge rounded-pill ms-2">
                      {item.count}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ========================================
          ACTIVE TAB INFO
      ======================================== */}
      <div className="mb-3">
        <div className="d-flex align-items-center gap-2">
          <h5 className="fw-bold mb-0">
            {activeSubTab?.label || activeTab.label}
          </h5>

          {activeSubTab?.count !== undefined && (
            <span className="badge bg-primary rounded-pill">
              {activeSubTab.count}
            </span>
          )}
        </div>
      </div>

      {/* ========================================
          TAB CONTENT
      ======================================== */}
      <div className="bg-white rounded-3 shadow-sm border">
        <Outlet
          context={{
            requestId,
            activeTab,
            activeSubTab,
          }}
        />
      </div>

      {/* ========================================
          CSS
      ======================================== */}
      <style>{`
        .main-tab {
          position: relative;
          display: inline-flex;
          align-items: center;
          padding: 14px 22px;
          color: #6c757d;
          text-decoration: none;
          font-weight: 600;
          border-bottom: 3px solid transparent;
          transition: all 0.2s ease;
          border:1px solid #ddd;
          border-radius: 5px 5px 0 0;
          margin-right:5px;
        }

        .main-tab:hover {
          color: #0d6efd;
          background: rgba(13, 110, 253, 0.04);
        }

        .main-tab.active {
          color: #0d6efd;
          border-color: #0d6efd;
          background: rgba(13, 110, 253, 0.05);
        }

        .sub-tab {
          display: inline-flex;
          align-items: center;
          padding: 8px 14px;
          border-radius: 8px;
          color: #6c757d;
          text-decoration: none;
          background: #fff;
          border: 1px solid #dee2e6;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .sub-tab:hover {
          color: #0d6efd;
          border-color: #0d6efd;
          background: rgba(13, 110, 253, 0.04);
        }

        .sub-tab.active {
          color: #fff;
          background: #0d6efd;
          border-color: #0d6efd;
        }

        .sub-tab .badge {
          background: #e9ecef;
          color: #495057;
          font-size: 11px;
        }

        .sub-tab.active .badge {
          background: rgba(255, 255, 255, 0.2);
          color: #fff;
        }
      `}</style>
    </Container>
  );
};

export default RequestComplaintDetails;

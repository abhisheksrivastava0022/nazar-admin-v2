import React from "react";
import { useNavigate } from "react-router-dom";

const FilmDetails = ({ film, onBack }) => {
  const navigate = useNavigate();
  // ============================================
  // STATIC DATA (for demo purposes)
  // ============================================
  const filmComplaints = [
    {
      id: "CMP-001",
      description:
        "Unauthorized streaming of Dune: Part Two on multiple platforms including illegal streaming sites and social media platforms.",
      urls_count: 45,
      created_at: "2024-01-15 10:30 AM",
    },
    {
      id: "CMP-002",
      description:
        "Copyright infringement on social media platforms where users have uploaded full scenes and clips.",
      urls_count: 32,
      created_at: "2024-01-14 02:45 PM",
    },
    {
      id: "CMP-003",
      description:
        "False DMCA takedown notice submitted by unauthorized party.",
      urls_count: 12,
      created_at: "2024-01-13 09:15 AM",
    },
    {
      id: "CMP-004",
      description:
        "Pirated copies available on torrent sites and file-sharing platforms.",
      urls_count: 67,
      created_at: "2024-01-12 04:20 PM",
    },
    {
      id: "CMP-005",
      description:
        "Unauthorized merchandise sales using film branding and imagery.",
      urls_count: 23,
      created_at: "2024-01-11 11:30 AM",
    },
  ];

  const handleComplaintClick = (complaint) => {
    // setSelectedFilm(film);
    // setShowDetailModal(true);
    navigate(`/complants/${complaint.id}`);
  };

  const stats = {
    films: 24,
    totalComplaints: 1847,
    totalUrls: 12456,
    // pendingComplaints: 342,
    pendingUrls: 242,
    processUrls: 142,
    complianceUrls: 8234,
    moreClarificationUrls: 2876,
    notComplianceUrls: 1346,
  };

  const StatCard = ({ icon, label, value, color, onClick, subtitle }) => (
    <div
      className={`stat-card ${onClick ? "clickable" : ""}`}
      onClick={onClick}
    >
      <div className="stat-card-inner">
        <div
          className="stat-icon-wrapper"
          style={{ background: `${color}15`, color: color }}
        >
          <i className={icon}></i>
        </div>
        <div className="stat-info">
          <h3 className="stat-value">
            {typeof value === "number" ? value.toLocaleString() : value}
          </h3>
          <p className="stat-label">{label}</p>
          {subtitle && <span className="stat-subtitle">{subtitle}</span>}
        </div>
      </div>
    </div>
  );
  return (
    <>
      <div className="film-details-container">
        {/* ========== HEADER ========== */}
        <div className="listing-header">
          <div className="header-left">
            <h2 className="listing-title">
              <i className="bi bi-film"></i>
              {film?.name || "Film Name"}
            </h2>
            <p className="listing-subtitle">
              View and manage all films with their complaint details
            </p>
          </div>
          <div className="header-right">
            <button className="back-btn" onClick={onBack}>
              <i className="bi bi-arrow-left"></i>
              Back to Films
            </button>
          </div>
        </div>

        {/* ========== STATS BAR ========== */}
        <div className="stats-grid">
          {/* <StatCard
            icon="bi bi-camera-reels"
            label="All Films complants"
            value={stats.films}
            color="#0877F3"
            onClick={() => {
              navigate("/films");
            }}
          /> */}
          <StatCard
            icon="bi bi-chat-square-text"
            label="Total Complaints"
            value={stats.totalComplaints}
            color="#7C3AED"
            onClick={() => {
              navigate("/complants");
            }}
          />
          <StatCard
            icon="bi bi-globe"
            label="Total URLs"
            value={stats.totalUrls}
            color="#059669"
          />
          <StatCard
            icon="bi bi-hourglass-split"
            label="Pending URLs"
            value={stats.pendingUrls}
            color="#D97706"
          />
          <StatCard
            icon="bi bi-arrow-repeat"
            label="Send / Processed URLs"
            value={stats.processUrls}
            color="#D97706"
          />
          <StatCard
            icon="bi bi-check-circle-fill"
            label="Compliance URLs"
            value={stats.complianceUrls}
            color="#10B981"
          />
          <StatCard
            icon="bi bi-chat-dots"
            label="More Clarification URLs"
            value={stats.moreClarificationUrls}
            color="#F59E0B"
          />
          <StatCard
            icon="bi bi-x-circle-fill"
            label="Not Compliance URLs"
            value={stats.notComplianceUrls}
            color="#EF4444"
          />
        </div>

        {/* ========== COMPLAINTS LIST ========== */}
        <div className="complaints-list-wrapper">
          {filmComplaints.length === 0 ? (
            <div className="empty-state">
              <i className="bi bi-inbox"></i>
              <p>No complaints for this film</p>
            </div>
          ) : (
            <div className="complaints-list">
              {filmComplaints.map((complaint) => (
                <div
                  key={complaint.id}
                  className="complaint-item"
                  onClick={() => handleComplaintClick(complaint)}
                >
                  <div className="complaint-item-header">
                    <span className="complaint-id">{complaint.id}</span>
                  </div>
                  <p className="complaint-description">
                    {complaint.description}
                  </p>
                  <div className="complaint-meta">
                    <span>
                      <i className="bi bi-link-45deg"></i>
                      {complaint.urls_count} URLs
                    </span>
                    <span>
                      <i className="bi bi-calendar3"></i>
                      {complaint.created_at}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FilmDetails;

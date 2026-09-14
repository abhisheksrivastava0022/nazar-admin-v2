import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const OverViewLayout = () => {
  const navigate = useNavigate();
  // ============================================
  // STATIC DATA (No commas in numbers)
  // ============================================
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

  const filmsData = [
    {
      id: 1,
      name: "Dune: Part Two Dune: Part Two Dune: Part Two Dune: Part Two Dune: Part Two",
      total_complaints: 156,
      total_urls: 1234,
      pending_urls: 45,
    },
    {
      id: 2,
      name: "Deadpool & Wolverine",
      total_complaints: 234,
      total_urls: 2456,
      pending_urls: 78,
    },
    {
      id: 3,
      name: "Inside Out 2",
      total_complaints: 89,
      total_urls: 876,
      pending_urls: 23,
    },
    {
      id: 4,
      name: "Gladiator II",
      total_complaints: 312,
      total_urls: 3456,
      pending_urls: 156,
    },
    {
      id: 5,
      name: "Moana 2",
      total_complaints: 67,
      total_urls: 543,
      pending_urls: 12,
    },
    {
      id: 6,
      name: "Wicked",
      total_complaints: 189,
      total_urls: 1987,
      pending_urls: 67,
    },
  ];

  const complaintsData = {
    1: [
      {
        id: "CMP-001",
        status: "Pending",
        description:
          "Unauthorized streaming of Dune: Part Two on multiple platforms",
        urls_count: 45,
        created_at: "2024-01-15 10:30 AM",
      },
      {
        id: "CMP-002",
        status: "Approved",
        description: "Copyright infringement on social media platforms",
        urls_count: 32,
        created_at: "2024-01-14 02:45 PM",
      },
      {
        id: "CMP-003",
        status: "Rejected",
        description: "False DMCA takedown notice submitted",
        urls_count: 12,
        created_at: "2024-01-13 09:15 AM",
      },
      {
        id: "CMP-004",
        status: "Pending",
        description: "Pirated copies available on torrent sites",
        urls_count: 67,
        created_at: "2024-01-12 04:20 PM",
      },
    ],
    2: [
      {
        id: "CMP-005",
        status: "Pending",
        description:
          "Illegal streaming of Deadpool & Wolverine on streaming sites",
        urls_count: 78,
        created_at: "2024-01-16 11:00 AM",
      },
      {
        id: "CMP-006",
        status: "Approved",
        description: "Unauthorized merchandise sales online",
        urls_count: 45,
        created_at: "2024-01-15 03:30 PM",
      },
    ],
    3: [
      {
        id: "CMP-007",
        status: "Pending",
        description: "Copyright violation on YouTube channels",
        urls_count: 23,
        created_at: "2024-01-16 09:45 AM",
      },
    ],
    4: [
      {
        id: "CMP-008",
        status: "Pending",
        description: "Early screening leaks on social media",
        urls_count: 156,
        created_at: "2024-01-16 08:30 AM",
      },
      {
        id: "CMP-009",
        status: "Approved",
        description: "Unauthorized distribution on streaming platforms",
        urls_count: 89,
        created_at: "2024-01-15 01:15 PM",
      },
      {
        id: "CMP-010",
        status: "Rejected",
        description: "False copyright claim on fan content",
        urls_count: 34,
        created_at: "2024-01-14 10:00 AM",
      },
    ],
  };

  const complaintDetailsData = {
    "CMP-001": {
      id: "CMP-001",
      status: "Pending",
      description:
        "Unauthorized streaming of Dune: Part Two on multiple platforms including illegal streaming sites and social media platforms. The content is being distributed without proper licensing and copyright permissions.",
      evidence:
        "Screenshots of streaming sites, URL lists, and DMCA takedown notices have been submitted as evidence. Multiple instances of copyright violation have been documented.",
      court_order: "/court-order-dune-001.pdf",
      created_at: "2024-01-15 10:30 AM",
      updated_at: "2024-01-16 02:15 PM",
      urls: [
        { url: "https://example-stream.com/dune-2", status: "Compliant" },
        { url: "https://social-media.com/video/dune-2", status: "Pending" },
        {
          url: "https://torrent-site.com/dune-2-torrent",
          status: "Not Compliant",
        },
        { url: "https://streaming-site.net/dune-part-two", status: "Pending" },
        { url: "https://video-sharing.com/dune-2-clip", status: "Compliant" },
      ],
    },
    "CMP-002": {
      id: "CMP-002",
      status: "Approved",
      description:
        "Copyright infringement on social media platforms where users have uploaded full scenes and clips from Dune: Part Two without authorization.",
      evidence:
        "Social media posts, user profiles, and content links have been documented. Copyright infringement notifications have been submitted.",
      court_order: "/court-order-dune-002.pdf",
      created_at: "2024-01-14 02:45 PM",
      updated_at: "2024-01-15 11:30 AM",
      urls: [
        {
          url: "https://social-media.com/post/dune-scene",
          status: "Compliant",
        },
        { url: "https://video-platform.com/dune-clip", status: "Compliant" },
        { url: "https://social-network.com/dune-2-spoiler", status: "Pending" },
      ],
    },
    "CMP-005": {
      id: "CMP-005",
      status: "Pending",
      description:
        "Illegal streaming of Deadpool & Wolverine on multiple streaming sites and unauthorized platforms. The content is being distributed without proper licensing.",
      evidence:
        "Streaming site URLs, server IP addresses, and domain registration details have been collected.",
      court_order: "/court-order-deadpool-001.pdf",
      created_at: "2024-01-16 11:00 AM",
      updated_at: "2024-01-16 01:45 PM",
      urls: [
        {
          url: "https://illegal-stream.com/deadpool-wolverine",
          status: "Pending",
        },
        {
          url: "https://pirate-platform.com/movie/deadpool-3",
          status: "Not Compliant",
        },
        {
          url: "https://streaming-site.net/deadpool-wolverine",
          status: "Pending",
        },
        {
          url: "https://video-platform.com/deadpool-clip",
          status: "Compliant",
        },
      ],
    },
  };

  // ============================================
  // STATE
  // ============================================
  const [selectedFilm, setSelectedFilm] = useState(null);
  const [filmComplaints, setFilmComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [complaintDetails, setComplaintDetails] = useState(null);

  // Modal states
  const [showFilmModal, setShowFilmModal] = useState(false);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // ============================================
  // HANDLERS
  // ============================================
  const handleFilmClick = (film) => {
    setSelectedFilm(film);
    // setFilmComplaints(complaintsData[film.id] || []);
    // setShowFilmModal(true);
    navigate(`films/${film.id}`);
  };

  const handleComplaintClick = (complaint) => {
    setSelectedComplaint(complaint);
    setComplaintDetails(complaintDetailsData[complaint.id] || null);
    setShowComplaintModal(false);
    setShowDetailModal(true);
  };

  // ============================================
  // STATS CARD COMPONENT
  // ============================================
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

  // ============================================
  // RENDER
  // ============================================
  return (
    <>
      <div className="overview-container">
        {/* ========== STATISTICS GRID ========== */}
        <div className="stats-grid">
          <StatCard
            icon="bi bi-camera-reels"
            label="All Films complants"
            value={stats.films}
            color="#0877F3"
            onClick={() => {
              navigate("/films");
            }}
          />
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

        {/* ========== FILMS LIST ========== */}
        <div className="films-section mb-3">
          <div className="section-header">
            <h3 className="section-title">
              <i className="bi bi-film"></i>
              All Films
            </h3>
            <span className="section-count">{filmsData.length} films</span>
          </div>
        </div>

        <div className="films-grid">
          {filmsData.map((film) => (
            <div
              key={film.id}
              className="film-card"
              onClick={() => handleFilmClick(film)}
            >
              <div className="film-card-header">
                <div className="film-icon">
                  <i className="bi bi-film"></i>
                </div>
                <h4 className="film-name">{film.name}</h4>
              </div>

              <div className="film-stats-grid">
                <div className="film-stat-item">
                  <span
                    className="film-stat-value"
                    style={{ color: "#7c3aed" }}
                  >
                    {film.total_complaints}
                  </span>
                  <span className="film-stat-label">Total Complaints</span>
                </div>
                <div className="film-stat-divider"></div>
                <div className="film-stat-item">
                  <span
                    className="film-stat-value"
                    style={{ color: "#059669" }}
                  >
                    {film.total_urls.toLocaleString()}
                  </span>
                  <span className="film-stat-label">Total URLs</span>
                </div>
                <div className="film-stat-divider"></div>
                <div className="film-stat-item">
                  <span
                    className="film-stat-value"
                    style={{ color: "#D97706" }}
                  >
                    {film.pending_urls}
                  </span>
                  <span className="film-stat-label">Pending URLs</span>
                </div>
              </div>
              <div className="film-card-footer">
                <span className="film-view-btn">View Details →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default OverViewLayout;

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
    pendingComplaints: 342,
    complianceUrls: 8234,
    moreClarificationUrls: 2876,
    notComplianceUrls: 1346,
  };

  const filmsData = [
    {
      id: 1,
      name: "Dune: Part Two",
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
    <div className="overview-container">
      {/* ========== STATISTICS GRID ========== */}
      <div className="stats-grid">
        <StatCard
          icon="bi bi-film"
          label="All Films complants"
          value={stats.films}
          color="#4F46E5"
          onClick={() => {
            navigate("/films");
          }}

          // subtitle="Click to view all films"
        />
        <StatCard
          icon="bi bi-file-text"
          label="Total Complaints"
          value={stats.totalComplaints}
          color="#7C3AED"
          onClick={() => {
            navigate("/complants");
          }}
        />
        <StatCard
          icon="bi bi-link-45deg"
          label="Total URLs"
          value={stats.totalUrls}
          color="#059669"
        />
        <StatCard
          icon="bi bi-clock-history"
          label="Pending Complaints"
          value={stats.pendingComplaints}
          color="#D97706"
        />
        <StatCard
          icon="bi bi-check-circle"
          label="Compliance URLs"
          value={stats.complianceUrls}
          color="#10B981"
        />
        <StatCard
          icon="bi bi-question-circle"
          label="More Clarification URLs"
          value={stats.moreClarificationUrls}
          color="#F59E0B"
        />
        <StatCard
          icon="bi bi-x-circle"
          label="Not Compliance URLs"
          value={stats.notComplianceUrls}
          color="#EF4444"
        />
      </div>

      {/* ========== FILMS LIST ========== */}
      <div className="films-section">
        <div className="section-header">
          <h3 className="section-title">
            <i className="bi bi-film"></i>
            All Films
          </h3>
          <span className="section-count">{filmsData.length} films</span>
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
              <div className="film-stats">
                <div className="film-stat">
                  <span className="film-stat-value">
                    {film.total_complaints}
                  </span>
                  <span className="film-stat-label">Complaints</span>
                </div>
                <div className="film-stat">
                  <span className="film-stat-value">
                    {film.total_urls.toLocaleString()}
                  </span>
                  <span className="film-stat-label">URLs</span>
                </div>
                <div className="film-stat">
                  <span className="film-stat-value">{film.pending_urls}</span>
                  <span className="film-stat-label">Pending</span>
                </div>
              </div>
              <div className="film-card-footer">
                <span className="film-view-btn">View Details →</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========== FILM COMPLAINTS MODAL ========== */}
      {showFilmModal && (
        <div className="modal-overlay" onClick={() => setShowFilmModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 className="modal-title">
                  <i className="bi bi-film"></i>
                  {selectedFilm?.name} - Complaints
                </h3>
                <p className="modal-subtitle">
                  Total: {filmComplaints.length} complaints
                </p>
              </div>
              <button
                className="modal-close"
                onClick={() => setShowFilmModal(false)}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <div className="modal-body">
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
                        <span
                          className={`complaint-status status-${complaint.status.toLowerCase()}`}
                        >
                          {complaint.status}
                        </span>
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
        </div>
      )}

      {/* ========== COMPLAINT DETAILS MODAL ========== */}
      {showDetailModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowDetailModal(false)}
        >
          <div
            className="modal-content modal-large"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <h3 className="modal-title">
                  <i className="bi bi-file-text"></i>
                  Complaint {selectedComplaint?.id}
                </h3>
                <p className="modal-subtitle">
                  {selectedFilm?.name} - {selectedComplaint?.status}
                </p>
              </div>
              <button
                className="modal-close"
                onClick={() => setShowDetailModal(false)}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <div className="modal-body">
              {complaintDetails ? (
                <div className="complaint-details">
                  {/* Details Grid */}
                  <div className="details-grid">
                    <div className="detail-item">
                      <label>Complaint ID</label>
                      <span>{complaintDetails.id}</span>
                    </div>
                    <div className="detail-item">
                      <label>Status</label>
                      <span
                        className={`status-badge status-${complaintDetails.status.toLowerCase()}`}
                      >
                        {complaintDetails.status}
                      </span>
                    </div>
                    <div className="detail-item">
                      <label>Created At</label>
                      <span>{complaintDetails.created_at}</span>
                    </div>
                    <div className="detail-item">
                      <label>Updated At</label>
                      <span>{complaintDetails.updated_at}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="detail-section">
                    <h4>Description</h4>
                    <p>{complaintDetails.description}</p>
                  </div>

                  {/* Evidence */}
                  {complaintDetails.evidence && (
                    <div className="detail-section">
                      <h4>Evidence</h4>
                      <p>{complaintDetails.evidence}</p>
                    </div>
                  )}

                  {/* Court Order */}
                  {complaintDetails.court_order && (
                    <div className="detail-section">
                      <h4>Court Order</h4>
                      <div className="court-order">
                        <i className="bi bi-file-pdf"></i>
                        <a
                          href={complaintDetails.court_order}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Court Order Document
                        </a>
                        <span className="court-order-size">(PDF, 2.4 MB)</span>
                      </div>
                    </div>
                  )}

                  {/* URLs */}
                  <div className="detail-section">
                    <h4>URLs ({complaintDetails.urls?.length || 0})</h4>
                    {complaintDetails.urls?.length === 0 ? (
                      <p className="text-muted">No URLs found</p>
                    ) : (
                      <div className="urls-list">
                        {complaintDetails.urls.map((url, index) => (
                          <div key={index} className="url-item">
                            <span className="url-number">#{index + 1}</span>
                            <a
                              href={url.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {url.url}
                            </a>
                            <span
                              className={`url-status status-${url.status.toLowerCase().replace(" ", "-")}`}
                            >
                              {url.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="loading-state">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========== STYLES ========== */}
      <style>{`
        /* ===== Container ===== */
        .overview-container {
          padding: 0;
          animation: fadeIn 0.3s ease;
        }

        /* ===== Stats Grid ===== */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 32px;
        }

        .stat-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          border: 1px solid #F1F5F9;
          transition: all 0.2s ease;
        }

        .stat-card.clickable {
          cursor: pointer;
        }

        .stat-card.clickable:hover {
          border-color: #4F46E5;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.1);
        }

        .stat-card-inner {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .stat-icon-wrapper {
          width: 48px;
          height: 48px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          flex-shrink: 0;
        }

        .stat-info {
          flex: 1;
          min-width: 0;
        }

        .stat-value {
          font-size: 24px;
          font-weight: 700;
          color: #0F172A;
          margin: 0 0 2px 0;
          line-height: 1.2;
        }

        .stat-label {
          font-size: 13px;
          color: #64748B;
          margin: 0;
          font-weight: 500;
        }

        .stat-subtitle {
          font-size: 11px;
          color: #94A3B8;
          display: block;
          margin-top: 2px;
        }

        /* ===== Films Section ===== */
        .films-section {
          background: white;
          border-radius: 16px;
          padding: 24px;
          border: 1px solid #F1F5F9;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .section-title {
          font-size: 18px;
          font-weight: 600;
          color: #0F172A;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .section-title i {
          color: #4F46E5;
        }

        .section-count {
          font-size: 13px;
          color: #94A3B8;
          background: #F1F5F9;
          padding: 4px 12px;
          border-radius: 20px;
        }

        /* ===== Films Grid ===== */
        .films-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 16px;
        }

        .film-card {
          background: #F8FAFC;
          border-radius: 12px;
          padding: 16px;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid transparent;
        }

        .film-card:hover {
          background: white;
          border-color: #4F46E5;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
        }

        .film-card-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .film-icon {
          width: 36px;
          height: 36px;
          background: #4F46E5;
          color: white;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
        }

        .film-name {
          font-size: 15px;
          font-weight: 600;
          color: #0F172A;
          margin: 0;
          flex: 1;
        }

        .film-stats {
          display: flex;
          gap: 16px;
          margin-bottom: 12px;
        }

        .film-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .film-stat-value {
          font-size: 18px;
          font-weight: 700;
          color: #0F172A;
        }

        .film-stat-label {
          font-size: 11px;
          color: #94A3B8;
        }

        .film-card-footer {
          text-align: right;
        }

        .film-view-btn {
          font-size: 13px;
          color: #4F46E5;
          font-weight: 500;
        }

        /* ===== Modal ===== */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(4px);
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          animation: fadeIn 0.25s ease;
        }

        .modal-content {
          background: white;
          border-radius: 16px;
          max-width: 700px;
          width: 100%;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          animation: slideUp 0.3s ease;
        }

        .modal-content.modal-large {
          max-width: 900px;
        }

        .modal-header {
          padding: 20px 24px;
          border-bottom: 1px solid #F1F5F9;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-shrink: 0;
        }

        .modal-title {
          font-size: 18px;
          font-weight: 700;
          color: #0F172A;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .modal-title i {
          color: #4F46E5;
        }

        .modal-subtitle {
          font-size: 14px;
          color: #64748B;
          margin: 4px 0 0 0;
        }

        .modal-close {
          width: 36px;
          height: 36px;
          border: none;
          background: #F1F5F9;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #64748B;
          transition: all 0.2s ease;
          font-size: 16px;
        }

        .modal-close:hover {
          background: #E2E8F0;
          color: #0F172A;
        }

        .modal-body {
          padding: 24px;
          overflow-y: auto;
          flex: 1;
        }

        /* ===== Complaints List ===== */
        .complaints-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .complaint-item {
          background: #F8FAFC;
          border-radius: 10px;
          padding: 16px;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid transparent;
        }

        .complaint-item:hover {
          background: white;
          border-color: #4F46E5;
        }

        .complaint-item-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;
        }

        .complaint-id {
          font-weight: 600;
          color: #0F172A;
          font-size: 14px;
        }

        .complaint-status {
          font-size: 12px;
          font-weight: 600;
          padding: 2px 10px;
          border-radius: 20px;
        }

        .complaint-status.status-pending {
          background: #FEF3C7;
          color: #D97706;
        }

        .complaint-status.status-approved {
          background: #D1FAE5;
          color: #059669;
        }

        .complaint-status.status-rejected {
          background: #FEE2E2;
          color: #DC2626;
        }

        .complaint-description {
          font-size: 14px;
          color: #475569;
          margin: 0 0 8px 0;
          line-height: 1.4;
        }

        .complaint-meta {
          display: flex;
          gap: 16px;
          font-size: 13px;
          color: #94A3B8;
        }

        .complaint-meta i {
          margin-right: 4px;
        }

        /* ===== Complaint Details ===== */
        .details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .detail-item label {
          font-size: 12px;
          font-weight: 600;
          color: #94A3B8;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .detail-item span {
          font-size: 14px;
          color: #0F172A;
          font-weight: 500;
        }

        .status-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
        }

        .status-badge.status-pending {
          background: #FEF3C7;
          color: #D97706;
        }

        .status-badge.status-approved {
          background: #D1FAE5;
          color: #059669;
        }

        .status-badge.status-rejected {
          background: #FEE2E2;
          color: #DC2626;
        }

        .detail-section {
          margin-bottom: 24px;
        }

        .detail-section:last-child {
          margin-bottom: 0;
        }

        .detail-section h4 {
          font-size: 15px;
          font-weight: 600;
          color: #0F172A;
          margin: 0 0 8px 0;
        }

        .detail-section p {
          font-size: 14px;
          color: #475569;
          line-height: 1.6;
          margin: 0;
        }

        /* ===== Court Order ===== */
        .court-order {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: #F8FAFC;
          border-radius: 8px;
          border: 1px solid #E2E8F0;
        }

        .court-order i {
          color: #EF4444;
          font-size: 24px;
        }

        .court-order a {
          color: #4F46E5;
          text-decoration: none;
          font-weight: 500;
        }

        .court-order a:hover {
          text-decoration: underline;
        }

        .court-order-size {
          font-size: 12px;
          color: #94A3B8;
          margin-left: auto;
        }

        /* ===== URLs List ===== */
        .urls-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .url-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          background: #F8FAFC;
          border-radius: 8px;
          border: 1px solid #F1F5F9;
        }

        .url-number {
          font-weight: 600;
          color: #94A3B8;
          font-size: 13px;
          min-width: 30px;
        }

        .url-item a {
          color: #4F46E5;
          text-decoration: none;
          font-size: 13px;
          flex: 1;
          word-break: break-all;
        }

        .url-item a:hover {
          text-decoration: underline;
        }

        .url-status {
          font-size: 11px;
          font-weight: 600;
          padding: 2px 10px;
          border-radius: 20px;
          flex-shrink: 0;
        }

        .url-status.status-pending {
          background: #FEF3C7;
          color: #D97706;
        }

        .url-status.status-compliant {
          background: #D1FAE5;
          color: #059669;
        }

        .url-status.status-not-compliant {
          background: #FEE2E2;
          color: #DC2626;
        }

        .url-status.status-clarification {
          background: #FEF3C7;
          color: #D97706;
        }

        /* ===== Empty State ===== */
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 48px 24px;
          color: #94A3B8;
        }

        .empty-state i {
          font-size: 48px;
          color: #CBD5E1;
          margin-bottom: 12px;
        }

        .empty-state p {
          font-size: 16px;
          font-weight: 500;
          color: #64748B;
          margin: 0;
        }

        .loading-state {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 24px;
        }

        .text-muted {
          color: #94A3B8;
        }

        /* ===== Animations ===== */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* ===== Responsive ===== */
        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }

          .stat-card {
            padding: 16px;
          }

          .stat-value {
            font-size: 20px;
          }

          .films-grid {
            grid-template-columns: 1fr;
          }

          .modal-content {
            max-width: 100%;
            margin: 12px;
            max-height: 95vh;
          }

          .modal-header {
            padding: 16px 20px;
          }

          .modal-body {
            padding: 16px 20px;
          }

          .details-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 480px) {
          .stats-grid {
            grid-template-columns: 1fr 1fr;
            gap: 8px;
          }

          .stat-card {
            padding: 12px;
          }

          .stat-icon-wrapper {
            width: 36px;
            height: 36px;
            font-size: 16px;
          }

          .stat-value {
            font-size: 18px;
          }

          .stat-label {
            font-size: 11px;
          }

          .films-section {
            padding: 16px;
          }

          .url-item {
            flex-wrap: wrap;
          }

          .url-item a {
            width: 100%;
            order: 2;
          }

          .url-status {
            order: 3;
          }
        }
      `}</style>
    </div>
  );
};

export default OverViewLayout;

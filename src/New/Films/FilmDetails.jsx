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

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="film-details-container">
      {/* ========== BACK BUTTON ========== */}
      <button className="back-btn" onClick={onBack}>
        <i className="bi bi-arrow-left"></i>
        Back to Films
      </button>

      {/* ========== FILM HEADER ========== */}
      <div className="film-header">
        <div className="film-header-left">
          <div className="film-icon-large">
            <i className="bi bi-film"></i>
          </div>
          <div>
            <h2 className="film-title">{film?.name || "Film Name"}</h2>
            <p className="film-subtitle">
              Total Complaints: {filmComplaints.length}
            </p>
          </div>
        </div>
      </div>

      {/* ========== STATS BAR ========== */}
      <div className="stats-bar">
        <div className="stat-item">
          <span className="stat-value">{filmComplaints.length}</span>
          <span className="stat-label">Total Complaints</span>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <span className="stat-value">
            {filmComplaints.reduce((sum, c) => sum + c.urls_count, 0)}
          </span>
          <span className="stat-label">Total URLs</span>
        </div>
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
                <p className="complaint-description">{complaint.description}</p>
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

      {/* ========== STYLES ========== */}
      <style>{`
        /* ===== Container ===== */
        .film-details-container {
          padding: 20px;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* ===== Back Button ===== */
        .back-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: white;
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          color: #475569;
          font-weight: 500;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-bottom: 20px;
        }

        .back-btn:hover {
          background: #F8FAFC;
          border-color: #CBD5E1;
          transform: translateX(-2px);
        }

        /* ===== Film Header ===== */
        .film-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: white;
          padding: 20px 24px;
          border-radius: 12px;
          border: 1px solid #F1F5F9;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .film-header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .film-icon-large {
          width: 56px;
          height: 56px;
          background: #EEF2FF;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          color: #4F46E5;
        }

        .film-title {
          font-size: 24px;
          font-weight: 700;
          color: #0F172A;
          margin: 0 0 4px 0;
        }

        .film-subtitle {
          font-size: 14px;
          color: #64748B;
          margin: 0;
        }

        /* ===== Stats Bar ===== */
        .stats-bar {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 16px 20px;
          background: white;
          border-radius: 12px;
          border: 1px solid #F1F5F9;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .stat-value {
          font-size: 18px;
          font-weight: 700;
          color: #0F172A;
        }

        .stat-label {
          font-size: 13px;
          color: #64748B;
        }

        .stat-divider {
          width: 1px;
          height: 30px;
          background: #E2E8F0;
        }

        /* ===== Complaints List ===== */
        .complaints-list-wrapper {
          background: white;
          border-radius: 12px;
          border: 1px solid #F1F5F9;
          padding: 20px;
        }

        .complaints-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .complaint-item {
          background: #F8FAFC;
          border-radius: 10px;
          padding: 16px;
          transition: all 0.2s ease;
          border: 1px solid transparent;
        }

        .complaint-item:hover {
          background: white;
          border-color: #4F46E5;
          transform: translateX(4px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }

        .complaint-item-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;
        }

        .complaint-id {
          font-weight: 600;
          color: #4F46E5;
          font-size: 14px;
          font-family: 'Courier New', monospace;
        }

        .complaint-description {
          font-size: 14px;
          color: #475569;
          margin: 0 0 8px 0;
          line-height: 1.5;
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

        /* ===== Empty State ===== */
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 24px;
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

        /* ===== Responsive ===== */
        @media (max-width: 768px) {
          .film-details-container {
            padding: 12px;
          }

          .film-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .film-title {
            font-size: 20px;
          }

          .stats-bar {
            gap: 12px;
            padding: 12px 16px;
          }

          .stat-divider {
            display: none;
          }

          .complaints-list-wrapper {
            padding: 12px;
          }

          .complaint-item {
            padding: 12px;
          }

          .complaint-meta {
            flex-wrap: wrap;
            gap: 8px;
          }
        }

        @media (max-width: 480px) {
          .film-header-left {
            flex-direction: column;
            align-items: flex-start;
          }

          .film-icon-large {
            width: 48px;
            height: 48px;
            font-size: 24px;
          }

          .stats-bar {
            flex-wrap: wrap;
            gap: 6px 12px;
          }

          .stat-value {
            font-size: 16px;
          }

          .complaint-description {
            font-size: 13px;
          }
        }
      `}</style>
    </div>
  );
};

export default FilmDetails;

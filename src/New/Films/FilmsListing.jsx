import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const FilmsListing = () => {
  const navigate = useNavigate();
  // ============================================
  // STATIC DATA
  // ============================================
  const [filmsData, setFilmsData] = useState([
    {
      id: 1,
      name: "Dune: Part Two",
      total_complaints: 156,
      last_complaint_date: "2026-09-07",
      total_urls: 1234,
      pending_urls: 45,
    },
    {
      id: 2,
      name: "Deadpool & Wolverine",
      total_complaints: 234,
      last_complaint_date: "2026-09-06",
      total_urls: 2456,
      pending_urls: 78,
    },
    {
      id: 3,
      name: "Inside Out 2",
      total_complaints: 89,
      last_complaint_date: "2026-09-05",
      total_urls: 876,
      pending_urls: 23,
    },
    {
      id: 4,
      name: "Gladiator II",
      total_complaints: 312,
      last_complaint_date: "2026-09-04",
      total_urls: 3456,
      pending_urls: 156,
    },
    {
      id: 5,
      name: "Moana 2",
      total_complaints: 67,
      last_complaint_date: "2026-09-03",
      total_urls: 543,
      pending_urls: 12,
    },
    {
      id: 6,
      name: "Wicked",
      total_complaints: 189,
      last_complaint_date: "2026-09-02",
      total_urls: 1987,
      pending_urls: 67,
    },
    {
      id: 7,
      name: "The Batman Part II",
      total_complaints: 45,
      last_complaint_date: "2026-08-30",
      total_urls: 345,
      pending_urls: 8,
    },
    {
      id: 8,
      name: "Avatar 3",
      total_complaints: 278,
      last_complaint_date: "2026-08-28",
      total_urls: 2345,
      pending_urls: 89,
    },
    {
      id: 9,
      name: "The Fantastic Four",
      total_complaints: 34,
      last_complaint_date: "2026-08-25",
      total_urls: 234,
      pending_urls: 5,
    },
    {
      id: 10,
      name: "Spider-Man: Beyond the Spider-Verse",
      total_complaints: 423,
      last_complaint_date: "2026-08-22",
      total_urls: 5678,
      pending_urls: 234,
    },
    {
      id: 11,
      name: "Toy Story 5",
      total_complaints: 56,
      last_complaint_date: "2026-08-20",
      total_urls: 456,
      pending_urls: 15,
    },
    {
      id: 12,
      name: "Frozen 3",
      total_complaints: 123,
      last_complaint_date: "2026-08-18",
      total_urls: 987,
      pending_urls: 34,
    },
  ]);

  // ============================================
  // STATE
  // ============================================
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  //   const [selectedFilm, setSelectedFilm] = useState(null);
  //   const [showDetailModal, setShowDetailModal] = useState(false);

  // ============================================
  // FILTER LOGIC
  // ============================================
  const filteredFilms = filmsData.filter((film) => {
    const searchMatch = film.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return searchMatch;
  });

  // ============================================
  // PAGINATION
  // ============================================
  const totalPages = Math.ceil(filteredFilms.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentFilms = filteredFilms.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // ============================================
  // HANDLERS
  // ============================================
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleFilmClick = (film) => {
    // setSelectedFilm(film);
    // setShowDetailModal(true);
    navigate(`${film.id}`);
  };

  // ============================================
  // HELPER FUNCTIONS
  // ============================================
  const getDaysOld = (dateString) => {
    const today = new Date();
    const complaintDate = new Date(dateString);

    today.setHours(0, 0, 0, 0);
    complaintDate.setHours(0, 0, 0, 0);

    const diffTime = today - complaintDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  };

  const getDaysOldText = (dateString) => {
    const days = getDaysOld(dateString);

    if (days === 0) return "Today";
    if (days === 1) return "1 day ago";
    if (days === 2) return "2 days ago";
    if (days === 3) return "3 days ago";
    if (days === 4) return "4 days ago";
    if (days === 5) return "5 days ago";
    if (days === 6) return "6 days ago";
    if (days < 7) return `${days} days ago`;
    if (days === 7) return "1 week ago";
    if (days < 14) return `${Math.floor(days / 7)} weeks ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    return `${Math.floor(days / 365)} years ago`;
  };

  // ============================================
  // STATS
  // ============================================
  const totalFilms = filmsData.length;
  const totalComplaints = filmsData.reduce(
    (sum, f) => sum + f.total_complaints,
    0,
  );
  const totalUrls = filmsData.reduce((sum, f) => sum + f.total_urls, 0);
  const totalPending = filmsData.reduce((sum, f) => sum + f.pending_urls, 0);

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="films-listing-container">
      {/* ========== HEADER ========== */}
      <div className="listing-header">
        <div className="header-left">
          <h2 className="listing-title">
            <i className="bi bi-film"></i>
            Films Management
          </h2>
          <p className="listing-subtitle">
            View and manage all films with their complaint details
          </p>
        </div>
        <div className="header-right">
          {/* <button className="btn-primary">
            <i className="bi bi-plus-lg"></i>
            Add New Film
          </button> */}
        </div>
      </div>

      {/* ========== STATS BAR ========== */}
      <div className="stats-bar">
        <div className="stat-item">
          <span className="stat-value">{totalFilms}</span>
          <span className="stat-label">Total Films</span>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <span className="stat-value" style={{ color: "#4F46E5" }}>
            {totalComplaints.toLocaleString()}
          </span>
          <span className="stat-label">Total Complaints</span>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <span className="stat-value" style={{ color: "#059669" }}>
            {totalUrls.toLocaleString()}
          </span>
          <span className="stat-label">Total URLs</span>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <span className="stat-value" style={{ color: "#D97706" }}>
            {totalPending}
          </span>
          <span className="stat-label">Pending URLs</span>
        </div>
      </div>

      {/* ========== SEARCH ========== */}
      <div className="filters-section">
        <div className="search-wrapper">
          <i className="bi bi-search"></i>
          <input
            type="text"
            placeholder="Search by film name..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
          {searchTerm && (
            <button className="clear-search" onClick={() => setSearchTerm("")}>
              <i className="bi bi-x-circle"></i>
            </button>
          )}
        </div>
      </div>

      {/* ========== FILMS GRID ========== */}
      <div className="films-grid">
        {currentFilms.length === 0 ? (
          <div className="empty-state">
            <i className="bi bi-film"></i>
            <p>No films found</p>
            <span>Try adjusting your search terms</span>
          </div>
        ) : (
          currentFilms.map((film) => (
            <div
              key={film.id}
              className="film-card"
              onClick={() => handleFilmClick(film)}
            >
              <div className="film-card-header">
                <div className="film-icon">
                  <i className="bi bi-film"></i>
                </div>
                <div className="film-info">
                  <h4 className="film-name">{film.name}</h4>
                </div>
              </div>

              <div className="film-stats-grid">
                <div className="film-stat-item">
                  <span className="film-stat-value">
                    {film.total_complaints}
                  </span>
                  <span className="film-stat-label">Total Complaints</span>
                </div>
                <div className="film-stat-divider"></div>
                <div className="film-stat-item">
                  <span className="film-stat-value">
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
                <div className="film-last-complaint">
                  <i className="bi bi-calendar3"></i>
                  Last Complaint: {film.last_complaint_date}
                  <span className="days-ago">
                    ({getDaysOldText(film.last_complaint_date)})
                  </span>
                </div>
                <span className="film-view-btn">View Details →</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ========== PAGINATION ========== */}
      {filteredFilms.length > 0 && (
        <div className="pagination-section">
          <div className="pagination-info">
            Showing {startIndex + 1} -{" "}
            {Math.min(endIndex, filteredFilms.length)} of {filteredFilms.length}{" "}
            films
          </div>
          <div className="pagination-buttons">
            <button
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <i className="bi bi-chevron-left"></i>
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`pagination-btn ${currentPage === page ? "active" : ""}`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}
            <button
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <i className="bi bi-chevron-right"></i>
            </button>
          </div>
        </div>
      )}

      {/* ========== DETAIL MODAL ========== */}
      {/* {showDetailModal && selectedFilm && (
        <div
          className="modal-overlay"
          onClick={() => setShowDetailModal(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 className="modal-title">
                  <i className="bi bi-film"></i>
                  {selectedFilm.name}
                </h3>
                <p className="modal-subtitle">
                  Film Details & Complaint Summary
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
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Film ID</label>
                  <span>#{selectedFilm.id}</span>
                </div>
                <div className="detail-item">
                  <label>Total Complaints</label>
                  <span className="detail-highlight">
                    {selectedFilm.total_complaints}
                  </span>
                </div>
                <div className="detail-item">
                  <label>Total URLs</label>
                  <span>{selectedFilm.total_urls.toLocaleString()}</span>
                </div>
                <div className="detail-item">
                  <label>Pending URLs</label>
                  <span style={{ color: "#D97706", fontWeight: 600 }}>
                    {selectedFilm.pending_urls}
                  </span>
                </div>
                <div className="detail-item">
                  <label>Last Complaint</label>
                  <span>
                    {selectedFilm.last_complaint_date}
                    <span className="days-ago-modal">
                      ({getDaysOldText(selectedFilm.last_complaint_date)})
                    </span>
                  </span>
                </div>
              </div>

              <div className="detail-actions">
                <button className="btn-primary">
                  <i className="bi bi-eye"></i>
                  View All Complaints
                </button>
                <button className="btn-secondary">
                  <i className="bi bi-link-45deg"></i>
                  View URLs
                </button>
                <button className="btn-secondary">
                  <i className="bi bi-pencil"></i>
                  Edit Film
                </button>
              </div>
            </div>
          </div>
        </div>
      )} */}

      {/* ========== STYLES ========== */}
      <style>{`
        /* ===== Container ===== */
        .films-listing-container {
          animation: fadeIn 0.3s ease;
        }

        /* ===== Header ===== */
        .listing-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .listing-title {
          font-size: 24px;
          font-weight: 700;
          color: #0F172A;
          margin: 0 0 4px 0;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .listing-title i {
          color: #4F46E5;
        }

        .listing-subtitle {
          font-size: 14px;
          color: #64748B;
          margin: 0;
        }

        .header-right {
          display: flex;
          gap: 12px;
        }

        .btn-primary {
          padding: 8px 20px;
          background: #4F46E5;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-primary:hover {
          background: #4338CA;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
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
          font-size: 20px;
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

        /* ===== Search ===== */
        .filters-section {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 20px;
        }

        .search-wrapper {
          position: relative;
          flex: 1;
        }

        .search-wrapper i.bi-search {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #94A3B8;
        }

        .search-input {
          width: 100%;
          padding: 10px 40px 10px 42px;
          border: 1px solid #E2E8F0;
          border-radius: 10px;
          font-size: 14px;
          transition: all 0.2s ease;
          background: white;
        }

        .search-input:focus {
          outline: none;
          border-color: #4F46E5;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
        }

        .clear-search {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #94A3B8;
          cursor: pointer;
          font-size: 16px;
        }

        .clear-search:hover {
          color: #475569;
        }

        /* ===== Films Grid ===== */
        .films-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 16px;
          margin-bottom: 20px;
        }

        .film-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          border: 1px solid #F1F5F9;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .film-card:hover {
          border-color: #4F46E5;
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(79, 70, 229, 0.1);
        }

        .film-card-header {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          margin-bottom: 16px;
        }

        .film-icon {
          width: 48px;
          height: 48px;
          background: #EEF2FF;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          color: #4F46E5;
          flex-shrink: 0;
        }

        .film-info {
          flex: 1;
          min-width: 0;
        }

        .film-name {
          font-size: 16px;
          font-weight: 600;
          color: #0F172A;
          margin: 0;
          line-height: 1.3;
        }

        /* ===== Film Stats ===== */
        .film-stats-grid {
          display: grid;
          grid-template-columns: 1fr auto 1fr auto 1fr;
          align-items: center;
          gap: 4px;
          padding: 12px 0;
          border-top: 1px solid #F1F5F9;
          border-bottom: 1px solid #F1F5F9;
          margin-bottom: 12px;
        }

        .film-stat-item {
          text-align: center;
        }

        .film-stat-value {
          font-size: 18px;
          font-weight: 700;
          color: #0F172A;
          display: block;
        }

        .film-stat-label {
          font-size: 11px;
          color: #94A3B8;
          display: block;
          margin-top: 2px;
        }

        .film-stat-divider {
          width: 1px;
          height: 30px;
          background: #E2E8F0;
        }

        /* ===== Film Card Footer ===== */
        .film-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .film-last-complaint {
          font-size: 13px;
          color: #64748B;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .film-last-complaint i {
          color: #94A3B8;
        }

        .days-ago {
          font-size: 12px;
          color: #94A3B8;
          font-weight: 500;
        }

        .film-view-btn {
          font-size: 13px;
          color: #4F46E5;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .film-card:hover .film-view-btn {
          transform: translateX(4px);
        }

        /* ===== Empty State ===== */
        .empty-state {
          grid-column: 1 / -1;
          text-align: center;
          padding: 60px 24px;
          color: #94A3B8;
        }

        .empty-state i {
          font-size: 48px;
          color: #CBD5E1;
          display: block;
          margin-bottom: 12px;
        }

        .empty-state p {
          font-size: 16px;
          font-weight: 500;
          color: #64748B;
          margin: 0 0 4px 0;
        }

        .empty-state span {
          font-size: 14px;
        }

        /* ===== Pagination ===== */
        .pagination-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 0;
          flex-wrap: wrap;
          gap: 12px;
        }

        .pagination-info {
          font-size: 14px;
          color: #64748B;
        }

        .pagination-buttons {
          display: flex;
          gap: 4px;
        }

        .pagination-btn {
          padding: 6px 12px;
          border: 1px solid #E2E8F0;
          background: white;
          border-radius: 6px;
          font-size: 14px;
          color: #475569;
          cursor: pointer;
          transition: all 0.2s ease;
          min-width: 36px;
          text-align: center;
        }

        .pagination-btn:hover:not(:disabled) {
          background: #F8FAFC;
          border-color: #CBD5E1;
        }

        .pagination-btn.active {
          background: #4F46E5;
          color: white;
          border-color: #4F46E5;
        }

        .pagination-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
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
          max-width: 600px;
          width: 100%;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          animation: slideUp 0.3s ease;
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

        .detail-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 20px;
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

        .detail-highlight {
          font-size: 20px !important;
          font-weight: 700 !important;
          color: #4F46E5 !important;
        }

        .days-ago-modal {
          font-size: 12px;
          color: #94A3B8;
          font-weight: 400;
          margin-left: 6px;
        }

        .detail-actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .btn-secondary {
          padding: 8px 20px;
          border: 1px solid #E2E8F0;
          background: white;
          border-radius: 8px;
          font-weight: 500;
          font-size: 14px;
          color: #475569;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-secondary:hover {
          background: #F8FAFC;
          border-color: #CBD5E1;
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
        @media (max-width: 1024px) {
          .stats-bar {
            gap: 12px;
            padding: 12px 16px;
          }

          .stat-divider {
            display: none;
          }

          .films-grid {
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          }
        }

        @media (max-width: 768px) {
          .listing-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .header-right {
            width: 100%;
          }

          .header-right button {
            flex: 1;
            justify-content: center;
          }

          .stats-bar {
            flex-wrap: wrap;
            gap: 8px 16px;
          }

          .stat-item {
            gap: 4px;
          }

          .stat-value {
            font-size: 16px;
          }

          .films-grid {
            grid-template-columns: 1fr;
          }

          .film-stats-grid {
            grid-template-columns: 1fr auto 1fr;
            gap: 8px;
          }

          .film-stat-divider:last-child {
            display: none;
          }

          .detail-grid {
            grid-template-columns: 1fr;
          }

          .modal-content {
            max-width: 100%;
            margin: 12px;
          }

          .pagination-section {
            flex-direction: column;
            align-items: center;
          }
        }

        @media (max-width: 480px) {
          .stats-bar {
            padding: 12px;
          }

          .film-card {
            padding: 16px;
          }

          .film-stats-grid {
            grid-template-columns: 1fr 1fr 1fr;
          }

          .film-stat-divider {
            display: none;
          }

          .film-card-footer {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }

          .detail-actions {
            flex-direction: column;
          }

          .detail-actions button {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default FilmsListing;

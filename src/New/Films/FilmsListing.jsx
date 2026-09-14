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
      name: "Dune: Part Two Dune: Part Two Dune: Part Two Dune: Part Two",
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

      {/* ========== SEARCH ========== */}
      <div className="filters-section col-md-4">
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
                <div className="film-last-complaint">
                  <i className="bi bi-calendar3"></i>
                  {/* Last Complaint: {film.last_complaint_date} */}
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
    </div>
  );
};

export default FilmsListing;

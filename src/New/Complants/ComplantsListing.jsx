import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ComplaintsListing = () => {
  const navigate = useNavigate();
  // ============================================
  // STATIC DATA (with read status)
  // ============================================
  const [complaintsData, setComplaintsData] = useState([
    {
      id: "CMP-001",
      film_name: "Dune: Part Two",
      total_urls: 45,
      created_date: "2026-09-07",
      isRead: false, // Unread
    },
    {
      id: "CMP-002",
      film_name: "Dune: Part Two",
      total_urls: 32,
      created_date: "2026-09-06",
      isRead: true, // Read
    },
    {
      id: "CMP-003",
      film_name: "Dune: Part Two",
      total_urls: 12,
      created_date: "2026-09-05",
      isRead: false,
    },
    {
      id: "CMP-004",
      film_name: "Dune: Part Two",
      total_urls: 67,
      created_date: "2026-09-04",
      isRead: true,
    },
    {
      id: "CMP-005",
      film_name: "Deadpool & Wolverine",
      total_urls: 78,
      created_date: "2026-09-07",
      isRead: false,
    },
    {
      id: "CMP-006",
      film_name: "Deadpool & Wolverine",
      total_urls: 45,
      created_date: "2026-09-06",
      isRead: true,
    },
    {
      id: "CMP-007",
      film_name: "Inside Out 2",
      total_urls: 23,
      created_date: "2026-09-05",
      isRead: false,
    },
    {
      id: "CMP-008",
      film_name: "Gladiator II",
      total_urls: 156,
      created_date: "2026-09-03",
      isRead: false,
    },
    {
      id: "CMP-009",
      film_name: "Gladiator II",
      total_urls: 89,
      created_date: "2026-09-02",
      isRead: true,
    },
    {
      id: "CMP-010",
      film_name: "Gladiator II",
      total_urls: 34,
      created_date: "2026-09-01",
      isRead: false,
    },
    {
      id: "CMP-011",
      film_name: "Moana 2",
      total_urls: 12,
      created_date: "2026-08-30",
      isRead: false,
    },
    {
      id: "CMP-012",
      film_name: "Wicked",
      total_urls: 67,
      created_date: "2026-08-28",
      isRead: true,
    },
  ]);

  // ============================================
  // STATE
  // ============================================
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showMarkAsReadDialog, setShowMarkAsReadDialog] = useState(false);
  const [pendingComplaintId, setPendingComplaintId] = useState(null);

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

  const getDaysOldColor = (dateString) => {
    const days = getDaysOld(dateString);

    if (days <= 1) return "days-old-fresh";
    if (days <= 3) return "days-old-medium";
    if (days <= 7) return "days-old-old";
    return "days-old-very-old";
  };

  // ============================================
  // FILTER LOGIC
  // ============================================
  const filteredComplaints = complaintsData.filter((complaint) => {
    const searchMatch =
      complaint.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.film_name.toLowerCase().includes(searchTerm.toLowerCase());

    return searchMatch;
  });

  // Sort by date (newest first)
  const sortedComplaints = [...filteredComplaints].sort((a, b) => {
    return new Date(b.created_date) - new Date(a.created_date);
  });

  // ============================================
  // PAGINATION
  // ============================================
  const totalPages = Math.ceil(sortedComplaints.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentComplaints = sortedComplaints.slice(startIndex, endIndex);

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

  const handleViewClick = (complaint, e) => {
    e.stopPropagation();
    setPendingComplaintId(complaint.id);

    if (!complaint.isRead) {
      setShowMarkAsReadDialog(true);
    } else {
      // If already read, just show details
      setSelectedComplaint(complaint);
      // setShowDetailModal(true);
    }
  };

  const handleMarkAsRead = () => {
    // Mark complaint as read
    setComplaintsData((prevData) =>
      prevData.map((complaint) =>
        complaint.id === pendingComplaintId
          ? { ...complaint, isRead: true }
          : complaint,
      ),
    );

    // Close dialog and show details
    setShowMarkAsReadDialog(false);
    const complaint = complaintsData.find((c) => c.id === pendingComplaintId);
    if (complaint) {
      // setSelectedComplaint({ ...complaint, isRead: true });
      navigate(`${complaint.id}`);
      setShowDetailModal(true);
    }
    setPendingComplaintId(null);
  };

  const handleSkipMarkAsRead = () => {
    // Close dialog and show details without marking
    setShowMarkAsReadDialog(false);
    const complaint = complaintsData.find((c) => c.id === pendingComplaintId);
    if (complaint) {
      // setSelectedComplaint(complaint);
      navigate(`${complaint.id}`);
      setShowDetailModal(true);
    }
    setPendingComplaintId(null);
  };

  const handleRowClick = (complaint) => {
    // If unread, show dialog first
    if (!complaint.isRead) {
      setPendingComplaintId(complaint.id);
      setShowMarkAsReadDialog(true);
    } else {
      setSelectedComplaint(complaint);
      setShowDetailModal(true);
    }
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="films-listing-container">
      {/* ========== HEADER ========== */}
      <div className="listing-header">
        <div className="header-left">
          <h2 className="listing-title">
            <i className="bi bi-file-text"></i>
            Complaints Management
          </h2>
          <p className="listing-subtitle">
            Manage and track all complaints across films
          </p>
        </div>
        <div className="header-right">
          {/* <button className="btn-primary">
            <i className="bi bi-plus-lg"></i>
            New Complaint
          </button> */}
        </div>
      </div>

      {/* ========== STATS BAR ========== */}
      <div className="stats-bar">
        <div className="stat-item">
          <span className="stat-value">{complaintsData.length}</span>
          <span className="stat-label">Total Complaints</span>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <span className="stat-value" style={{ color: "#EF4444" }}>
            {complaintsData.filter((c) => !c.isRead).length}
          </span>
          <span className="stat-label">Unread</span>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <span className="stat-value" style={{ color: "#10B981" }}>
            {complaintsData.filter((c) => c.isRead).length}
          </span>
          <span className="stat-label">Read</span>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <span className="stat-value days-old-fresh">
            {
              complaintsData.filter((c) => getDaysOld(c.created_date) <= 1)
                .length
            }
          </span>
          <span className="stat-label">New (0-1 days)</span>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <span className="stat-value days-old-medium">
            {
              complaintsData.filter(
                (c) =>
                  getDaysOld(c.created_date) > 1 &&
                  getDaysOld(c.created_date) <= 3,
              ).length
            }
          </span>
          <span className="stat-label">2-3 days</span>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <span className="stat-value days-old-old">
            {
              complaintsData.filter(
                (c) =>
                  getDaysOld(c.created_date) > 3 &&
                  getDaysOld(c.created_date) <= 7,
              ).length
            }
          </span>
          <span className="stat-label">4-7 days</span>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <span className="stat-value days-old-very-old">
            {
              complaintsData.filter((c) => getDaysOld(c.created_date) > 7)
                .length
            }
          </span>
          <span className="stat-label">7+ days</span>
        </div>
      </div>

      {/* ========== SEARCH ========== */}
      <div className="filters-section col-md-4">
        <div className="search-wrapper">
          <i className="bi bi-search"></i>
          <input
            type="text"
            placeholder="Search by ID or Film Name..."
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

      {/* ========== TABLE ========== */}
      <div className="table-wrapper">
        <table className="complaints-table">
          <thead>
            <tr>
              {/* <th>Status</th> */}
              <th>Complaint ID</th>
              <th>Film Name</th>
              <th>Total URLs</th>
              <th>Created Date</th>
              <th>Days Old</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {currentComplaints.length === 0 ? (
              <tr>
                <td colSpan="7" className="empty-state">
                  <i className="bi bi-inbox"></i>
                  <p>No complaints found</p>
                  <span>Try adjusting your search terms</span>
                </td>
              </tr>
            ) : (
              currentComplaints.map((complaint) => (
                <tr
                  key={complaint.id}
                  onClick={() => handleRowClick(complaint)}
                  className={!complaint.isRead ? "unread-row" : ""}
                >
                  <td className="complaint-id-cell">
                    <span className="complaint-id-text">{complaint.id}</span>
                  </td>
                  <td className="film-name-cell">
                    <div className="film-name-wrapper">
                      {/* <div className="film-dot"></div> */}
                      {complaint.film_name}
                    </div>
                  </td>
                  <td>
                    <span className="urls-count">{complaint.total_urls}</span>
                  </td>
                  <td>{complaint.created_date}</td>
                  <td>
                    <span
                      className={`days-old-badge ${getDaysOldColor(complaint.created_date)}`}
                    >
                      <i
                        className={`bi bi-${getDaysOld(complaint.created_date) <= 1 ? "clock-history" : "calendar"} me-1`}
                      ></i>
                      {getDaysOldText(complaint.created_date)}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`status-dot ${complaint.isRead ? "read" : "unread"}`}
                    >
                      <i
                        className={`bi ${complaint.isRead ? "bi-envelope-open" : "bi-envelope"}`}
                        style={{
                          color: complaint.isRead ? "#000000" : "#EF4444",
                          fontSize: "1.2rem",
                        }}
                      ></i>
                    </span>
                  </td>
                  {/* <td>
                    <button
                      className="action-btn view-btn"
                      title="View Details"
                      onClick={(e) => handleViewClick(complaint, e)}
                    >
                      <i className="bi bi-eye"></i>
                    </button>
                    <button className="action-btn edit-btn" title="Edit">
                      <i className="bi bi-pencil"></i>
                    </button>
                  </td> */}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ========== PAGINATION ========== */}
      {sortedComplaints.length > 0 && (
        <div className="pagination-section">
          <div className="pagination-info">
            Showing {startIndex + 1} -{" "}
            {Math.min(endIndex, sortedComplaints.length)} of{" "}
            {sortedComplaints.length} complaints
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

      {/* ========== MARK AS READ DIALOG ========== */}
      {showMarkAsReadDialog && (
        <div
          className="modal-overlay"
          onClick={() => setShowMarkAsReadDialog(false)}
        >
          <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
            <div className="dialog-icon">
              <i className="bi bi-eye"></i>
            </div>
            <h3 className="dialog-title">Mark as Read?</h3>
            <p className="dialog-message">
              Do you want to mark this complaint as read before viewing?
            </p>
            <div className="dialog-actions">
              <button
                className="dialog-btn dialog-btn-primary"
                onClick={handleMarkAsRead}
              >
                <i className="bi bi-check-lg"></i>
                Yes, Mark as Read
              </button>
              <button
                className="dialog-btn dialog-btn-secondary"
                onClick={handleSkipMarkAsRead}
              >
                <i className="bi bi-eye"></i>
                View Without Marking
              </button>
              <button
                className="dialog-btn dialog-btn-danger"
                onClick={() => setShowMarkAsReadDialog(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========== DETAIL MODAL ========== */}
      {showDetailModal && selectedComplaint && (
        <div
          className="modal-overlay"
          onClick={() => setShowDetailModal(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 className="modal-title">
                  <i className="bi bi-file-text"></i>
                  Complaint {selectedComplaint.id}
                </h3>
                <p className="modal-subtitle">{selectedComplaint.film_name}</p>
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
                  <label>Complaint ID</label>
                  <span>{selectedComplaint.id}</span>
                </div>
                <div className="detail-item">
                  <label>Film Name</label>
                  <span>{selectedComplaint.film_name}</span>
                </div>
                <div className="detail-item">
                  <label>Total URLs</label>
                  <span>{selectedComplaint.total_urls}</span>
                </div>
                <div className="detail-item">
                  <label>Created Date</label>
                  <span>{selectedComplaint.created_date}</span>
                </div>
                <div className="detail-item">
                  <label>Days Old</label>
                  <span
                    className={`days-old-badge ${getDaysOldColor(selectedComplaint.created_date)}`}
                  >
                    <i
                      className={`bi bi-${getDaysOld(selectedComplaint.created_date) <= 1 ? "clock-history" : "calendar"} me-1`}
                    ></i>
                    {getDaysOldText(selectedComplaint.created_date)}
                  </span>
                </div>
                <div className="detail-item">
                  <label>Status</label>
                  <span
                    className={`status-badge ${selectedComplaint.isRead ? "status-read" : "status-unread"}`}
                  >
                    <i
                      className={`bi ${selectedComplaint.isRead ? "bi-check-circle" : "bi-circle"}`}
                    ></i>
                    {selectedComplaint.isRead ? "Read" : "Unread"}
                  </span>
                </div>
              </div>

              <div className="detail-actions">
                {!selectedComplaint.isRead && (
                  <button
                    className="btn-primary"
                    onClick={() => {
                      setComplaintsData((prevData) =>
                        prevData.map((c) =>
                          c.id === selectedComplaint.id
                            ? { ...c, isRead: true }
                            : c,
                        ),
                      );
                      setSelectedComplaint({
                        ...selectedComplaint,
                        isRead: true,
                      });
                    }}
                  >
                    <i className="bi bi-check-lg"></i>
                    Mark as Read
                  </button>
                )}
                <button className="btn-secondary">
                  <i className="bi bi-link-45deg"></i>
                  View URLs
                </button>
                <button className="btn-primary">
                  <i className="bi bi-pencil"></i>
                  Edit Complaint
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintsListing;

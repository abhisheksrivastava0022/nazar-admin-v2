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
    <div className="complaints-listing-container">
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
      <div className="filters-section">
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
              {/* <th>Action</th> */}
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
                  {/* <td>
                    <span
                      className={`status-dot ${complaint.isRead ? "read" : "unread"}`}
                    >
                      <i
                        className={`bi ${complaint.isRead ? "bi-check-circle" : "bi-circle"}`}
                      ></i>
                    </span>
                  </td> */}
                  <td className="complaint-id-cell">
                    <span className="complaint-id-text">{complaint.id}</span>
                  </td>
                  <td className="film-name-cell">
                    <div className="film-name-wrapper">
                      <div className="film-dot"></div>
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

      {/* ========== STYLES ========== */}
      <style>{`
        /* ===== Container ===== */
        .complaints-listing-container {
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

        .days-old-fresh { color: #10B981; }
        .days-old-medium { color: #F59E0B; }
        .days-old-old { color: #F97316; }
        .days-old-very-old { color: #EF4444; }

        /* ===== Filters ===== */
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

        /* ===== Table ===== */
        .table-wrapper {
          background: white;
          border-radius: 12px;
          border: 1px solid #F1F5F9;
          overflow: hidden;
          overflow-x: auto;
        }

        .complaints-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }

        .complaints-table thead {
          background: #535454;
        }

        .complaints-table th {
          padding: 14px 16px;
          text-align: left;
          font-weight: 600;
          color: #475569;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          border-bottom: 1px solid #E2E8F0;
          white-space: nowrap;
        }

        .complaints-table td {
          padding: 14px 16px;
          border-bottom: 1px solid #F1F5F9;
          color: #0F172A;
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .complaints-table tbody tr:hover {
          background: #F8FAFC;
        }

        .complaints-table tbody tr:last-child td {
          border-bottom: none;
        }

        .unread-row {
          background: #F0F7FF;
          border-left: 3px solid #4F46E5;
        }

        .unread-row:hover {
          background: #E8F0FE;
        }

        /* ===== Status Dot ===== */
        .status-dot {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
        }

        .status-dot.unread {
          color: #4F46E5;
          animation: pulse 2s infinite;
        }

        .status-dot.read {
          color: #10B981;
        }

        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }

        /* ===== Status Badge ===== */
        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
        }

        .status-badge.status-unread {
          background: #EEF2FF;
          color: #4F46E5;
        }

        .status-badge.status-read {
          background: #D1FAE5;
          color: #059669;
        }

        .complaint-id-cell {
          font-weight: 600;
          color: #4F46E5;
        }

        .complaint-id-text {
          font-family: 'Courier New', monospace;
          font-weight: 600;
        }

        .film-name-wrapper {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .film-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #4F46E5;
          flex-shrink: 0;
        }

        .urls-count {
          font-weight: 600;
          color: #0F172A;
        }

        /* ===== Days Old Badge ===== */
        .days-old-badge {
          display: inline-flex;
          align-items: center;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          white-space: nowrap;
        }

        .days-old-badge.days-old-fresh {
          background: #D1FAE5;
          color: #059669;
        }

        .days-old-badge.days-old-medium {
          background: #FEF3C7;
          color: #D97706;
        }

        .days-old-badge.days-old-old {
          background: #FED7AA;
          color: #EA580C;
        }

        .days-old-badge.days-old-very-old {
          background: #FEE2E2;
          color: #DC2626;
        }

        /* ===== Action Buttons ===== */
        {/* .action-btn {
          width: 32px;
          height: 32px;
          border: none;
          background: transparent;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
          color: #94A3B8;
          font-size: 14px;
        }

        .action-btn:hover {
          background: #F1F5F9;
          color: #0F172A;
        } */}

        .view-btn:hover {
          background: #EEF2FF;
          color: #4F46E5;
        }

        .edit-btn:hover {
          background: #FEF3C7;
          color: #D97706;
        }

        /* ===== Empty State ===== */
        .empty-state {
          text-align: center;
          padding: 60px 24px !important;
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

        /* ===== Dialog ===== */
        .dialog-content {
          background: white;
          border-radius: 16px;
          max-width: 420px;
          width: 100%;
          padding: 32px 28px;
          text-align: center;
          animation: slideUp 0.3s ease;
        }

        .dialog-icon {
          width: 64px;
          height: 64px;
          background: #EEF2FF;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
          font-size: 28px;
          color: #4F46E5;
        }

        .dialog-title {
          font-size: 20px;
          font-weight: 700;
          color: #0F172A;
          margin: 0 0 8px 0;
        }

        .dialog-message {
          font-size: 14px;
          color: #64748B;
          margin: 0 0 24px 0;
          line-height: 1.5;
        }

        .dialog-actions {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .dialog-btn {
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .dialog-btn-primary {
          background: #4F46E5;
          color: white;
        }

        .dialog-btn-primary:hover {
          background: #4338CA;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
        }

        .dialog-btn-secondary {
          background: #F1F5F9;
          color: #475569;
        }

        .dialog-btn-secondary:hover {
          background: #E2E8F0;
        }

        .dialog-btn-danger {
          background: transparent;
          color: #94A3B8;
        }

        .dialog-btn-danger:hover {
          background: #F1F5F9;
          color: #64748B;
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

        .btn-danger {
          padding: 8px 20px;
          background: #EF4444;
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

        .btn-danger:hover {
          background: #DC2626;
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

          .complaints-table {
            font-size: 13px;
          }

          .complaints-table th,
          .complaints-table td {
            padding: 10px 12px;
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

          {/* .action-btn {
            width: 28px;
            height: 28px;
            font-size: 12px;
          } */}
        }

        @media (max-width: 480px) {
          .stats-bar {
            padding: 12px;
          }

          .complaints-table {
            font-size: 12px;
          }

          .complaints-table th,
          .complaints-table td {
            padding: 8px 10px;
          }

          .detail-actions {
            flex-direction: column;
          }

          .detail-actions button {
            width: 100%;
            justify-content: center;
          }

          .dialog-content {
            padding: 24px 20px;
            margin: 12px;
          }

          .dialog-actions {
            gap: 6px;
          }
        }
      `}</style>
    </div>
  );
};

export default ComplaintsListing;

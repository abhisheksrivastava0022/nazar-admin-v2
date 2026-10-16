import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiClient from "../../API/ApiClient";

const ComplaintsListing = () => {
  const navigate = useNavigate();
  const { getRequestApi, postRequestApi } = ApiClient();

  // ============================================
  // STATE
  // ============================================
  const [complaintsData, setComplaintsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showMarkAsReadDialog, setShowMarkAsReadDialog] = useState(false);
  const [pendingComplaintId, setPendingComplaintId] = useState(null);
  const [paginationInfo, setPaginationInfo] = useState({ total: 0, totalPages: 1 });

  // ============================================
  // FETCH API DATA
  // ============================================
  useEffect(() => {
    loadData(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const loadData = async (page, search = "") => {
    try {
      setLoading(true);
      // Pass both page and search parameters to the backend API
      const response = await getRequestApi(`api/producer/complaints?page=${page}&search=${encodeURIComponent(search)}`);

      if (response && response.status && response.data) {
        const formattedData = response.data.map((item) => ({
          id: item.id,
          originalId: item.id,
          film_name: item.producer_movie?.title || item.title || "Unknown Film",
          total_urls: item.complaint_urls ? item.complaint_urls.length : 0,
          created_date: item.createdAt ? item.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
          isRead: item.read_complaint === 1,
          complaint_urls: item.complaint_urls || [],
          description: item.description
        }));

        setComplaintsData(formattedData);
        if (response.pagination) {
          setPaginationInfo({
            total: response.pagination.total,
            totalPages: response.pagination.totalPages || 1
          });
        }
      }
    } catch (error) {
      console.error("Error fetching complaints:", error);
    } finally {
      setLoading(false);
    }
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

  const getDaysOldColor = (dateString) => {
    const days = getDaysOld(dateString);

    if (days <= 1) return "days-old-fresh";
    if (days <= 3) return "days-old-medium";
    if (days <= 7) return "days-old-old";
    return "days-old-very-old";
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // ============================================
  // HANDLERS
  // ============================================
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to page 1 on new search query
  };

  const handleRowClick = (complaint) => {
    if (!complaint.isRead) {
      setPendingComplaintId(complaint.id);
      setShowMarkAsReadDialog(true);
    } else {
      setSelectedComplaint(complaint);
      setShowDetailModal(true);
    }
  };

  const handleMarkAsRead = async (id) => {
    const targetId = id || pendingComplaintId;
    if (!targetId) return;

    try {
      // Optional: Add a loading state if you want to show a spinner on the button
      const response = await postRequestApi(`api/producer/complaints/markread/${targetId}`);

      // Check if the API response is successful
      if (response && response.status) {
        // Update local state to mark as read
        setComplaintsData((prevData) =>
          prevData.map((complaint) =>
            complaint.id === targetId
              ? { ...complaint, isRead: true }
              : complaint
          )
        );
      } else {
        console.warn("Server responded, but status was not successful:", response);
      }
    } catch (error) {
      console.error("Error marking complaint as read:", error);
      // TODO: Add a toast notification or alert for the user here if needed
    } finally {
      // Always close dialog and cleanup pending state
      setShowMarkAsReadDialog(false);

      const complaint = complaintsData.find((c) => c.id === targetId);
      if (complaint) {
        navigate(`${complaint.originalId || complaint.id}`);
        setShowDetailModal(true);
      }

      setPendingComplaintId(null);
    }
  };

  const handleSkipMarkAsRead = () => {
    setShowMarkAsReadDialog(false);
    const complaint = complaintsData.find((c) => c.id === pendingComplaintId);
    if (complaint) {
      navigate(`${complaint.originalId || complaint.id}`);
      setShowDetailModal(true);
    }
    setPendingComplaintId(null);
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
      </div>

      {/* ========== STATS BAR ========== */}
      <div className="stats-bar">
        <div className="stat-item">
          <span className="stat-value">{paginationInfo.total}</span>
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
            {complaintsData.filter((c) => getDaysOld(c.created_date) <= 1).length}
          </span>
          <span className="stat-label">New (0-1 days)</span>
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
              <th>Complaint ID</th>
              <th>Film Name</th>
              <th>Total URLs</th>
              <th>Created Date</th>
              <th>Days Old</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="empty-state">
                  <p>Loading complaints...</p>
                </td>
              </tr>
            ) : complaintsData.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-state">
                  <i className="bi bi-inbox"></i>
                  <p>No complaints found</p>
                  <span>Try adjusting your search terms</span>
                </td>
              </tr>
            ) : (
              complaintsData.map((complaint) => (
                <tr
                  key={complaint.id}
                  onClick={() => handleRowClick(complaint)}
                  className={!complaint.isRead ? "unread-row" : ""}
                >
                  <td className="complaint-id-cell">
                    <span className="complaint-id-text">{complaint.id}</span>
                  </td>
                  <td className="film-name-cell">
                    <div className="film-name-wrapper">{complaint.film_name}</div>
                  </td>
                  <td>
                    <span className="urls-count">{complaint.total_urls}</span>
                  </td>
                  <td>{complaint.created_date}</td>
                  <td>
                    <span className={`days-old-badge ${getDaysOldColor(complaint.created_date)}`}>
                      <i className={`bi bi-${getDaysOld(complaint.created_date) <= 1 ? "clock-history" : "calendar"} me-1`}></i>
                      {getDaysOldText(complaint.created_date)}
                    </span>
                  </td>
                  <td>
                    <span className={`status-dot ${complaint.isRead ? "read" : "unread"}`}>
                      <i
                        className={`bi ${complaint.isRead ? "bi-envelope-open" : "bi-envelope"}`}
                        style={{
                          color: complaint.isRead ? "#000000" : "#EF4444",
                          fontSize: "1.2rem",
                        }}
                      ></i>
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ========== PAGINATION ========== */}
      {paginationInfo.totalPages > 1 && (
        <div className="pagination-section">
          <div className="pagination-info">
            Page {currentPage} of {paginationInfo.totalPages}
          </div>
          <div className="pagination-buttons">
            <button
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <i className="bi bi-chevron-left"></i>
            </button>
            {Array.from({ length: paginationInfo.totalPages }, (_, i) => i + 1).map((page) => (
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
              disabled={currentPage === paginationInfo.totalPages}
            >
              <i className="bi bi-chevron-right"></i>
            </button>
          </div>
        </div>
      )}

      {/* ========== MARK AS READ DIALOG ========== */}
      {showMarkAsReadDialog && (
        <div className="modal-overlay" onClick={() => setShowMarkAsReadDialog(false)}>
          <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
            <div className="dialog-icon">
              <i className="bi bi-eye"></i>
            </div>
            <h3 className="dialog-title">Mark as Read?</h3>
            <p className="dialog-message">
              Do you want to mark this complaint as read before viewing?
            </p>
            <div className="dialog-actions">
              <button className="dialog-btn dialog-btn-primary" onClick={handleMarkAsRead}>
                <i className="bi bi-check-lg"></i> Yes, Mark as Read
              </button>
              <button className="dialog-btn dialog-btn-secondary" onClick={handleSkipMarkAsRead}>
                <i className="bi bi-eye"></i> View Without Marking
              </button>
              <button className="dialog-btn dialog-btn-danger" onClick={() => setShowMarkAsReadDialog(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========== DETAIL MODAL ========== */}
      {showDetailModal && selectedComplaint && (
        <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 className="modal-title">
                  <i className="bi bi-file-text"></i> Complaint {selectedComplaint.id}
                </h3>
                <p className="modal-subtitle">{selectedComplaint.film_name}</p>
              </div>
              <button className="modal-close" onClick={() => setShowDetailModal(false)}>
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
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintsListing;
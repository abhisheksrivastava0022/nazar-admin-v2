import React, { useEffect, useState } from 'react'
import ApiClient from '../../API/ApiClient';
import { useNavigate } from 'react-router-dom';

const ComplantsView = ({ statsBar, searching, pagination }) => {
    const navigate = useNavigate();
    const { getRequestApi, postRequestApi } = ApiClient();

    // ============================================
    // STATE
    // ============================================
    const [complaintsData, setComplaintsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
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
        return Math.floor(diffTime / (1000 * 60 * 60 * 24));
    };

    const getDaysOldText = (dateString) => {
        const days = getDaysOld(dateString);

        if (days === 0) return "Today";
        if (days === 1) return "1 day ago";
        if (days < 7) return `${days} days ago`;
        if (days === 7) return "1 week ago";
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
        setCurrentPage(1);
    };

    const handleRowClick = (complaint) => {
        // If already read, bypass confirmation dialog completely and go straight to details
        if (complaint.isRead) {
            setSelectedComplaint(complaint);
            navigate(`/complants/${complaint.originalId || complaint.id}`);
            setShowDetailModal(true);
        } else {
            // If unread, prompt user with the Mark as Read dialog
            setPendingComplaintId(complaint.id);
            setShowMarkAsReadDialog(true);
        }
    };

    const handleMarkAsRead = async () => {
        if (!pendingComplaintId) return;

        try {
            setIsSubmitting(true);
            const response = await postRequestApi(`api/producer/complaints/markread/${pendingComplaintId}`);

            if (response && response.status) {
                setComplaintsData((prevData) =>
                    prevData.map((complaint) =>
                        complaint.id === pendingComplaintId
                            ? { ...complaint, isRead: true }
                            : complaint
                    )
                );
            }
        } catch (error) {
            console.error("Error marking complaint as read:", error);
        } finally {
            setIsSubmitting(false);
            setShowMarkAsReadDialog(false);

            const complaint = complaintsData.find((c) => c.id === pendingComplaintId);
            if (complaint) {
                setSelectedComplaint(complaint);
                navigate(`/complants/${complaint.originalId || complaint.id}`);
                setShowDetailModal(true);
            }
            setPendingComplaintId(null);
        }
    };

    const handleSkipMarkAsRead = () => {
        setShowMarkAsReadDialog(false);
        const complaint = complaintsData.find((c) => c.id === pendingComplaintId);
        if (complaint) {
            setSelectedComplaint(complaint);
            navigate(`/complants/${complaint.originalId || complaint.id}`);
            setShowDetailModal(true);
        }
        setPendingComplaintId(null);
    };

    return (
        <>

            {statsBar && (
                < div className="stats-bar">
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
                </div >)
            }

            {
                searching && (
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
                )
            }

            {/* ========== TABLE ========== */}
            <div className="table-wrapper mb-4">
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
            {/* PAGINATION */}
            {
                pagination && paginationInfo.totalPages > 0 && (
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
                )
            }

            {/* ========== MARK AS READ DIALOG ========== */}
            {
                showMarkAsReadDialog && (
                    <div className="modal-overlay" onClick={() => !isSubmitting && setShowMarkAsReadDialog(false)}>
                        <div className="dialog-content" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
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
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Marking...
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-check-lg"></i> Yes, Mark as Read
                                        </>
                                    )}
                                </button>
                                <button
                                    className="dialog-btn dialog-btn-secondary"
                                    onClick={handleSkipMarkAsRead}
                                    disabled={isSubmitting}
                                >
                                    <i className="bi bi-eye"></i> View Without Marking
                                </button>
                                <button
                                    className="dialog-btn dialog-btn-danger"
                                    onClick={() => setShowMarkAsReadDialog(false)}
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* ========== DETAIL MODAL ========== */}
            {
                showDetailModal && selectedComplaint && (
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
                )
            }
        </>
    )
}

export default ComplantsView

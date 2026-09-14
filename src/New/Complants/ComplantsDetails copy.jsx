import React from "react";

const ComplaintDetails = ({ complaint, film, onBack }) => {
  // ============================================
  // STATIC DATA (for demo purposes)
  // ============================================
  const complaintDetails = {
    id: complaint?.id || "CMP-001",
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
  };

  // ============================================
  // HELPER FUNCTIONS
  // ============================================
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "status-pending";
      case "approved":
        return "status-approved";
      case "rejected":
        return "status-rejected";
      case "compliant":
        return "status-compliant";
      case "not compliant":
        return "status-not-compliant";
      default:
        return "";
    }
  };

  // ============================================
  // RENDER
  // ============================================
  return (
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
      {/* ========== BACK BUTTON ========== */}
      <button className="back-btn" onClick={onBack}>
        <i className="bi bi-arrow-left"></i>
        Back to Complaints
      </button>

      {/* ========== HEADER ========== */}
      <div className="details-header">
        <div className="header-left">
          <div className="header-icon">
            <i className="bi bi-file-text"></i>
          </div>
          <div>
            <h2 className="header-title">Complaint {complaintDetails.id}</h2>
            <p className="header-subtitle">
              {film?.name || "Film Name"} •
              <span
                className={`status-badge ${getStatusColor(complaintDetails.status)}`}
              >
                {complaintDetails.status}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* ========== DETAILS GRID ========== */}
      <div className="details-grid">
        <div className="detail-item">
          <label>Complaint ID</label>
          <span>{complaintDetails.id}</span>
        </div>
        <div className="detail-item">
          <label>Status</label>
          <span
            className={`status-badge ${getStatusColor(complaintDetails.status)}`}
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

      {/* ========== DESCRIPTION ========== */}
      <div className="detail-section">
        <h4>
          <i className="bi bi-text-paragraph"></i>
          Description
        </h4>
        <p>{complaintDetails.description}</p>
      </div>

      {/* ========== EVIDENCE ========== */}
      {complaintDetails.evidence && (
        <div className="detail-section">
          <h4>
            <i className="bi bi-image"></i>
            Evidence
          </h4>
          <p>{complaintDetails.evidence}</p>
        </div>
      )}

      {/* ========== COURT ORDER ========== */}
      {complaintDetails.court_order && (
        <div className="detail-section">
          <h4>
            <i className="bi bi-file-pdf"></i>
            Court Order
          </h4>
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

      {/* ========== URLS ========== */}
      <div className="detail-section">
        <h4>
          <i className="bi bi-link-45deg"></i>
          URLs ({complaintDetails.urls?.length || 0})
        </h4>
        {complaintDetails.urls?.length === 0 ? (
          <p className="text-muted">No URLs found</p>
        ) : (
          <div className="urls-list">
            {complaintDetails.urls.map((url, index) => (
              <div key={index} className="url-item">
                <span className="url-number">#{index + 1}</span>
                <a href={url.url} target="_blank" rel="noopener noreferrer">
                  {url.url}
                </a>
                <span className={`url-status ${getStatusColor(url.status)}`}>
                  {url.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ========== STYLES ========== */}
      <style>{`
        /* ===== Container ===== */
        .complaint-details-container {
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

        /* ===== Header ===== */
        .details-header {
          background: white;
          padding: 20px 24px;
          border-radius: 12px;
          border: 1px solid #F1F5F9;
          margin-bottom: 20px;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .header-icon {
          width: 56px;
          height: 56px;
          background: #EEF2FF;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          color: #0877F3;
        }

        .header-title {
          font-size: 24px;
          font-weight: 700;
          color: #0F172A;
          margin: 0 0 4px 0;
        }

        .header-subtitle {
          font-size: 14px;
          color: #64748B;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        /* ===== Status Badge ===== */
        .status-badge {
          display: inline-block;
          padding: 2px 12px;
          border-radius: 20px;
          font-size: 12px;
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

        .status-badge.status-compliant {
          background: #D1FAE5;
          color: #059669;
        }

        .status-badge.status-not-compliant {
          background: #FEE2E2;
          color: #DC2626;
        }

        /* ===== Details Grid ===== */
        .details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          background: white;
          padding: 20px 24px;
          border-radius: 12px;
          border: 1px solid #F1F5F9;
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

        /* ===== Detail Section ===== */
        .detail-section {
          background: white;
          padding: 20px 24px;
          border-radius: 12px;
          border: 1px solid #F1F5F9;
          margin-bottom: 20px;
        }

        .detail-section:last-child {
          margin-bottom: 0;
        }

        .detail-section h4 {
          font-size: 16px;
          font-weight: 600;
          color: #0F172A;
          margin: 0 0 12px 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .detail-section h4 i {
          color: #0877F3;
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
          color: #0877F3;
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
          color: #0877F3;
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

        /* ===== Text Muted ===== */
        .text-muted {
          color: #94A3B8;
          margin: 0;
        }

        /* ===== Responsive ===== */
        @media (max-width: 768px) {
          .complaint-details-container {
            padding: 12px;
          }

          .details-header {
            padding: 16px 20px;
          }

          .header-left {
            flex-direction: column;
            align-items: flex-start;
          }

          .header-title {
            font-size: 20px;
          }

          .details-grid {
            grid-template-columns: 1fr 1fr;
            padding: 16px 20px;
          }

          .detail-section {
            padding: 16px 20px;
          }

          .court-order {
            flex-wrap: wrap;
          }

          .court-order-size {
            margin-left: 0;
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

        @media (max-width: 480px) {
          .header-icon {
            width: 48px;
            height: 48px;
            font-size: 24px;
          }

          .details-grid {
            grid-template-columns: 1fr;
            padding: 12px 16px;
          }

          .detail-section {
            padding: 12px 16px;
          }

          .header-subtitle {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
};

export default ComplaintDetails;

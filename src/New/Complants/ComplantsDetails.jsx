import React from "react";

const ComplaintDetails = ({ complaint, film, onBack }) => {
  // ============================================
  // STATIC DATA (for demo purposes)
  // ============================================
  const complaintDetails = {
    id: complaint?.id || "CMP-001",
    filmName: "Dummy Dummy",
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
    <>
      <div className="film-details-container">
        {/* ========== HEADER ========== */}
        <div className="listing-header">
          <div className="header-left">
            <h2 className="listing-title">
              <i className="bi bi-file-text"></i>
              Complaint {complaintDetails.id}
            </h2>
            <p className="listing-subtitle">
              Film :- anksvnlkn {film?.name || "Film  anksvnlkn"} •
            </p>
          </div>
          <div className="header-right">
            <button className="back-btn" onClick={onBack}>
              <i className="bi bi-arrow-left"></i>
              Back to
            </button>
          </div>
        </div>

        {/* ========== DETAILS GRID ========== */}
        <div className="details-grid">
          <div className="detail-item">
            <label>Film Name</label>
            <span>{complaintDetails.filmName}</span>
          </div>
          <div className="detail-item">
            <label>Total URLs</label>
            <span>{complaintDetails.urls?.length || 0}</span>
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
        <div className="row">
          {complaintDetails.evidence && (
            <div className="col-md-6">
              <div className="detail-section ">
                <h4>
                  <i className="bi bi-file-pdf"></i>
                  Evidence
                </h4>
                <div className="court-order">
                  <i className="bi bi-file-pdf"></i>
                  <a
                    href={complaintDetails.court_order}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Evidence
                  </a>
                  <span className="court-order-size">(PDF, 2.4 MB)</span>
                </div>
              </div>
            </div>
          )}

          {/* ========== COURT ORDER ========== */}
          {complaintDetails.court_order && (
            <div className="col-md-6">
              <div className="detail-section ">
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
            </div>
          )}
        </div>
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
      </div>
    </>
  );
};

export default ComplaintDetails;

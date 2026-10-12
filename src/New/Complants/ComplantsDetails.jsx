import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ApiClient from "../../API/ApiClient";

const ComplaintDetails = ({ complaint, film, onBack }) => {
  const { id } = useParams(); // Get ID from URL if editing

  const BASE_URL_API = `${import.meta.env.VITE_BASE_URL}/evidence`;

  const { getRequestApi } = ApiClient();

  const [data, setData] = useState();

  const loadData = async () => {
    try {
      const response = await getRequestApi(
        `api/producer/complaint/details/${id}`,
      );
      if (response.status) {
        setData(response.data);
      }
    } catch (error) {
      console.warn(error);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

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
  const STATUS_MAP = {
    1: { label: "Pending URL", className: "status-pending" },
    2: { label: "Nodal Clarification", className: "status-clarification" },
    3: { label: "Forwarded to 14C", className: "status-forwarded" },
    4: { label: "14C Clarification", className: "status-clarification" },
    5: { label: "Compliance", className: "status-compliant" },
    6: { label: "Note Compliance", className: "status-note" },
    7: { label: "Get Clarification", className: "status-clarification" },
    8: { label: "Processed", className: "status-processed" },
  };

  const getStatusColor = (status) => STATUS_MAP[status]?.className ?? "";

  const getStatusLabel = (status) => STATUS_MAP[status]?.label ?? "Unknown";

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
              Complaint {data?.complaints?.id}
            </h2>
            <p className="listing-subtitle">
              Film :- {data?.producer_movie?.title || "Film Name"} •
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
            <span>{data?.producer_movie?.title || "Film Name"}</span>
          </div>
          <div className="detail-item">
            <label>Total URLs</label>
            <span>{data?.complaints?.complaint_urls?.length || 0}</span>
          </div>
          <div className="detail-item">
            <label>Created At</label>
            <span>
              {/* {data?.complaints?.createdAt} */}
              {new Date(data?.complaints.createdAt).toLocaleString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <div className="detail-item">
            <label>Updated At</label>
            <span>
              {" "}
              {new Date(data?.complaints.updatedAt).toLocaleString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>

        {/* ========== DESCRIPTION ========== */}
        <div className="detail-section">
          <h4>
            <i className="bi bi-text-paragraph"></i>
            Description
          </h4>
          <p>{data?.complaints?.description}</p>
        </div>

        {/* ========== EVIDENCE ========== */}
        <div className="row">
          {data?.complaints?.evidence && (
            <div className="col-md-6">
              <div className="detail-section ">
                <h4>
                  <i className="bi bi-file-pdf"></i>
                  Evidence
                </h4>
                <div className="court-order">
                  <i className="bi bi-file-pdf"></i>
                  <a
                    href={`${BASE_URL_API}/${data?.complaints?.evidence}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {data?.complaints?.evidence || "View Evidence"}
                  </a>
                  <span className="court-order-size">(PDF, 2.4 MB)</span>
                </div>
              </div>
            </div>
          )}

          {/* ========== COURT ORDER ========== */}
          {data?.complaints?.court_order && (
            <div className="col-md-6">
              <div className="detail-section ">
                <h4>
                  <i className="bi bi-file-pdf"></i>
                  Court Order
                </h4>
                <div className="court-order">
                  <i className="bi bi-file-pdf"></i>
                  <a
                    href={`${BASE_URL_API}/${data?.complaints?.court_order}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {data?.complaints?.court_order ||
                      "View Court Order Document"}
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
            URLs ({data?.complaints?.complaint_urls?.length || 0})
          </h4>

          {data?.complaints?.complaint_urls === 0 ? (
            <p className="text-muted">No URLs found</p>
          ) : (
            <div className="urls-list">
              {data?.complaints?.complaint_urls.map((url, index) => (
                <div key={index} className="url-item ">
                  <span className="url-number">#{index + 1}</span>
                  <a href={url.url} target="_blank" rel="noopener noreferrer">
                    {url.url}
                  </a>
                  <span className={`url-status ${getStatusColor(url.status)}`}>
                    {getStatusLabel(url.status)}
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

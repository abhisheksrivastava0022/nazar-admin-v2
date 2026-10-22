import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ApiClient from "../../API/ApiClient";

const ClarificationDetails = ({ onBack }) => {
  const { id } = useParams(); // Get ID from URL if editing

  const BASE_URL_API = `${import.meta.env.VITE_BASE_URL}/evidence`;

  const { getRequestApi, postRequestApi } = ApiClient();

  const [data, setData] = useState();

  const loadData = async () => {
    try {
      const response = await getRequestApi(
        `api/producer/complaint-url/details/${id}`,
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

  const handleSendAditionalInfo = async (id) => {
    // alert(id)
    try {
      const response = await postRequestApi(`api/request-i4c/send-additional-infomation`, {
        "complaint_url_id": Number(id)
      });

      console.log({ response })
    } catch (error) {
      console.error(error)
    }
  }


  const documents = data?.complaint?.documents ?? [];

  const evidenceDoc = documents.find(
    (doc) => doc.docType === "evidence"
  );

  const courtDoc = documents.find(
    (doc) => doc.docType === "court"
  );



  return (
    <>
      <div className="film-details-container">
        {/* ========== HEADER ========== */}
        <div className="listing-header">
          <div className="header-left">
            <h2 className="listing-title">
              <i className="bi bi-file-text"></i>
              Complaint {data?.complaint?.id}
            </h2>
            <p className="listing-subtitle">
              Film :- {data?.complaint?.title || "Film Name"} •
            </p>
          </div>
          <div className="header-right">
            <button className="back-btn" onClick={onBack}>
              <i className="bi bi-arrow-left"></i>
              Back to
            </button>
            {/* {data?.complaint?.status === 1 ? (<>
              <button className="back-btn" onClick={handleSendToI4C}>
                Send
                <i className="bi bi-arrow-right"></i>
              </button>
            </>) : (<>
              <div className="d-inline-flex align-items-center gap-2 p-2  rounded bg-success-subtle  text-success">
                <i className="bi bi-check-circle-fill"></i>
                <span className="fw-semibold small">Send to 14C</span>
              </div>
            </>)
            } */}

          </div>
        </div>

        {/* ========== DETAILS GRID ========== */}

        <div className="details-grid">

          <div className="detail-item">
            <label>Film Name</label>
            <span>{data?.complaint?.title || "Film Name"}</span>
          </div>

          <div className="detail-item">
            <label>Total URLs</label>
            <span>{data?.complaint?.complaint_urls?.length || 0}</span>
          </div>

          <div className="detail-item">
            <label>Created At</label>
            <span>
              {/* {data?.complaints?.createdAt} */}
              {new Date(data?.complaint?.createdAt).toLocaleString("en-IN", {
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
              {new Date(data?.complaint?.updatedAt).toLocaleString("en-IN", {
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
              {new Date(data?.complaint?.updatedAt).toLocaleString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>

        </div>


        {/* ========== EVIDENCE ========== */}
        <div className="row">
          {/* Evidence Document */}
          {evidenceDoc && (
            <div className="col-md-6">
              <div className="detail-section">
                <h4>
                  <i className="bi bi-file-pdf"></i>
                  Evidence
                </h4>

                <div className="court-order">
                  <i className="bi bi-file-pdf"></i>
                  <a
                    href={`${BASE_URL_API}/${evidenceDoc.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {evidenceDoc.name || "View Evidence"}
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Court Order Document */}
          {courtDoc && (
            <div className="col-md-6">
              <div className="detail-section">
                <h4>
                  <i className="bi bi-file-pdf"></i>
                  Court Order
                </h4>

                <div className="court-order">
                  <i className="bi bi-file-pdf"></i>
                  <a
                    href={`${BASE_URL_API}/${courtDoc.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {courtDoc.name || "View Court Order Document"}
                  </a>
                </div>
              </div>
            </div>
          )}

          <div className="col-md-12">
            <div className="detail-section">
              <h4>
                <i className="bi bi-link-45deg"></i>
                URL
              </h4>

              <div className="urls-list">
                {data?.url ? (
                  <div className="url-item">
                    <span className="url-number">#1</span>

                    <a
                      href={data.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {data.url}
                    </a>

                    <span className={`url-status ${getStatusColor(data.status)}`}>
                      {getStatusLabel(data.status)}
                    </span>
                  </div>
                ) : (
                  <p className="text-muted">No URL found</p>
                )}
              </div>
            </div>
          </div>
        </div>


        {/* ---- ADDITIONAL INFORMATION ---- */}
        <div className="detail-section mt-3">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h4 className="mb-0">
              <i className="bi bi-inbox me-1"></i>
              Additional Information Received
            </h4>
            {/* <button className="back-btn"
            onClick={handleSendAditionalInfo}
            >
              <i className="bi bi-send me-1"></i>
              Send
            </button> */}
          </div>

          {data?.complaint_url_more_clarifications?.length ? (
            <div className="d-flex flex-column gap-2">
              {data.complaint_url_more_clarifications.map((clar, i) => {
                // const statusClass = getStatusColor(clar.status);
                // const statusLabel = getStatusLabel(clar.status);


                const clarDocs = clar.documents ?? [];
                const evidence = clarDocs.find((d) => d.docType === "evidence");
                const court = clarDocs.find((d) => d.docType === "court");

                return (
                  <div key={clar.id ?? i} className="border rounded p-3 bg-light">
                    {/* Row header */}
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div className="d-flex align-items-center gap-2">
                        <span className="badge bg-secondary">#{i + 1}</span>
                        <small className="text-muted">
                          <i className="bi bi-clock-history me-1"></i>
                          {/* {formatDate(clar.createdAt)} */}
                        </small>
                      </div>
                      {/* <span className={`url-status ${statusClass}`}>
                       
                        {statusLabel}
                      </span> */}
                      <button className="back-btn"
                        onClick={()=>handleSendAditionalInfo(clar.id) }
                      >
                        <i className="bi bi-send me-1"></i>
                        Send
                      </button>
                    </div>

                    {/* Remark (the ask / note) */}
                    <div className="mb-2">
                      <label className="text-uppercase small text-muted fw-semibold d-block mb-1">
                        <i className="bi bi-chat-left-text me-1"></i>
                        Remark
                      </label>
                      <p className="mb-0 small">
                        {clar.remark || <em className="text-muted">—</em>}
                      </p>
                    </div>

                    {/* Response (the reply) */}
                    {clar.response_remark && (
                      <div className="mb-2">
                        <label className="text-uppercase small text-muted fw-semibold d-block mb-1">
                          <i className="bi bi-reply me-1"></i>
                          Response
                        </label>
                        <p className="mb-0 small">{clar.response_remark}</p>
                        {clar.response_send_at && (
                          <small className="text-muted">
                            <i className="bi bi-send-check me-1"></i>
                            {/* Sent {formatDate(clar.response_send_at)} */}
                          </small>
                        )}
                      </div>
                    )}

                    {/* Attached documents */}
                    {(evidence || court) && (
                      <div className="d-flex flex-wrap gap-2 mt-2">
                        {evidence && (
                          <a
                            className="btn btn-sm btn-outline-danger"
                            href={`${BASE_URL_API}/${evidence.url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <i className="bi bi-file-earmark-pdf me-1"></i>
                            {evidence.name || "Evidence"}
                          </a>
                        )}
                        {court && (
                          <a
                            className="btn btn-sm btn-outline-danger"
                            href={`${BASE_URL_API}/${court.url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <i className="bi bi-file-earmark-pdf me-1"></i>
                            {court.name || "Court Order"}
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-muted small mt-2 mb-0">
              No additional information received yet.
            </p>
          )}
        </div>

      </div>
    </>
  );
};

export default ClarificationDetails;

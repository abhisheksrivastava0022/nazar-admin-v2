import React, { useState } from "react";

const PendingComplaints = ({ data }) => {
  const [openComplaint, setOpenComplaint] = useState(null);

  const complaints = data?.pending_complaints || [];

  const toggleComplaint = (id) => {
    setOpenComplaint(openComplaint === id ? null : id);
  };

  const getUrlStatusBadge = (status) => {
    const statusMap = {
      1: { label: "Pending", color: "warning" },
      2: { label: "Resolved", color: "success" },
      3: { label: "Rejected", color: "danger" },
    };
    const info = statusMap[status] || { label: "Unknown", color: "secondary" };
    return <span className={`badge bg-${info.color}`}>{info.label}</span>;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="container-fluid py-4">
      {/* Header - Total Complaints */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h3 className="card-title mb-0">
            📋 Total Complaints:{" "}
            <span className="text-primary fw-bold">{complaints.length}</span>
          </h3>
        </div>
      </div>

      {/* Complaints List */}
      {complaints.length > 0 ? (
        <div className="accordion" id="complaintsAccordion">
          {complaints.map((complaint) => {
            const urlCount = complaint.complaint_urls?.length || 0;
            const pendingUrls =
              complaint.complaint_urls?.filter((u) => u.status === 1).length ||
              0;

            return (
              <div
                key={complaint.id}
                className="accordion-item mb-2 border rounded"
              >
                <h2 className="accordion-header">
                  <button
                    className={`accordion-button ${openComplaint === complaint.id ? "" : "collapsed"}`}
                    type="button"
                    onClick={() => toggleComplaint(complaint.id)}
                  >
                    <div className="d-flex flex-wrap align-items-center gap-2 w-100">
                      <span className="fw-bold text-primary">
                        #{complaint.id}
                      </span>
                      <span className="fw-semibold">
                        {complaint.title || "Untitled"}
                      </span>
                      <span className="ms-auto d-flex flex-wrap align-items-center gap-2">
                        <span className="badge bg-light text-dark">
                          📎 {urlCount} URLs
                          {/* {pendingUrls > 0 && (
                            <span className="badge bg-warning ms-1">
                              {pendingUrls} pending
                            </span>
                          )} */}
                        </span>
                        <small className="text-muted">
                          {formatDate(complaint.createdAt)}
                        </small>
                      </span>
                    </div>
                  </button>
                </h2>
                <div
                  className={`accordion-collapse collapse ${openComplaint === complaint.id ? "show" : ""}`}
                >
                  <div className="accordion-body">
                    {/* Description */}
                    {complaint.description && (
                      <div className="mb-3">
                        <small className="text-muted d-block">
                          Description
                        </small>
                        <p className="border-start border-3 border-primary ps-3 mb-0 bg-light p-2 rounded">
                          {complaint.description}
                        </p>
                      </div>
                    )}

                    {/* Evidence */}
                    {complaint.evidence && (
                      <div className="mb-3">
                        <small className="text-muted d-block">Evidence</small>
                        <a
                          href={`/uploads/${complaint.evidence}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-outline-primary"
                        >
                          📎 {complaint.evidence}
                        </a>
                      </div>
                    )}

                    {/* URLs Table */}
                    <div className="mt-3">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h6 className="mb-0">🔗 Complaint URLs ({urlCount})</h6>
                        {pendingUrls > 0 && (
                          <span className="badge bg-warning">
                            {pendingUrls} pending
                          </span>
                        )}
                      </div>

                      {complaint.complaint_urls &&
                      complaint.complaint_urls.length > 0 ? (
                        <div className="table-responsive">
                          <table className="table table-bordered table-hover table-sm">
                            <thead className="table-dark">
                              <tr>
                                <th>#</th>
                                <th>URL</th>
                                <th>Status</th>
                                <th>Intermediary</th>
                              </tr>
                            </thead>
                            <tbody>
                              {complaint.complaint_urls.map(
                                (urlItem, index) => (
                                  <tr key={urlItem.id}>
                                    <td className="text-center">{index + 1}</td>
                                    <td>
                                      <a
                                        href={urlItem.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary text-break"
                                      >
                                        {urlItem.url}
                                      </a>
                                    </td>
                                    <td>{getUrlStatusBadge(urlItem.status)}</td>
                                    <td>
                                      {urlItem.intermediary ? (
                                        <div>
                                          <strong>
                                            {urlItem.intermediary.name}
                                          </strong>
                                          <br />
                                          <small className="text-muted">
                                            {
                                              urlItem.intermediary
                                                .contact_person
                                            }
                                          </small>
                                        </div>
                                      ) : (
                                        <span className="text-muted">N/A</span>
                                      )}
                                    </td>
                                  </tr>
                                ),
                              )}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="alert alert-secondary text-center">
                          No URLs found for this complaint
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card shadow-sm">
          <div className="card-body text-center py-5">
            <p className="h4 text-muted">😕 No complaints found</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingComplaints;

import React, { useState } from "react";
import ApiClient from "../../../../API/ApiClient";

const TotalComplants = ({ data, intermediaryData, fetchData }) => {
  const { postRequestApi } = ApiClient();
  const [openComplaint, setOpenComplaint] = useState(null);
  const [selectedUrls, setSelectedUrls] = useState({});
  const [formData, setFormData] = useState({});

  const complaints = data?.pending_complaints || [];

  // Toggle complaint accordion
  const toggleComplaint = (id) => {
    setOpenComplaint(openComplaint === id ? null : id);
  };

  // Handle checkbox selection
  const handleUrlSelect = (complaintId, urlId) => {
    setSelectedUrls((prev) => {
      const current = prev[complaintId] || [];
      if (current.includes(urlId)) {
        return {
          ...prev,
          [complaintId]: current.filter((id) => id !== urlId),
        };
      } else {
        return {
          ...prev,
          [complaintId]: [...current, urlId],
        };
      }
    });
  };

  // Handle select all URLs
  const handleSelectAll = (complaintId, urls) => {
    const pendingUrls = urls.filter((url) => url.status === 1);
    const allIds = pendingUrls.map((url) => url.id);
    setSelectedUrls((prev) => {
      const current = prev[complaintId] || [];
      if (current.length === allIds.length && allIds.length > 0) {
        return { ...prev, [complaintId]: [] };
      } else {
        return { ...prev, [complaintId]: allIds };
      }
    });
  };

  // Get selected URLs for a complaint
  const getSelectedUrls = (complaintId) => {
    return selectedUrls[complaintId] || [];
  };

  // Check if any URL is selected for a complaint
  const isAnySelected = (complaintId) => {
    return (selectedUrls[complaintId] || []).length > 0;
  };

  // Get selected count
  const getSelectedCount = (complaintId) => {
    return (selectedUrls[complaintId] || []).length;
  };

  // Check if all pending URLs are selected
  const isAllSelected = (complaintId, urls) => {
    const pendingUrls = urls.filter((url) => url.status === 1);
    const selected = selectedUrls[complaintId] || [];
    return pendingUrls.length > 0 && selected.length === pendingUrls.length;
  };

  // Check if all selected URLs have intermediary assigned
  const allSelectedHaveIntermediary = (complaintId) => {
    const selectedUrlIds = selectedUrls[complaintId] || [];
    const complaint = complaints.find((c) => c.id === complaintId);
    if (!complaint) return false;

    const selectedUrlsData = complaint.complaint_urls?.filter((url) =>
      selectedUrlIds.includes(url.id),
    );

    return selectedUrlsData?.every((url) => url.intermediary !== null);
  };

  // Check if any selected URL is pending
  const allSelectedArePending = (complaintId) => {
    const selectedUrlIds = selectedUrls[complaintId] || [];
    const complaint = complaints.find((c) => c.id === complaintId);
    if (!complaint) return false;

    const selectedUrlsData = complaint.complaint_urls?.filter((url) =>
      selectedUrlIds.includes(url.id),
    );

    return selectedUrlsData?.every((url) => url.status === 1);
  };

  // Handle Select Intermediary First
  const handleChnageIntermediary = async (urlId, intermediaryId) => {
    if (
      !window.confirm(
        "Are you sure you want to change the intermediary for this URL?",
      )
    ) {
      return;
    }

    // Create payload with URL-ID and intermediary-ID mapping

    const payload = {
      urls: urlId, // current URL only
      intermediary_id: intermediaryId,
    };

    // const payload = {
    //   urls: urlIntermediaryMap,
    // };

    try {
      const response = await postRequestApi(
        "api/producer/select-intermediary",
        payload,
      );

      if (response.status) {
        alert("✅ Intermediary assigned successfully!");
        setSelectedUrls((prev) => ({ ...prev, [complaintId]: [] }));
        setFormData((prev) => ({ ...prev, [complaintId]: {} }));
        fetchData();
      } else {
        alert("❌ Failed to assign intermediary. Please try again.");
      }
    } catch (error) {
      console.error("Error assigning intermediary:", error);
      alert("❌ Something went wrong while assigning intermediary.");
    }
  };

  // Handle Send to Sehyog
  const handleSendToSehyog = async (complaintId) => {
    const selectedUrlIds = selectedUrls[complaintId] || [];

    if (selectedUrlIds.length === 0) {
      alert("Please select at least one URL.");
      return;
    }

    const payload = {
      urls: selectedUrlIds,
    };

    try {
      const response = await postRequestApi(
        "api/producer/send-to-sehyog",
        payload,
      );

      if (response.status) {
        alert("✅ URLs sent to Sehyog successfully!");
        setSelectedUrls((prev) => ({ ...prev, [complaintId]: [] }));
        fetchData();
      } else {
        alert("❌ Failed to send URLs. Please try again.");
      }
    } catch (error) {
      console.error("Error sending URLs:", error);
      alert("❌ Something went wrong while sending URLs.");
    }
  };

  // Get URL status badge
  const getUrlStatusBadge = (status) => {
    const statusMap = {
      1: { label: "Pending", color: "warning" },
      2: { label: "Resolved", color: "success" },
      3: { label: "Rejected", color: "danger" },
    };
    const info = statusMap[status] || { label: "Unknown", color: "secondary" };
    return <span className={`badge bg-${info.color}`}>{info.label}</span>;
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleChange = (event) => {
    const selectedIntermediaryId = event.target.value;

    setFormData((prev) => ({
      ...prev,
      intermediary_id: selectedIntermediaryId,
    }));
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
            const selectedCount = getSelectedCount(complaint.id);
            const anySelected = isAnySelected(complaint.id);
            const showSendToSehyog =
              anySelected &&
              allSelectedHaveIntermediary(complaint.id) &&
              allSelectedArePending(complaint.id);

            return (
              <div
                key={complaint.id}
                className="accordion-item mb-2 border rounded"
              >
                <h2 className="accordion-header">
                  <button
                    className={`accordion-button ${
                      openComplaint === complaint.id ? "" : "collapsed"
                    }`}
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
                        </span>
                        {pendingUrls > 0 && (
                          <span className="badge bg-warning">
                            {pendingUrls} pending
                          </span>
                        )}
                        {anySelected && (
                          <span className="badge bg-primary">
                            {selectedCount} selected
                          </span>
                        )}
                        <small className="text-muted">
                          {formatDate(complaint.createdAt)}
                        </small>
                      </span>
                    </div>
                  </button>
                </h2>
                <div
                  className={`accordion-collapse collapse ${
                    openComplaint === complaint.id ? "show" : ""
                  }`}
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
                      <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
                        <h6 className="mb-0">🔗 Complaint URLs ({urlCount})</h6>
                        <div className="d-flex gap-2 flex-wrap">
                          {/* Action Buttons */}
                          {anySelected && (
                            <>
                              {!allSelectedHaveIntermediary(complaint.id) ? (
                                <button
                                  className="btn btn-sm btn-primary"
                                  onChange={(event) =>
                                    handleChnageIntermediary(
                                      complaint.id,
                                      event.target.value,
                                    )
                                  }
                                  disabled={
                                    !selectedUrls[complaint.id]?.every(
                                      (urlId) =>
                                        formData[complaint.id]?.[urlId],
                                    )
                                  }
                                >
                                  📌 Assign Intermediary ({selectedCount})
                                </button>
                              ) : null}

                              {showSendToSehyog && (
                                <button
                                  className="btn btn-sm btn-success"
                                  onClick={() =>
                                    handleSendToSehyog(complaint.id)
                                  }
                                >
                                  🚀 Send to Sehyog ({selectedCount})
                                </button>
                              )}
                            </>
                          )}
                          {pendingUrls > 0 && (
                            <button
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() =>
                                handleSelectAll(
                                  complaint.id,
                                  complaint.complaint_urls,
                                )
                              }
                            >
                              {isAllSelected(
                                complaint.id,
                                complaint.complaint_urls,
                              )
                                ? "Deselect All"
                                : "Select All"}
                            </button>
                          )}
                        </div>
                      </div>

                      {complaint.complaint_urls &&
                      complaint.complaint_urls.length > 0 ? (
                        <div className="table-responsive">
                          <table className="table table-bordered table-hover table-sm">
                            <thead className="table-dark">
                              <tr>
                                <th style={{ width: "40px" }}>
                                  <input
                                    type="checkbox"
                                    checked={isAllSelected(
                                      complaint.id,
                                      complaint.complaint_urls,
                                    )}
                                    onChange={() =>
                                      handleSelectAll(
                                        complaint.id,
                                        complaint.complaint_urls,
                                      )
                                    }
                                    disabled={pendingUrls === 0}
                                  />
                                </th>
                                <th>#</th>
                                <th>URL</th>
                                <th>Status</th>
                                <th>Intermediary</th>
                              </tr>
                            </thead>
                            <tbody>
                              {complaint.complaint_urls.map(
                                (urlItem, index) => {
                                  const hasIntermediary =
                                    urlItem.intermediary !== null;
                                  const isSelected = (
                                    selectedUrls[complaint.id] || []
                                  ).includes(urlItem.id);
                                  const isPending = urlItem.status === 1;

                                  return (
                                    <tr key={urlItem.id}>
                                      <td>
                                        <input
                                          type="checkbox"
                                          checked={isSelected}
                                          onChange={() =>
                                            handleUrlSelect(
                                              complaint.id,
                                              urlItem.id,
                                            )
                                          }
                                          disabled={!isPending}
                                        />
                                      </td>
                                      <td className="text-center">
                                        {index + 1}
                                      </td>
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
                                      <td>
                                        {getUrlStatusBadge(urlItem.status)}
                                      </td>
                                      <td>
                                        <select
                                          className="form-select form-select-sm"
                                          value={
                                            urlItem?.intermediary?.id || ""
                                          }
                                          onChange={(event) =>
                                            handleChnageIntermediary(
                                              urlItem.id,
                                              event.target.value,
                                            )
                                          }
                                          disabled={!isPending}
                                        >
                                          <option value="" disabled>
                                            Select Intermediary
                                          </option>
                                          {intermediaryData?.map(
                                            (intermediary) => (
                                              <option
                                                key={intermediary.id}
                                                value={intermediary.id}
                                              >
                                                {intermediary.name}
                                              </option>
                                            ),
                                          )}
                                        </select>
                                      </td>
                                    </tr>
                                  );
                                },
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

export default TotalComplants;

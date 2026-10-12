import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ApiClient from "../../API/ApiClient";

const FilmDetails = ({ onBack }) => {
  const { id } = useParams(); // Get ID from URL if editing
  const navigate = useNavigate();
  const { getRequestApi } = ApiClient();

  const [data, setData] = useState();

  const loadData = async () => {
    try {
      const response = await getRequestApi(`api/producer/movie/details/${id}`);
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

  const handleComplaintClick = (complaint) => {
    // setSelectedFilm(film);
    // setShowDetailModal(true);
    navigate(`/complants/${complaint.id}`);
  };

  const StatCard = ({ icon, label, value, color, onClick, subtitle }) => (
    <div
      className={`stat-card ${onClick ? "clickable" : ""}`}
      onClick={onClick}
    >
      <div className="stat-card-inner">
        <div
          className="stat-icon-wrapper"
          style={{ background: `${color}15`, color: color }}
        >
          <i className={icon}></i>
        </div>
        <div className="stat-info">
          <h3 className="stat-value">
            {typeof value === "number" ? value.toLocaleString() : value}
          </h3>
          <p className="stat-label">{label}</p>
          {subtitle && <span className="stat-subtitle">{subtitle}</span>}
        </div>
      </div>
    </div>
  );

  const statusCounts = data?.complaint_url_status_count || [];

  const getStatusCount = (status) => {
    return statusCounts.find((item) => item.status === status)?.count || 0;
  };

  return (
    <>
      <div className="film-details-container">
        {/* ========== HEADER ========== */}
        <div className="listing-header">
          <div className="header-left">
            <h2
              className="listing-title"
              style={{ textTransform: "uppercase" }}
            >
              <i className="bi bi-film"></i>
              {data?.producer_movie?.title || "Film Name"}
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

        {/* ========== STATS BAR ========== */}
        <div className="stats-grid">
          {/* <StatCard
            icon="bi bi-camera-reels"
            label="All Films complants"
            value={stats.films}
            color="#0877F3"
            onClick={() => {
              navigate("/films");
            }}
          /> */}
          <StatCard
            icon="bi bi-chat-square-text"
            label="Total Complaints"
            value={data?.total_complaint}
            color="#7C3AED"
            onClick={() => {
              navigate("/complants");
            }}
          />
          <StatCard
            icon="bi bi-globe"
            label="Total URLs"
            value={data?.total_complaint_url}
            color="#059669"
          />
          <StatCard
            icon="bi bi-hourglass-split"
            label="Pending URLs"
            value={getStatusCount(1)}
            color="#D97706"
          />
          <StatCard
            icon="bi bi-arrow-repeat"
            label="Send / Processed URLs"
            value={getStatusCount(3)}
            color="#D97706"
          />
          <StatCard
            icon="bi bi-check-circle-fill"
            label="Compliance URLs"
            value={getStatusCount(5)}
            color="#10B981"
          />
          <StatCard
            icon="bi bi-chat-dots"
            label="More Clarification URLs"
            value={getStatusCount(2) + getStatusCount(4)}
            color="#F59E0B"
          />
          <StatCard
            icon="bi bi-x-circle-fill"
            label="Not Compliance URLs"
            value={getStatusCount(6)}
            color="#EF4444"
          />
        </div>

        {/* ========== COMPLAINTS LIST ========== */}
        <div className="complaints-list-wrapper">
          {data?.complaints?.length === 0 ? (
            <div className="empty-state">
              <i className="bi bi-inbox"></i>
              <p>No complaints for this film</p>
            </div>
          ) : (
            <div className="complaints-list">
              {data?.complaints?.map((complaint) => (
                <div
                  key={complaint.id}
                  className="complaint-item"
                  onClick={() => handleComplaintClick(complaint)}
                >
                  <div className="complaint-item-header">
                    <span className="complaint-id">{complaint.id}</span>
                  </div>
                  <p className="complaint-description">
                    {complaint.description}
                  </p>
                  <div className="complaint-meta">
                    <span>
                      <i className="bi bi-link-45deg"></i>
                      {complaint?.complaint_urls?.length} URLs
                    </span>
                    <span>
                      <i className="bi bi-calendar3"></i>
                      {new Date(complaint.createdAt).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FilmDetails;

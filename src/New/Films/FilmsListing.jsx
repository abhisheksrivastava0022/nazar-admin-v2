/* eslint-disable react-hooks/static-components */

import { useEffect, useState } from "react";
import ApiClient from "../../API/ApiClient";
import FilmsView from "./FilmsView";

const FilmsListing = () => {
  const { getRequestApi } = ApiClient();

  const [count, setCount] = useState();

  const loadData = async () => {
    try {
      const response = await getRequestApi(
        `api/producer/request-overall-count`,
      );
      if (response.status) {
        setCount(response.data);
      }
    } catch (error) {
      console.warn(error);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const statusCounts = count?.complaint_url_status_count || [];

  const getStatusCount = (status) => {
    return statusCounts.find((item) => item.status === status)?.count || 0;
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

  return (
    <div className="films-listing-container">
      {/* ========== HEADER ========== */}
      <div className="listing-header">
        <div className="header-left">
          <h2 className="listing-title">
            <i className="bi bi-film"></i>
            Films Management
          </h2>
          <p className="listing-subtitle">
            View and manage all films with their complaint details
          </p>
        </div>
        <div className="header-right">
          {/* <button className="btn-primary">
            <i className="bi bi-plus-lg"></i>
            Add New Film
          </button> */}
        </div>
      </div>

      {/* ========== STATS BAR ========== */}
      <div className="stats-grid">
        <StatCard
          icon="bi bi-camera-reels"
          label="All Films complants"
          value={count?.total_movie_count}
          color="#0877F3"
          // onClick={() => {
          //   navigate("/complants");
          // }}
        />
        <StatCard
          icon="bi bi-chat-square-text"
          label="Total Complaints"
          value={count?.total_complaint_count}
          color="#7C3AED"
          // onClick={() => {
          //   handelTab("total-complaints");
          // }}
        />
        <StatCard
          icon="bi bi-globe"
          label="Total URLs"
          value={count?.total_complaint_url_count}
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
      <FilmsView searching={true} pagination={true} />
    </div>
  );
};

export default FilmsListing;

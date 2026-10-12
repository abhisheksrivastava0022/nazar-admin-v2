import { useEffect, useState } from "react";
import ApiClient from "../../API/ApiClient";
import FilmsView from "../Films/FilmsView";
import { useSearchParams } from "react-router-dom";

const OverViewLayout = () => {
  // const { postRequestApi, getRequestApi } = ApiClient();
  const { getRequestApi } = ApiClient();

  const [count, setCount] = useState();

  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get("tab") || "latest-film-complaints";

  const [tab, setTab] = useState(activeTab);

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

  // ============================================
  // HANDLERS
  // ============================================

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

  const handelTab = (newTab) => {
    setTab(newTab);

    setSearchParams({
      tab: newTab,
    });
  };

  return (
    <>
      <div className="overview-container">
        <div className="stats-grid">
          <StatCard
            icon="bi bi-camera-reels"
            label="All Films complants"
            value={count?.total_movie_count}
            color="#0877F3"
            onClick={() => {
              handelTab("latest-film-complaints");
            }}
          />
          <StatCard
            icon="bi bi-chat-square-text"
            label="Total Complaints"
            value={count?.total_complaint_count}
            color="#7C3AED"
            onClick={() => {
              handelTab("total-complaints");
            }}
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

        {tab === "latest-film-complaints" ? (
          <>
            <div className="films-section mb-3">
              <div className="section-header">
                <h3 className="section-title">
                  <i className="bi bi-film"></i>
                  Latest Film Complaints
                </h3>
                {/* <span className="section-count">{filmsData.length} films</span> */}
              </div>
            </div>

            <FilmsView searching={false} pagination={false} />
          </>
        ) : (
          <></>
        )}

        {/* {tab === "total-complaints" ? <FilmsOverView /> : <></>} */}
      </div>
    </>
  );
};

export default OverViewLayout;

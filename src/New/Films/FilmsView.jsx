import { useEffect, useState } from "react";
import ApiClient from "../../API/ApiClient";
import { useNavigate } from "react-router-dom";

const FilmsView = ({ searching, pagination }) => {
  const navigate = useNavigate();

  const { getRequestApi } = ApiClient();

  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [totalCount, setTotalCount] = useState(0);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  // ============================================
  // SINGLE SOURCE OF TRUTH — ek hi useEffect
  // ============================================
  useEffect(() => {
    const loadData = async () => {
      try {
        const params = new URLSearchParams({
          search: searchTerm,
          page: currentPage,
          limit: itemsPerPage,
        });

        const response = await getRequestApi(
          `api/producer/request-movielisting-count?${params.toString()}`,
        );

        if (response.status) {
          setData(response.data);
          setTotalCount(response.totalcount);
        }
      } catch (error) {
        console.warn(error);
      }
    };

    // debounce sirf search ke liye, page change pe turant
    const timer = setTimeout(loadData, searchTerm ? 400 : 0);
    return () => clearTimeout(timer);
  }, [searchTerm, currentPage, itemsPerPage]);

  // ============================================
  // HANDLERS — ab sirf state update, koi manual call nahi
  // ============================================
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // search pe hamesha page 1
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  const getStatusCount = (film, status) =>
    film?.status_count?.find((item) => item.status === status)?.count || 0;

  const getDaysOld = (dateString) => {
    const today = new Date();
    const complaintDate = new Date(dateString);
    today.setHours(0, 0, 0, 0);
    complaintDate.setHours(0, 0, 0, 0);
    return Math.floor((today - complaintDate) / (1000 * 60 * 60 * 24));
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

  const handleFilmClick = (film) => {
    // setSelectedFilm(film);
    navigate(`/films/${film.id}`);
    // navigate(`${film.id}`);
    // console.log(film);
  };

  return (
    <>
      {/* SEARCH */}
      {searching && (
        <div className="filters-section col-md-4">
          <div className="search-wrapper">
            <i className="bi bi-search"></i>
            <input
              type="text"
              placeholder="Search by film name..."
              value={searchTerm}
              onChange={handleSearch}
              className="search-input"
            />
            {searchTerm && (
              <button className="clear-search" onClick={handleClearSearch}>
                <i className="bi bi-x-circle"></i>
              </button>
            )}
          </div>
        </div>
      )}

      {/* GRID */}
      <div className="films-grid">
        {data.length === 0 ? (
          <div className="empty-state">
            <i className="bi bi-film"></i>
            <p>No films found</p>
            <span>Try adjusting your search terms</span>
          </div>
        ) : (
          data.map((film) => (
            <div
              key={film.id}
              className="film-card"
              onClick={() => handleFilmClick(film)}
            >
              <div className="film-card-header">
                <div className="film-icon">
                  <i className="bi bi-film"></i>
                </div>
                <h4 className="film-name">{film.title}</h4>
              </div>

              <div className="film-stats-grid">
                <div className="film-stat-item">
                  <span
                    className="film-stat-value"
                    style={{ color: "#7c3aed" }}
                  >
                    {film.total_complaint}
                  </span>
                  <span className="film-stat-label">Total Complaints</span>
                </div>
                <div className="film-stat-divider"></div>
                <div className="film-stat-item">
                  <span
                    className="film-stat-value"
                    style={{ color: "#059669" }}
                  >
                    {film.total_url}
                  </span>
                  <span className="film-stat-label">Total URLs</span>
                </div>
                <div className="film-stat-divider"></div>
                <div className="film-stat-item">
                  <span
                    className="film-stat-value"
                    style={{ color: "#D97706" }}
                  >
                    {getStatusCount(film, 1)}
                  </span>
                  <span className="film-stat-label">Pending URLs</span>
                </div>
              </div>

              <div className="film-card-footer">
                <div className="film-last-complaint">
                  <i className="bi bi-calendar3"></i>
                  <span className="days-ago">
                    ({getDaysOldText(film.latest_complaint)})
                  </span>
                </div>
                <span className="film-view-btn">View Details →</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* PAGINATION */}
      {pagination && totalCount > 0 && (
        <div className="pagination-section">
          <div className="pagination-info">
            Showing {(currentPage - 1) * itemsPerPage + 1} -{" "}
            {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount}{" "}
            films
          </div>
          <div className="pagination-buttons">
            <button
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <i className="bi bi-chevron-left"></i>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
              disabled={currentPage === totalPages}
            >
              <i className="bi bi-chevron-right"></i>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default FilmsView;

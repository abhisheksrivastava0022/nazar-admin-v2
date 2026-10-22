import ComplantsView from "./ComplantsView";


const ComplaintsListing = () => {


  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="films-listing-container">
      {/* ========== HEADER ========== */}
      <div className="listing-header">
        <div className="header-left">
          <h2 className="listing-title">
            <i className="bi bi-file-text"></i>
            Complaints Management
          </h2>
          <p className="listing-subtitle">
            Manage and track all complaints across films
          </p>
        </div>
      </div>



      <ComplantsView statsBar={true} searching={true} pagination={true} />
    </div>
  );
};

export default ComplaintsListing;
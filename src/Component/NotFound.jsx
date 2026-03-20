import React from "react";

const NotFound = () => {
  return (
    <>
      <div>
        <main className="d-flex flex-column u-hero u-hero--end mnh-100vh">
          <div className="container py-11 my-auto ">
            <div className="row d-flex justify-content-center align-items-center">
              <div
                className="col-md-6 col-lg-6 offset-lg-1 mb-4 mb-md-0"
                style={{ width: "100%" }}
              >
                <div className="card">
                  <div className="card-body p-4 p-lg-7">
                    <h2 className="text-center mb-4">404 - Page Not Found</h2>
                    <p className="text-center mb-4">
                      Sorry, the page you are looking for does not exist.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default NotFound;

import React from "react";

import { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function InternForm() {
  const [domain, setDomain] = useState("");
  const [location, setLocation] = useState("");
  const [keywords, setKeywords] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [paidOnly, setPaidOnly] = useState(false);
  const [recentOnly, setRecentOnly] = useState(false);

  const lastSearch = useRef({ domain: "", location: "", keywords: "" });

// Add below your existing useState hooks
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

// Calculate slice indexes
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentResults = results.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(results.length / itemsPerPage);

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

// When a new search runs, reset to page 1
  useEffect(() => {
    setCurrentPage(1);
  }, [results]);


  const runSearch = async (payload) => {
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      setResults(data.results || []);
    } catch (error) {
      console.error("Error fetching internships:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const payload = { domain, location, keywords };
    lastSearch.current = payload; // store the last query
    runSearch(payload);
  };

  const handleRefresh = () => {
    if (
      lastSearch.current.domain ||
      lastSearch.current.location ||
      lastSearch.current.keywords
    ) {
      runSearch(lastSearch.current);
    }
  };

  // 🔄 Auto-refresh every 60 seconds (optional)
  useEffect(() => {
    const interval = setInterval(() => {
      if (
        lastSearch.current.domain ||
        lastSearch.current.location ||
        lastSearch.current.keywords
      ) {
        runSearch(lastSearch.current);
      }
    }, 60000); // 60 seconds
    return () => clearInterval(interval);
  }, []);

  // const totalPages = Math.ceil(results.length / resultsPerPage);
  // const startIndex = (currentPage - 1) * resultsPerPage;
  // const currentResults = results.slice(startIndex, startIndex + resultsPerPage);

  return (
    <div style={{backgroundColor: "skyblue"}}>
      <div className="container py-4">
      <h2 className="text-center mb-4">Internship Search</h2>
      
      <form onSubmit={handleSearch} className="row g-3 mb-4">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Domain (e.g., Web Development)"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Location (e.g., Remote)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Keywords"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
          />
        </div>
        <div className="col-12 d-flex flex-wrap gap-3 justify-content-center">
          <div className="form-check">
            <input
            className="form-check-input"
            type="checkbox"
            id="remoteOnly"
            checked={remoteOnly}
            onChange={(e) => setRemoteOnly(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="remoteOnly">Remote only</label>
          </div>
          <div className="form-check">
            <input
            className="form-check-input"
            type="checkbox"
            id="paidOnly"
            checked={paidOnly}
            onChange={(e) => setPaidOnly(e.target.checked)}
           />
           <label className="form-check-label" htmlFor="paidOnly">Paid only</label>
          </div>
          <div className="form-check">
            <input
            className="form-check-input"
            type="checkbox"
            id="recentOnly"
            checked={recentOnly}
            onChange={(e) => setRecentOnly(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="recentOnly">Recently posted</label>
          </div>
        </div>
        <div className="col-12 text-center">
          <button type="submit" className="btn btn-primary px-4 me-2">
            {loading ? "Searching..." : "Search"}
          </button>
          <button
            type="button"
            className="btn btn-primary px-4"
            onClick={handleRefresh}
            disabled={loading}
            >Refresh</button>
        </div>
      </form>

      <div className="row">
        {currentResults.length > 0 ? (
          currentResults.map((item, index) => (
            <div key={index} className="col-md-6 col-lg-4 mb-3">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{item.title}</h5>
                  <p className="card-text">
                    <strong>Company:</strong> {item.company}
                  </p>
                  <p className="card-text">
                    <strong>Location:</strong> {item.location}
                  </p>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-primary btn-sm"
                  >
                    Apply Here
                  </a>
                </div>
              </div>
            </div>
          ))
        ) : (
          !loading && (
            <p className="text-center text-muted">No results found</p>
          )
        )}
      </div>
      {/* ➡️ Pagination Controls */}
      {results.length > 0 && (
        <div className="d-flex justify-content-center align-items-center mt-3">
          <button
            className="btn btn-outline-primary btn-sm me-2"
            onClick={goToPrevPage}
            disabled={currentPage === 1}
          >Previous 10</button>
          <span className="mx-2">Page {currentPage} of {totalPages}</span>
          <button
          className="btn btn-outline-primary btn-sm"
          onClick={goToNextPage}
          disabled={currentPage === totalPages}>Next 10</button>
        </div>
        )}
    </div>
    </div>
  );
}

export default InternForm;

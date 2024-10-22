import { useState, useEffect } from "react";
import { Box, Typography, Button, TablePagination } from "@mui/material";
import { Star, StarHalf, StarBorder } from "@mui/icons-material";
import { useLocation } from "react-router-dom";
import "./HistoryRslts.css";
import CoverLetter from "../CoverLetter/CoverLetter";



const HistoryRslts = () => {
  const location = useLocation();
  const { predictJobs } = location.state; // Receive the data passed

  const [page, setPage] = useState(0);
  const rowsPerPage = 5;
  const [selectedCoverLetter, setSelectedCoverLetter] = useState(null);
  const [showMatchingSkills, setShowMatchingSkills] = useState({});
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);
  const [isTableVisible, setIsTableVisible] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 900);
      if (window.innerWidth > 900) {
        setIsTableVisible(true);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleLetterCoverClick = (job) => {
    setSelectedCoverLetter(job);
    if (isMobile) {
      setIsTableVisible(false);
    }
  };

  const handleBackToTable = () => {
    setIsTableVisible(true);
    setSelectedCoverLetter(null);
  };

  const handleToggleMatchingSkills = (index) => {
    setShowMatchingSkills((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const renderStars = (similarityValue, index) => {
    const totalStars = 5;
    const starRating = similarityValue * totalStars;
    const fullStars = Math.floor(starRating);
    const hasHalfStar = starRating - fullStars >= 0.5;
    const emptyStars = totalStars - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <Box
        className="star-container"
        sx={{
          display: "flex",
          alignItems: "center",
        }}
        onClick={() => handleToggleMatchingSkills(index)} // Toggle skills on click
      >
        {Array.from({ length: fullStars }, (_, i) => (
          <Star key={`full-${i}`} sx={{ color: "#FFD700", fontSize: "20px" }} />
        ))}
        {hasHalfStar && (
          <StarHalf sx={{ color: "#FFD700", fontSize: "20px" }} />
        )}
        {Array.from({ length: emptyStars }, (_, i) => (
          <StarBorder
            key={`empty-${i}`}
            sx={{ color: "#E0E0E0", fontSize: "20px" }}
          />
        ))}
      </Box>
    );
  };

  const paginatedResults = predictJobs.slice(
    page * rowsPerPage,
    (page + 1) * rowsPerPage
  );

  return (
    <Box
      sx={{ width: "100%", margin: "20px auto", padding: "20px" }}
      className="container3"
    >
      <Typography
        variant="h4"
        style={{
          fontWeight: "bold",
          marginBottom: "15px",
          textAlign: "center",
        }}
        className="predict_title"
      >
        Prediction Results:
      </Typography>

      <Box display="flex" width="100%">
        {/* Job Table */}
        <Box
          sx={{ width: selectedCoverLetter ? "80%" : "100%" }}
          className={`table-container ${!isTableVisible ? "hide" : ""}`}
        >
          {paginatedResults.length > 0 ? (
            paginatedResults.map((job, index) => {
              const similarityValue = (job?.["Similarity (%)"] ?? 50) / 100;
              return (
                <Box
                  key={index}
                  className="job-result-row"
                  sx={{
                    borderColor: `rgba(34, 197, 94, ${similarityValue})`,
                  }}
                >
                  <Box className="job-result-block">
                    {renderStars(similarityValue, index)}
                    <Typography variant="h6" className="job-title">
                      {job.Title || "No Title Available"}
                    </Typography>
                    <Typography variant="subtitle1" className="job-company">
                      {job.Company || "No Company Available"}
                    </Typography>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "10px",
                        marginTop: "10px",
                      }}
                    >
                      <Button
                        className="button"
                        variant="contained"
                        onClick={() => handleLetterCoverClick(job)}
                        style={{ marginTop: "10px" }}
                      >
                        View Cover Letter
                      </Button>
                      <Button
                        className="button"
                        variant="contained"
                        onClick={() => window.open(job.Url, "_blank")}
                        style={{ marginTop: "10px" }}
                      >
                        Apply
                      </Button>
                    </div>
                  </Box>

                  <div className="divider"></div>

                  <Box className="job-result-block">
                    {showMatchingSkills[index] && job.matching_skills && (
                      <Box sx={{ marginTop: "10px" }}>
                        <Typography variant="body2" className="body2">
                          Matching Skills:
                        </Typography>
                        <ul className="matching_skills">
                          {job.matching_skills.trim() !== "" ? (
                            job.matching_skills
                              .split("-")
                              .reduce((acc, skill, idx) => {
                                const cleanSkill = skill.trim();
                                if (cleanSkill === "") return acc;
                                acc.push(
                                  <li key={idx}>
                                    <Typography variant="body2">
                                      {cleanSkill}
                                    </Typography>
                                  </li>
                                );
                                return acc;
                              }, [])
                          ) : (
                            <li>
                              <Typography variant="body2">
                                Skills not specified
                              </Typography>
                            </li>
                          )}
                        </ul>
                      </Box>
                    )}
                    <Typography variant="body1" className="body1">
                      Missing Skills:
                    </Typography>
                    <ul>
                      {job.missing_skills ? (
                        job.missing_skills.split("-").map((skill, idx) => {
                          const cleanSkill = skill.trim();
                          return cleanSkill ? (
                            <li key={idx}>
                              <Typography variant="body2">
                                {cleanSkill}
                              </Typography>
                            </li>
                          ) : null;
                        })
                      ) : (
                        <Typography variant="body2" className="nacolor">
                          N/A
                        </Typography>
                      )}
                    </ul>
                  </Box>
                </Box>
              );
            })
          ) : (
            <Typography variant="body1">No results available.</Typography>
          )}
        </Box>

        {/* Cover Letter Section */}
        {selectedCoverLetter && (
          <Box
            className={`details-container ${
              isMobile && !isTableVisible ? "active" : ""
            }`}
            sx={{ width: isMobile ? "100%" : "60%" }}
          >
            {!isMobile && (
              <button
                className="close-button"
                onClick={() => setSelectedCoverLetter(null)}
              >
                &times;
              </button>
            )}

            {isMobile && (
              <button className="back-button" onClick={handleBackToTable}>
                &lt;
              </button>
            )}

            <Typography variant="h6">Cover Letter:</Typography>
            <CoverLetter
                  coverLetter={
                    selectedCoverLetter?.cover_letter ||
                    "No cover letter available"
                  }
                />
           
          </Box>
        )}
      </Box>

      <TablePagination
        component="div"
        count={predictJobs.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[]}
        labelRowsPerPage={null}
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 1,
          color: "#171C3F",
          fontWeight: "bolder",
        }}
      />
    </Box>
  );
};

export default HistoryRslts;

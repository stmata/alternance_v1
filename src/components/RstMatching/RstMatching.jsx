import { useState, useEffect, useContext } from "react";
import { Box, Typography, Button, TablePagination } from "@mui/material";
import {
  Star,
  StarHalf,
  StarBorder,
  // FavoriteBorder,
  // Favorite,
} from "@mui/icons-material";
import { useLocation, Link, useNavigate } from "react-router-dom";
import "./RstMatching.css";
import { AppContext } from "../../AppContext";
import CoverLetter from "../CoverLetter/CoverLetter";

const RstMatching = () => {
  const { platform, region, setIsChanged, setIsChanged2 } =
    useContext(AppContext);
  const [prevPlatform, setPrevPlatform] = useState(
    sessionStorage.getItem("platform")
  );
  const [prevRegion, setPrevRegion] = useState(
    sessionStorage.getItem("region")
  );
  const [result, setResult] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const rowsPerPage = 5;
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const resultType = queryParams.get("type");
  const [selectedCoverLetter, setSelectedCoverLetter] = useState(null);
  const [showMatchingSkills, setShowMatchingSkills] = useState({});
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);
  const [isTableVisible, setIsTableVisible] = useState(true);
  const navigate = useNavigate(); // Use navigate to programmatically navigate
  // const [likedRows, setLikedRows] = useState({}); // Track liked rows
  // const baseUrl = import.meta.env.VITE_APP_BASE_URL; 


  // Function to handle heart icon click
  // const handleLikeClick = (job, index) => {
  //   setLikedRows((prevState) => ({
  //     ...prevState,
  //     [index]: !prevState[index], // Toggle the like state
  //   }));

  //   // Send row data to the backend for the likes using fetch
  //   fetch(`${baseUrl}/history/add-liked-post`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       user_id: sessionStorage.getItem("user_id"), // Récupérer l'identifiant de l'utilisateur depuis sessionStorage
  //       job_post: job, // Envoyer les détails du poste dans job_post
  //     }),
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       console.log("Liked successfully", data);
  //     })
  //     .catch((error) => {
  //       console.error("Error liking the job", error);
  //     });
  //   }    

  // Handle window resize for mobile view
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

  // Load results when region or platform is available
  useEffect(() => {
    setIsLoading(true);
    let storedResults = null;
    if (region && platform) {
      if (resultType === "cv") {
        storedResults = sessionStorage.getItem("cvStoredResults");
      } else if (resultType === "prompt") {
        storedResults = sessionStorage.getItem("promptStoredResults");
      }

      if (storedResults) {
        setResult(JSON.parse(storedResults));
      } else {
        setResult([]);
      }
    }
    setIsLoading(false);
  }, [resultType, region, platform]);

  // Detect changes in platform or region
  useEffect(() => {
    if (
      (platform && platform !== prevPlatform) ||
      (region && region !== prevRegion)
    ) {
      // Update previous values
      setPrevPlatform(platform);
      setPrevRegion(region);

      // Reset matching states to trigger re-processing
      setIsChanged(true);
      setIsChanged2(true);

      // Update sessionStorage with new values
      sessionStorage.setItem("platform", platform);
      sessionStorage.setItem("region", region);

      // Navigate back to /SmartMatching
      navigate("/SmartMatching");
    }
  }, [
    platform,
    region,
    prevPlatform,
    prevRegion,
    navigate,
    setIsChanged,
    setIsChanged2,
  ]);

  const handleLetterCoverClick = (job) => {
    setSelectedCoverLetter(job);
    if (isMobile) {
      setIsTableVisible(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const renderStars = (similarityValue, index) => {
    const totalStars = 5;
    const starRating = similarityValue * totalStars;
    const fullStars = Math.floor(starRating);
    const hasHalfStar = starRating - fullStars >= 0.5;
    const emptyStars = totalStars - fullStars - (hasHalfStar ? 1 : 0);
  
    return (
      <Box
        className="prefix-star-container"
        sx={{
          display: "flex",
          alignItems: "center",
          // justifyContent: "space-between", // Sépare les étoiles et le cœur
          width: "100%", 
        }}
      >
        {/* Conteneur des étoiles */}
        <Box
          sx={{ display: "flex", cursor: "pointer" }}
          onClick={() => handleToggleMatchingSkills(index)} // Clic sur les étoiles uniquement
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
  
        {/* Conteneur du cœur (Like) */}
        {/* <Box
          sx={{ cursor: "pointer" }} // Indique que le cœur est cliquable
          onClick={(e) => {
            e.stopPropagation(); // Empêche le clic de se propager aux étoiles
            handleLikeClick(job, index); // Clic uniquement sur le cœur
          }}
        >
          {likedRows[index] ? (
            <Favorite sx={{ color: "red", fontSize: "20px" }} />
          ) : (
            <FavoriteBorder sx={{ color: "#FFD700", fontSize: "20px" }} />
          )}
        </Box> */}
      </Box>
    );
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

  const paginatedResults = result.slice(
    page * rowsPerPage,
    (page + 1) * rowsPerPage
  );

  return (
    <Box
      sx={{ width: "100%", margin: "20px auto", padding: "20px" }}
      className="prefix-container3"
    >
      <Box className="prefix-divGlobal">
        <Typography
          variant="h4"
          style={{
            fontWeight: "bold",
            marginBottom: "15px",
            textAlign: "center",
          }}
          className="predict_title"
        >
          Prediction Results for ({resultType === "cv" ? "CV" : "Prompt"}):
        </Typography>

        {isLoading ? (
          <p>Loading results...</p>
        ) : paginatedResults.length > 0 ? (
          <Box display="flex" width="100%">
            {/* Job Table Container */}
            <Box
              sx={{ width: selectedCoverLetter ? "60%" : "100%" }}
              className={`table-container ${!isTableVisible ? "hide" : ""}`}
            >
              {paginatedResults.map((job, index) => {
                const similarityValue = (job?.["Similarity (%)"] ?? 50) / 100;
                return (
                  <Box
                    key={index}
                    className="prefix-job-result-row"
                    sx={{
                      borderColor: `rgba(34, 197, 94, ${similarityValue})`,
                      flexDirection:
                        isMobile || selectedCoverLetter ? "column" : "row",
                    }}
                  >
                    <Box className="prefix-job-result-block">
                      {renderStars(similarityValue, index, job)}
                      <Typography
                        variant="h6"
                        className="prefix-job-title-icon"
                      >
                        {job.Title || "No Title Available"}
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        className="prefix-job-company-icon"
                      >
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
                          className="prefix-button"
                          variant="contained"
                          onClick={() => handleLetterCoverClick(job)}
                          style={{ marginTop: "10px" }}
                        >
                          View Cover Letter
                        </Button>
                        <Button
                          className="prefix-button"
                          variant="contained"
                          onClick={() => window.open(job.Url, "_blank")}
                          style={{ marginTop: "10px" }}
                        >
                          Apply
                        </Button>
                      </div>
                    </Box>

                    <div className="prefix-divider2"></div>

                    <Box className="prefix-job-result-block">
                      {showMatchingSkills[index] && job.matching_skills && (
                        <Box sx={{ marginTop: "10px" }}>
                          <Typography variant="body2" className="prefix-body2">
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
                      <Typography variant="body1" className="prefix-body1">
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
              })}
            </Box>

            {/* Cover Letter Container */}
            {selectedCoverLetter && (
              <Box
                className={`details-container ${
                  isMobile && !isTableVisible ? "active" : ""
                }`}
                sx={{
                  width: isMobile ? "100%" : "60%",
                  marginLeft: isMobile ? 0 : "20px",
                }}
              >
                {/* Close button for desktop */}
                {!isMobile && (
                  <button
                    className="close-button"
                    onClick={() => setSelectedCoverLetter(null)}
                  >
                    &times;
                  </button>
                )}

                {/* Back button for mobile */}
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
        ) : (
          <p>
            No matching results found. Please try again or update your matching
            criteria.
          </p>
        )}

        <TablePagination
          component="div"
          count={result.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[]}
          labelRowsPerPage={null}
          showFirstButton={false}
          showLastButton={false}
          nextIconButtonProps={{
            "aria-label": "Next Page",
            sx: { color: "#171C3F", fontWeight: "bold" },
          }}
          backIconButtonProps={{
            "aria-label": "Previous Page",
            sx: { color: "#171C3F", fontWeight: "bold" },
          }}
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 1,
            color: "#171C3F",
            fontWeight: "bolder",
            "& .MuiTablePagination-displayedRows": {
              color: "red",
              fontWeight: "bold",
            },
          }}
        />

        <Box mt={4} sx={{ display: "flex", justifyContent: "center" }}>
          <Link to="/SmartMatching">
            <Button variant="contained" className="prefix-button2">
              Back to Matching
            </Button>
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default RstMatching;

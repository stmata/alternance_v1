import { useState, useEffect, useContext } from "react";
import { AppContext } from "../../AppContext";
import CircularProgress from '@mui/material/CircularProgress';
import WarningIcon from "@mui/icons-material/Warning";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  Button,
  TablePagination,
} from "@mui/material";
import "./PlatformPage.css";
import JobDetails from "../JobDetails/JobDetails";
import { useTranslation } from 'react-i18next';

const PlatformPage = () => {
  const { platform, region, searchTerm } = useContext(AppContext);
  const [data, setData] = useState(null);  // Initialiser data à null
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(20);
  const { t } = useTranslation();

  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const storedTheme = sessionStorage.getItem("theme") || "light";
    setIsDarkMode(storedTheme === "dark");
  }, []);

  // États pour gérer la responsivité
  const [isTableVisible, setIsTableVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);

  const baseUrl = import.meta.env.VITE_APP_BASE_URL;
  
  const fetchData = async (platformToFetch, regionToFetch) => {
    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}/retrieval/file-with-summarize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          platform: platformToFetch,
          region: regionToFetch,
        }),
      });
      const result = await response.json();
      console.log(result)
      setData(result.content || []);
    } catch (error) {
      console.error("Error:", error);
      setData([]);  // S'assurer que data est un tableau vide en cas d'erreur
    } finally {
      setLoading(false);
    }
  };

  const normalizeRegion = (region) => {
    return region
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/-/g, "_");
  };

  const normalizePlatform = (platform) => {
    return platform
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/-/g, "_");
  };

  useEffect(() => {
    fetchData(normalizePlatform(platform), normalizeRegion(region));
    setSelectedJob(null);
    setIsTableVisible(true);
  }, [platform, region]);

  // Gestion de la responsivité
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 900);
      if (window.innerWidth > 900) {
        setIsTableVisible(true); // Afficher le tableau sur les grands écrans
      }
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Modification ici pour s'assurer que filteredData est toujours un tableau
  const filteredData = data
    ? searchTerm
      ? data.filter(
          (job) =>
            job.Title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.Company.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.Location.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job["Publication Date"]
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
        )
      : data
    : [];

  const handleRowClick = (job) => {
    setSelectedJob(job);
    if (isMobile) {
      setIsTableVisible(false); // Masquer le tableau sur mobile
    }
  };

  const handleBackToTable = () => {
    setIsTableVisible(true);
    setSelectedJob(null);
  };

  const handleChangePage = (event, newPage) => setPage(newPage);

  return (
    <Box
      display="flex"
      className={`split-view-container ${isDarkMode ? "dark-mode" : ""}`}
      padding="20px"
      width="100%"
    >
      {loading || data === null ? (
        <div className="spinner-container">
          <CircularProgress sx={{ color: isDarkMode ? "#e0e0e0" : "#171C3F" }} />
        </div>
      ) : data.length === 0 ? (
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          width="100%"
          className={`Warning ${isDarkMode ? "dark-mode" : ""}`}
          sx={{
            backgroundColor: isDarkMode ? "rgba(255, 255, 0, 0.1)" : "#fff3cd",
            borderRadius: "10px",
            padding: "20px",
          }}
        >
          <WarningIcon sx={{ color: "#856404", fontSize: 50 }} />
          <Typography variant="h6" sx={{ color: "#856404", fontWeight: "bold", mt: 2 }}>
            {t("warning_!Data")}
          </Typography>
        </Box>
      ) : filteredData.length === 0 ? (
        // Afficher le message lorsque filteredData est vide
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          width="100%"
          className={`Warning ${isDarkMode ? "dark-mode" : ""}`}
          sx={{
            backgroundColor: isDarkMode ? "rgba(255, 255, 0, 0.1)" : "#fff3cd",
            borderRadius: "10px",
            padding: "20px",
          }}
        >
          <WarningIcon sx={{ color: "#856404", fontSize: 50 }} />
          <Typography variant="h6" sx={{ color: "#856404", fontWeight: "bold", mt: 2 }}>
            {t("warning_!Data")}
          </Typography>
        </Box>
      ) : (
        <TableContainer component={Paper} className={`table-container ${!isTableVisible ? "hide" : ""} ${
          isDarkMode ? "dark-mode" : ""
        }`} sx={{ width: "100%" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t("title_company")}</TableCell>
                <TableCell>{t("title_title")}</TableCell>
                <TableCell>{t("title_location")}</TableCell>
                <TableCell>{t("title_date")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((job, index) => (
                <TableRow
                  key={index}
                  onClick={() => handleRowClick(job)}
                  hover
                  style={{ cursor: "pointer" }}
                >
                  <TableCell className="elmTab" data-label={t("title_company")}>{job.Company}</TableCell>
                  <TableCell className="elmTab" data-label={t("title_title")}>{job.Title}</TableCell>
                  <TableCell className="elmTab" data-label={t("title_location")}>{job.Location}</TableCell>
                  <TableCell className="elmTab" data-label={t("title_date")}>{job["Publication Date"]}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={filteredData.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[]}
            labelRowsPerPage={null}
            showFirstButton={false}
            showLastButton={false}
            nextIconButtonProps={{
              "aria-label": "Next Page",
              sx: { color: isDarkMode ? "#e0e0e0" : "#171C3F", fontWeight: "bold" },
            }}
            backIconButtonProps={{
              "aria-label": "Previous Page",
              sx: { color: isDarkMode ? "#e0e0e0" : "#171C3F", fontWeight: "bold" },
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
        </TableContainer>
      )}
      {selectedJob && (
        <Box
          className={`details-container ${isMobile && !isTableVisible ? "active" : ""}`}
          sx={{
            width: isMobile ? "90%" : "60%",
            marginLeft: isMobile ? 0 : "20px",
          }}
        >
          {!isMobile && (
            <button className="close-button" onClick={() => setSelectedJob(null)}>
              &times;
            </button>
          )}
          {isMobile && (
            <button className="back-button" onClick={handleBackToTable}>
              &lt;
            </button>
          )}
          <Box component="header">
            <Typography variant="h6">{t("title_MD")}</Typography>
          </Box>
          <JobDetails selectedJob={selectedJob} />
          <Box mt={2} className="center-container">
            <Button
              className="view-job-btn"
              onClick={() => window.open(selectedJob.Url, "_blank")}
            >
              {t("title_VA")}
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default PlatformPage;

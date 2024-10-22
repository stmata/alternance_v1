import { useState, useEffect, useContext } from "react";
import { AppContext } from "../../AppContext";
import CircularProgress from '@mui/material/CircularProgress'; // Import spinner
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

const PlatformPage = () => {
  const { platform, region, searchTerm } = useContext(AppContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(20);

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

      setData(result.content || []);
    } catch (error) {
      console.error("Error:", error);
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
    setIsTableVisible(true); // Ensure the table is visible when platform or region changes
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

  const filteredData = searchTerm
    ? data.filter(
        (job) =>
          job.Title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.Company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.Location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job["Publication Date"]
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      )
    : data;

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
      className="split-view-container"
      padding="20px"
      width="100%"
    >
      {/* Conteneur du tableau */}
      {loading ? (
        <div className="spinner-container">
        <CircularProgress sx={{ color: '#171C3F' }} />
      </div>
      ) : filteredData.length === 0 ? (
        // Afficher une erreur si les données sont vides
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          width="100%"
          className="Warning"
          sx={{
            backgroundColor: "#fff3cd", // Couleur de fond jaune clair pour l'avertissement
            border: "1px solid #ffeeba", // Bordure jaune plus foncée pour correspondre à l'avertissement
            borderRadius: "10px", // Coins arrondis pour un look plus propre
            padding: "20px",
            marginLeft: "450px",
          }}
        >
          <WarningIcon sx={{ color: "#856404", fontSize: 50 }} />{" "}
          {/* Icône Warning avec couleur jaune foncé */}
          <Typography
            variant="h6"
            sx={{ color: "#856404", fontWeight: "bold", mt: 2 }}
          >
            Warning: No data available.
          </Typography>
        </Box>
      ) : (
        <TableContainer
          component={Paper}
          className={`table-container ${!isTableVisible ? "hide" : ""}`}
          sx={{ width: "100%" }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Company</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((job, index) => (
                  <TableRow
                    key={index}
                    onClick={() => handleRowClick(job)}
                    hover
                    style={{ cursor: "pointer" }}
                  >
                    <TableCell className="elmTab" data-label="Company">
                      {job.Company}
                    </TableCell>
                    <TableCell className="elmTab" data-label="Title">
                      {job.Title}
                    </TableCell>
                    <TableCell className="elmTab" data-label="Location">
                      {job.Location}
                    </TableCell>
                    <TableCell className="elmTab" data-label="Date">
                      {job["Publication Date"]}
                    </TableCell>
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
        </TableContainer>
      )}

      {/* Conteneur des détails */}
      {selectedJob && (
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
              onClick={() => setSelectedJob(null)}
            >
              &times;
            </button>
          )}

          {/* Bouton de retour sur mobile */}
          {isMobile && (
            <button className="back-button" onClick={handleBackToTable}>
              &lt;
            </button>
          )}

          <Typography component="h6" variant="h6">
            More details:
          </Typography>
          
          <Typography>
            <JobDetails selectedJob={selectedJob} />
          </Typography>

          {/* Bouton pour ouvrir l'URL du job */}
          <Box mt={2} className="center-container">
            <Button
              className="view-job-btn"
              onClick={() => window.open(selectedJob.Url, "_blank")}
            >
              View Alternance
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default PlatformPage;

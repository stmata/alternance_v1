import React, {useState, useEffect } from 'react';
import {
  Box, Button, Table,Typography, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, TablePagination, IconButton, Menu, MenuItem, ListItemIcon, ListItemText, TextField,  Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt'; // Use this icon instead
import '../../assets/styles.css';
import PropTypes from 'prop-types';  // Import prop-types for validation
import * as XLSX from 'xlsx';
import './JobFilter.css'

const JobFilter = ({ platform, region }) => {
  const [filterData, setFilterData] = useState([]);
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [jobKeys, setJobKeys] = useState([]); // Store dynamic headers
  const [anchorEl, setAnchorEl] = useState(null); // Anchor for filter dropdown
  const [filterKey, setFilterKey] = useState(''); // Store current filter key
  const [filterOptions, setFilterOptions] = useState([]); // Store filter options for the current column
  const [filterSelections, setFilterSelections] = useState({}); // Store selected filter options for each column
  const [searchTerm, setSearchTerm] = useState(''); // Store search term for filtering options
  const [page, setPage] = useState(0); // Pagination
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);  // État pour la modal

  // Fonction pour ouvrir la modal
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  
  // Fonction pour fermer la modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  


  useEffect(() => {
    fetchJobData();
  }, [platform, region]); // Re-fetch data when platform or region changes

  const fetchJobData = async () => {
    try {
      // Appel direct de l'API déployée sur Azure
      const response = await fetch(`https://alternancescraping.azurewebsites.net/retrieve-file?site_name=${platform}&region=${region.replaceAll('-', '_')}`);
      console.log(response)
      if (response.status === 200) {
        const data = await response.json();
        const jobData = data.content;
        if (jobData && jobData.length > 0) {
          setFilterData(jobData);
          setJobKeys(Object.keys(jobData[0])); // Extraction dynamique des clés
        } else {
          console.error('No jobs data available');
        }
      } else {
        console.error(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      console.error(`Error fetching job data: ${error.message}`);
    }
  };


  // Truncate long text for cells
  const truncateText = (text, maxLength = 50) => {
    if (text && text.length > maxLength) {
      return `${text.substring(0, maxLength)}...`;
    }
    return text;
  };

  // Handle row selection
  const handleSelect = (job) => {
    setSelectedJobs((prevSelected) =>
      prevSelected.includes(job) ? prevSelected.filter((j) => j !== job) : [...prevSelected, job]
    );
  };

  // Handle page change for pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change for pagination
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDownloadSelected = () => {
    const worksheet = XLSX.utils.json_to_sheet(selectedJobs);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Filtered Jobs");
    XLSX.writeFile(workbook, "filtered_jobs.xlsx");
  };

  const handleDownloadAll = () => {
    const worksheet = XLSX.utils.json_to_sheet(filterData); // All jobs data
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "All Jobs");
    XLSX.writeFile(workbook, "all_jobs.xlsx");
  };

  // Open filter dropdown and extract unique values for the selected column
  const handleFilterClick = (event, key) => {
    setAnchorEl(event.currentTarget);
    setFilterKey(key);

    // Get unique values for the selected column
    const uniqueOptions = [...new Set(filterData.map((job) => job[key]))];
    setFilterOptions(uniqueOptions);
  };

  // Close filter dropdown
  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  // Handle filter checkbox selection
  const handleFilterSelect = (option) => {
    const currentSelections = filterSelections[filterKey] || [];
    const updatedSelections = currentSelections.includes(option)
      ? currentSelections.filter((value) => value !== option)
      : [...currentSelections, option];

    setFilterSelections({ ...filterSelections, [filterKey]: updatedSelections });
  };

  // Handle select all/none
  const handleSelectAll = () => {
    const allSelected = filterSelections[filterKey]?.length === filterOptions.length;
    const updatedSelections = allSelected ? [] : filterOptions;
    setFilterSelections({ ...filterSelections, [filterKey]: updatedSelections });
  };
 
  // Filter job data based on the selections
  const applyFilters = (job) => {
    return Object.keys(filterSelections).every((key) => {
      const selectedOptions = filterSelections[key];
      return selectedOptions.length === 0 || selectedOptions.includes(job[key]);
    });
  };

  return (
    <Box>
      <Box className="button-container">

      <Button onClick={handleOpenModal} variant="contained" className="job-button all" >
            Visualize Filtered Jobs
        </Button>

        <Button
  onClick={handleDownloadSelected}
  variant="contained"
  className="job-button selected"
  disabled={selectedJobs.length === 0} // Désactive le bouton si aucun job n'est sélectionné
>
  Download Selected Jobs
</Button>

<Button
  onClick={handleDownloadAll}
  variant="contained"
  className="job-button all"
  disabled={filterData.filter(applyFilters).length === 0} // Désactive le bouton si aucun job filtré
>
  Download All Jobs
</Button>


      </Box>

      {/* Display the job data in a table */}
      <TableContainer className="table-container">
        <Table className="modern-table">
          <TableHead>
            <TableRow>
              <TableCell className="table-header" padding="checkbox" />
              {jobKeys.map((key) => (
                <TableCell className="table-header" key={key}>
                  <Box display="flex" alignItems="center">
                    {key}
                    <IconButton
                      size="small"
                      onClick={(event) => handleFilterClick(event, key)}
                      onMouseEnter={() => setAnchorEl(null)} // Hover logic to display filter icon
                    >
                      <FilterAltIcon className="filter-icon" />
                    </IconButton>
                  </Box>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
  {filterData
    .filter(applyFilters)
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    .map((job, index) => (
      <React.Fragment key={index}>
        <TableRow hover className="table-row job-row-separator">
          {/* Checkbox avec ou sans texte selon l'écran */}
          <TableCell padding="checkbox">
            <Box display="flex" alignItems="center">
              <Checkbox
                checked={selectedJobs.includes(job)}
                onChange={() => handleSelect(job)}
                color="primary"
                className="table-checkbox"
              />
              {/* Texte à côté de la case à cocher pour mobile et tablette */}
              <Typography
                variant="body2"
                className="check-interested-text"
                sx={{ display: { xs: 'inline', sm: 'inline', md: 'none' } }}
              >
              </Typography>
            </Box>
          </TableCell>
          {jobKeys.map((key) => (
            <TableCell className="table-cell" key={key} >
              {/* Ajouter `:` après chaque clé */}
              <span className="column-header-mobile">{key}:</span>
              {truncateText(job[key], 50)} {/* Logic de troncature */}
              <br />
            </TableCell>
          ))}
        </TableRow>
        {/* Ajout de ligne séparatrice entre les jobs */}
        <TableRow>
          <TableCell colSpan={jobKeys.length + 1} className="separator-row">
            <Box className="job-separator" />
          </TableCell>
        </TableRow>
      </React.Fragment>
    ))}
</TableBody>

        </Table>
      </TableContainer>


      <Dialog open={isModalOpen} onClose={handleCloseModal} maxWidth="md" fullWidth>
  <DialogTitle className='dialogTitle'>Selected Jobs :</DialogTitle>
  <DialogContent>
    {selectedJobs.length === 0 ? (
      <Typography className='nojobs'>No jobs selected.</Typography>
    ) : (
      <Box className="jobs-grid-container">
        {selectedJobs.map((job, index) => (
          <Box key={index} className="job-card">
            <Box className="job-card-header">
              <Typography variant="h6" className='jobTit'>{job.Title}</Typography>
            </Box>
            <Box className="job-card-body">
              <Typography className='jobInfs'><strong>Company:</strong> {job.Company}</Typography>
              <Typography className='jobInfs'><strong>Location:</strong> {job.Location}</Typography>
              <Typography className='jobInfs'><strong>Publication Date:</strong> {job['Publication Date']}</Typography>
              <Typography className='jobInfs'><strong>Description:</strong> {job.Description}</Typography>
            </Box>
            <Box className="job-card-footer">
              <Button
                variant="contained"
                color="primary"
                href={job.Url}  // Assuming job.Url contains the URL to apply
                target="_blank"
                className="apply-button"
              >
                Postuler
              </Button>
            </Box>
          </Box>
        ))}
      </Box>
    )}
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCloseModal} color="primary" className='closeBtn'>Close</Button>
  </DialogActions>
</Dialog>
      {/* Filter dropdown menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleFilterClose}
        PaperProps={{ style: { maxHeight: 250, width: '20ch', overflowY: 'auto' } }} // Allows scrolling inside menu
        disableScrollLock={true} // Prevents scroll lock
      >
        <MenuItem>
          <TextField
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
            size="small"
          />
        </MenuItem>
        <MenuItem onClick={handleSelectAll}>
          <ListItemIcon>
            <Checkbox
              checked={filterSelections[filterKey]?.length === filterOptions.length}
              indeterminate={filterSelections[filterKey]?.length > 0 && filterSelections[filterKey]?.length < filterOptions.length}
            />
          </ListItemIcon>
          <ListItemText primary="(Select All)" />
        </MenuItem>
        {filterOptions
          .filter((option) => option.toLowerCase().includes(searchTerm.toLowerCase()))
          .map((option) => (
            <MenuItem key={option} onClick={() => handleFilterSelect(option)}>
              <ListItemIcon>
                <Checkbox checked={filterSelections[filterKey]?.includes(option)} />
              </ListItemIcon>
              <ListItemText primary={option} />
            </MenuItem>
          ))}
      </Menu>

      {/* Pagination */}
      <TablePagination className='pagination'
        component="div"
        count={filterData.filter(applyFilters).length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage
        }
      />
    </Box>
  );
};

// Prop type validation for platform and region
JobFilter.propTypes = {
    platform: PropTypes.string.isRequired,
    region: PropTypes.string.isRequired,
  };
export default JobFilter;

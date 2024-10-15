import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, TablePagination } from '@mui/material';
import { Star, StarHalf, StarBorder } from '@mui/icons-material'; 
import { useLocation, Link } from 'react-router-dom';
import jsPDF from 'jspdf';  
import './RstMatching.css';

const RstMatching = () => {
  const [result, setResult] = useState([]);  
  const [isLoading, setIsLoading] = useState(true);  
  const [openModal, setOpenModal] = useState(true);  
  const [page, setPage] = useState(0);  
  const rowsPerPage = 5;  
  const location = useLocation();  
  const queryParams = new URLSearchParams(location.search);
  const resultType = queryParams.get('type');  

  useEffect(() => {
    setIsLoading(true);  
    let storedResults = null;

    if (resultType === 'cv') {
      storedResults = sessionStorage.getItem('cvStoredResults');
    } else if (resultType === 'prompt') {
      storedResults = sessionStorage.getItem('promptStoredResults');
    }

    if (storedResults) {
      setResult(JSON.parse(storedResults));  
    } else {
      setResult([]);  
    }
    
    setIsLoading(false);  
  }, [resultType]);

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const removeMarkdown = (text) => {
    return text
      .replace(/(\*\*|__)(.*?)\1/g, "$2") 
      .replace(/(\*|_)(.*?)\1/g, "$2") 
      .replace(/(~~)(.*?)\1/g, "$2") 
      .replace(/!?\[.*?\]\(.*?\)/g, "") 
      .replace(/`.*?`/g, "") 
      .replace(/#+\s/g, "") 
      .replace(/>\s/g, "") 
      .replace(/-|\*|\+\s/g, ""); 
  };
  
  const downloadCoverLetterPDF = (coverLetter, jobTitle) => {
    if (!coverLetter || coverLetter === 'N/A') {
      alert("No cover letter available to download.");
      return;
    }
  
    const cleanCoverLetter = removeMarkdown(coverLetter);
  
    const doc = new jsPDF();
  
    const marginLeft = 20;
    const marginTop = 30;
    const lineHeight = 7;  
    const maxLineWidth = 170;  
    let currentY = marginTop;
  
    doc.setFontSize(10); 
  
    const lines = doc.splitTextToSize(cleanCoverLetter, maxLineWidth);
  
    lines.forEach((line) => {
      if (currentY + lineHeight > 280) {  
        doc.addPage();  
        currentY = marginTop;  
      }
      doc.text(line, marginLeft, currentY);
      currentY += lineHeight;  
    });
  
    doc.save(`${jobTitle}_Cover_Letter.pdf`);
  };

  const renderStars = (similarityValue) => {
    const totalStars = 5;
    const starRating = similarityValue * totalStars;  
    const fullStars = Math.floor(starRating); 
    const hasHalfStar = starRating - fullStars >= 0.5; 
    const emptyStars = totalStars - fullStars - (hasHalfStar ? 1 : 0); 
  
    return (
      <Box className="prefix-star-container" sx={{ display: 'flex', alignItems: 'center' }}>
        {Array.from({ length: fullStars }, (_, i) => (
          <Star key={`full-${i}`} sx={{ color: '#FFD700', fontSize: '20px' }} /> 
        ))}
        {hasHalfStar && <StarHalf sx={{ color: '#FFD700', fontSize: '20px' }} />}
        {Array.from({ length: emptyStars }, (_, i) => (
          <StarBorder key={`empty-${i}`} sx={{ color: '#E0E0E0', fontSize: '20px' }} /> 
        ))}
      </Box>
    );
  };

  const paginatedResults = result.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  return (
    <Box sx={{ width: '100%', margin: '20px auto', padding: '20px' }} className='prefix-container3'>
      <Box className='prefix-divGlobal'>
        <Typography variant="h4" style={{ fontWeight: 'bold', marginBottom:'20px', textAlign:'center' }}>
          Prediction Results for ({resultType === 'cv' ? 'CV' : 'Prompt'}):
        </Typography>
        
        {isLoading ? (
          <p>Loading results...</p>
        ) : paginatedResults && paginatedResults.length > 0 ? (
          paginatedResults.map((job, index) => {
            const similarityValue = (job?.["Similarity (%)"] ?? 50) / 100;          
            return (
              <Box 
                key={index} 
                className="prefix-job-result-row" 
                sx={{
                  borderColor: `rgba(34, 197, 94, ${similarityValue})`
                }}>
                
                <Box className="prefix-job-result-block">
                  {renderStars(similarityValue)}
                  <Typography variant="h6" className="prefix-job-title-icon">{job.Title || 'No Title Available'}</Typography>
                  <Typography variant="subtitle1" className="prefix-job-company-icon">{job.Company || 'No Company Available'}</Typography>
  
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '10px' }}>
                    <Button
                      className="prefix-button"
                      variant="contained"
                      onClick={() => downloadCoverLetterPDF(job.cover_letter, job.Title)}
                      style={{ marginTop: '10px' }}
                    >
                      Download Cover Letter
                    </Button>
                    <Button
                      className="prefix-button"
                      variant="contained"
                      onClick={() => window.open(job.Url, '_blank')}
                      style={{ marginTop: '10px' }}
                    >
                      Apply
                    </Button>
                  </div>
                </Box>
  
                <div className="prefix-divider2"></div>
  
                <Box className="prefix-job-result-block">
                  <Typography variant="body1" className='prefix-body1'>Missing Skills:</Typography>
                  <ul>
                    {job.missing_skills ? (
                      job.missing_skills.split('-').map((skill, index) => {
                        const cleanSkill = skill.trim();
                        const exclusionWords = ['conclusion', 'en conclusion'];
                        const lowerCaseSkill = cleanSkill.toLowerCase();
                        const shouldExclude = exclusionWords.some((word) => lowerCaseSkill.includes(word));
                        return cleanSkill && !shouldExclude ? (
                          <li key={index}>
                            <Typography variant="body2">{cleanSkill}</Typography>
                          </li>
                        ) : null;
                      })
                    ) : (
                      <Typography variant="body2">N/A</Typography>
                    )}
                  </ul>
                </Box>
              </Box>
            );
          })
        ) : (
          <p>No matching results found. Please try again or update your matching criteria.</p>
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
            'aria-label': 'Next Page',
            sx: { color: '#171C3F', fontWeight: 'bold' },
          }}
          backIconButtonProps={{
            'aria-label': 'Previous Page',
            sx: { color: '#171C3F', fontWeight: 'bold' },
          }}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mt: 1,
            color: '#171C3F',
            fontWeight: 'bolder',
            '& .MuiTablePagination-displayedRows': {
              color: 'red',
              fontWeight: 'bold',
            },
          }}
        />
  
        <Box mt={4} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Link to="/SmartMatching">
            <Button variant="contained" className='prefix-button2'>
              Back to Matching
            </Button>
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default RstMatching;

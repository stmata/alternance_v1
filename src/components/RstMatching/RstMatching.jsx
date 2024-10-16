import { useState, useEffect, useRef, useContext } from 'react';
import { Box, Typography, Button, TablePagination } from '@mui/material';
import { Star, StarHalf, StarBorder } from '@mui/icons-material'; // Utiliser CheckCircleIcon
import { useLocation, Link } from 'react-router-dom';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';  // Pour télécharger le fichier
import './RstMatching.css';
import { AppContext } from '../../AppContext';  // Importer AppContext

const RstMatching = () => {
  const { platform, region } = useContext(AppContext); 
  const [prevPlatform, setPrevPlatform] = useState(sessionStorage.getItem('platform'));
  const [prevRegion, setPrevRegion] = useState(sessionStorage.getItem('region'));
  const [result, setResult] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const rowsPerPage = 5;
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const resultType = queryParams.get('type');
  const backButtonRef = useRef(null);
  const [showMatchingSkills, setShowMatchingSkills] = useState({}); // État pour gérer l'affichage des matching skills

  // Charger les résultats lorsque region ou platform est disponible
  useEffect(() => {
    setIsLoading(true);
    let storedResults = null;
    if (region && platform) {
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
    }

    setIsLoading(false);
  }, [resultType, region, platform]);

  // Déclencher une nouvelle prédiction lorsque platform ou region change
  useEffect(() => {
    if ((platform && platform !== prevPlatform) || (region && region !== prevRegion)) {
      
      // Mettre à jour les anciennes valeurs
      setPrevPlatform(platform);
      setPrevRegion(region);

      // Mettre à jour sessionStorage avec les nouvelles valeurs
      sessionStorage.setItem('platform', platform);
      sessionStorage.setItem('region', region);

      // Simuler un clic sur le bouton de retour
      if (backButtonRef.current) {
        backButtonRef.current.click();
      }
    }
  }, [platform, region]);
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const removeMarkdownAndFormat = (text) => {
    return text
      .replace(/(\*\*|__)(.*?)\1/g, "$2")
      .replace(/(\*|_)(.*?)\1/g, "$2")
      .replace(/(~~)(.*?)\1/g, "$2")
      .replace(/!?\[.*?\]\(.*?\)/g, "")
      .replace(/`/g, "")
      .replace(/#+\s/g, "")
      .replace(/>\s/g, "")
      .replace(/-|\*|\+\s/g, "")
      .replace(/\n\n/g, '\n')
      .split('\n')
      .filter(line => line.trim().length > 0);
  };

  const downloadCoverLetterWord = (coverLetter, jobTitle) => {
    if (!coverLetter || coverLetter === 'N/A') {
      alert("No cover letter available to download.");
      return;
    }

    const cleanCoverLetterLines = removeMarkdownAndFormat(coverLetter);

    const doc = new Document({
      sections: [
        {
          children: cleanCoverLetterLines.map((line, index) => {
            const isObjetLine = line.startsWith("Objet");
            const isCordialementLine = line.trim().toLowerCase() === "cordialement,";
            const isAfterCordialement = cleanCoverLetterLines[index - 1]?.trim().toLowerCase() === "cordialement,";

            return new Paragraph({
              children: [
                new TextRun({
                  text: line,
                  font: "Times New Roman",
                  size: 26,
                  bold: isObjetLine || isCordialementLine || isAfterCordialement,
                }),
              ],
              spacing: {
                before: isObjetLine || isCordialementLine ? 300 : 200,
                after: isObjetLine || isCordialementLine || isAfterCordialement ? 300 : 200,
              },
            });
          }),
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, `${jobTitle}_Cover_Letter.docx`);
    });
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
        sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
        onClick={() => handleToggleMatchingSkills(index)} // Ajouter l'action au clic ici
      >
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
  

  const handleToggleMatchingSkills = (index) => {
    setShowMatchingSkills((prevState) => ({
      ...prevState,
      [index]: !prevState[index], // Toggle the visibility
    }));
  };

  const paginatedResults = result.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  return (
    <Box sx={{ width: '100%', margin: '20px auto', padding: '20px' }} className='prefix-container3'>
      <Box className='prefix-divGlobal'>
        <Typography variant="h4" style={{ fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>
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
                  borderColor: `rgba(34, 197, 94, ${similarityValue})`,
                }}>
                <Box className="prefix-job-result-block">
                {renderStars(similarityValue, index)}
                <Typography variant="h6" className="prefix-job-title-icon">{job.Title || 'No Title Available'}</Typography>
                  <Typography variant="subtitle1" className="prefix-job-company-icon">{job.Company || 'No Company Available'}</Typography>

                  <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '10px' }}>
                    <Button
                      className="prefix-button"
                      variant="contained"
                      onClick={() => downloadCoverLetterWord(job.cover_letter, job.Title)}
                      style={{ marginTop: '10px' }}
                    >
                      Cover Letter
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
                {showMatchingSkills[index] && job.matching_skills && (
  <Box sx={{ marginTop: '10px' }}>
    <Typography variant="body2" className='prefix-body2' >
      Matching Skills:
    </Typography>
    <ul className='matching_skills'>
    {job.matching_skills && job.matching_skills.trim() !== '' ? (
  job.matching_skills.split('-').reduce((acc, skill, index) => {
    const cleanSkill = skill.trim();

    if (cleanSkill === '') {
      // If the skill is empty, add <empty>
      return acc;
    } else if (cleanSkill.endsWith(':')) {
      // If it's a main element ending with ':', create a new list item
      acc.push(
        <li key={index}>            
          <Typography variant="body2">
            {cleanSkill}
          </Typography>
        </li>
      );
    } else {
      // If it's a sub-description, treat it as a separate list item
      acc.push(
        <li key={index}>
          <Typography variant="body2">{cleanSkill}</Typography>
        </li>
      );
    }
    return acc;
  }, [])
) : (
  <li>
    <Typography variant="body2">Skills not specified</Typography>
  </li>
)}


</ul>


  </Box>
)}
                  <Typography variant="body1" className='prefix-body1'>
                    Missing Skills:
                  </Typography>
                  <ul>
                    {job.missing_skills ? (
                      job.missing_skills.split('-').map((skill, index) => {
                        const cleanSkill = skill.trim();
                        return cleanSkill ? (
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
        count={result.length}        page={page}
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
        }} />

        <Box mt={4} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Link to="/SmartMatching">
            <Button variant="contained" className='prefix-button2' ref={backButtonRef}>
              Back to Matching
            </Button>
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default RstMatching;

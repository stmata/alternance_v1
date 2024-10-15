import React from 'react';
import { Box, Typography } from '@mui/material';
import './JobDetails.css'; // Import the CSS file for custom styles

const JobDetails = ({ selectedJob }) => {
  const jobDescription = selectedJob.Summary || 'N/A';

  // Use regular expressions to extract sections from the job description
  const jobTitle = jobDescription.match(/\*\*Job Title:\*\* (.*?)( \*\*|$)/)?.[1] || 'Click view alternance for more details!';
  const primaryResponsibilities = jobDescription.match(/\*\*Primary Responsibilities:\*\*([\s\S]*?)(\*\*|$)/)?.[1] || 'No more details!';
  const keySkills = jobDescription.match(/\*\*Key Required Skills:\*\*([\s\S]*?)(\*\*|$)/)?.[1] || 'No more details!';
  const mainObjectives = jobDescription.match(/\*\*Main Objectives:\*\*([\s\S]*?)(\*\*|$)/)?.[1] || 'No more details!';

  // Function to split content by "-" and return a list
  const renderList = (content) => {
    return content
      .split('-')
      .filter((item) => item.trim() !== '') // Remove empty items
      .map((item, index) => (
        <li key={index} className="job-list-item">
          {item.trim()}
        </li>
      ));
  };

  return (
    <Box className="job-details-container">
      <Typography variant="h6" className="job-title">
        {jobTitle}
      </Typography>
        <br />
      <Typography variant="body1" className="job-section">
        <strong>Primary Responsibilities:</strong>
        <ul>{renderList(primaryResponsibilities)}</ul>
      </Typography>

      <Typography variant="body1" className="job-section">
        <strong>Key Required Skills:</strong>
        <ul>{renderList(keySkills)}</ul>
      </Typography>

      <Typography variant="body1" className="job-section">
        <strong>Main Objectives:</strong>
        <ul>{renderList(mainObjectives)}</ul>
      </Typography>
    </Box>
  );
};

export default JobDetails;

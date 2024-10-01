import React from 'react';
import PropTypes from 'prop-types';
import { Box, Card, CardContent, Typography, Tabs, Tab } from '@mui/material';
import { Info as InfoIcon, Storage as StorageIcon, Memory as MemoryIcon } from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LabelList, ResponsiveContainer } from 'recharts';
import JobFilter from '../JobFilter/JobFilter';
import './DataTabs.css'

const DataTabs = ({ data, platform, region }) => {
  const [mainTab, setMainTab] = React.useState(0);
  const [infoTab, setInfoTab] = React.useState(0);

  const handleMainTabChange = (event, newValue) => {
    setMainTab(newValue);
  };

  const handleInfoTabChange = (event, newValue) => {
    setInfoTab(newValue);
  };

  // Total number of rows (observations)
  const totalRows = data.overview['Number of observations'];

  // Transform missing values data into array format for Recharts
  const missingValuesData = Object.entries(data.missing_values).map(([variable, missingCount]) => ({
    variable,
    nonMissingCount: totalRows - missingCount,
    missingCount,
  }));

  return (
    <Box className="data-tabs-container">
      {/* Main Tabs */}
      <Tabs value={mainTab} onChange={handleMainTabChange} centered>
        <Tab label="Job Filter" className="tabelm" />
        <Tab label="More Information" className="tabelm" />
      </Tabs>

      {/* Job Filter Tab */}
      {mainTab === 0 && (
        <Box>
          <JobFilter platform={platform} region={region} /> {/* Pass platform and region */}
        </Box>
      )}

      {/* More Information Tab with Nested Tabs */}
      {mainTab === 1 && (
        <Box>
          <Tabs value={infoTab} onChange={handleInfoTabChange} centered>
            <Tab label="Overview" className='tabelm' />
            <Tab label="Variables" className='tabelm' />
            <Tab label="Missing Values" className='tabelm' />
          </Tabs>

          {/* Overview Section */}
          {infoTab === 0 && (
            <Box className="overview-section">
              <Card className="custom-card">
                <CardContent>
                  <InfoIcon color="primary" />
                  <Typography variant="h6" component="div">
                    Number of Variables
                  </Typography>
                  <Typography variant="h4" color="text.secondary">
                    {data.overview && data.overview['Number of variables']}
                  </Typography>
                </CardContent>
              </Card>

              <Card className="custom-card">
                <CardContent>
                  <StorageIcon color="primary" />
                  <Typography variant="h6" component="div">
                    Number of Observations
                  </Typography>
                  <Typography variant="h4" color="text.secondary">
                    {data.overview && data.overview['Number of observations']}
                  </Typography>
                </CardContent>
              </Card>

              <Card className="custom-card">
                <CardContent>
                  <InfoIcon color="error" />
                  <Typography variant="h6" component="div">
                    Missing Cells
                  </Typography>
                  <Typography variant="h4" color="text.secondary">
                    {data.overview && data.overview['Missing cells']}
                  </Typography>
                </CardContent>
              </Card>

              <Card className="custom-card">
                <CardContent>
                  <MemoryIcon color="primary" />
                  <Typography variant="h6" component="div">
                    Total Size in Memory
                  </Typography>
                  <Typography variant="h4" color="text.secondary">
                    {data.overview && data.overview['Total size in memory']} bytes
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          )}

          {/* Variables Section */}
          {infoTab === 1 && (
            <Box className="overview-section">
              {Object.entries(data.variables).map(([variableName, variableInfo], index) => (
                <Card className={`custom-card ${index % 2 === 0 ? 'align-left' : 'align-right'}`} key={variableName}>
                  <CardContent>
                    <Typography className="variable-name" bold variant="h5" component="div">
                      {variableName}
                    </Typography>
                    <br />
                    <Box className="variable-info-box">
                      <Typography className="variable-info breakable-text" variant="body2">
                        <strong>Type:</strong> {variableInfo.Type} | <strong>Distinct:</strong> {variableInfo.Distinct} | <strong>Missing:</strong> {variableInfo.Missing} ({parseFloat(variableInfo['Missing (%)']).toFixed(2)}%) | <strong>Memory size:</strong> {variableInfo['Memory size']} bytes | <strong>Top value:</strong> {variableInfo.Top && variableInfo.Top.length > 15 ? `${variableInfo.Top.slice(0, variableInfo.Top.length / 2)}...` : (variableInfo.Top ?? 'N/A')}

                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}

          {/* Missing Values Section */}
          {infoTab === 2 && (
            <Box className="overview-section">
              <Typography variant="h6" gutterBottom className='missingValue'>
                Missing Values Per Variable:
              </Typography>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={missingValuesData} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="variable" angle={-45} textAnchor="end" height={80} />
                  <YAxis domain={[0, totalRows]} />
                  <Tooltip />
                  <Bar dataKey="nonMissingCount" fill="#8884d8">
                  <LabelList
                    dataKey="missingCount"
                    position="top"
                    formatter={(count, index) => index === 0 ? `${count} missing` : ''} 
                  />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

DataTabs.propTypes = {
  data: PropTypes.shape({
    overview: PropTypes.shape({
      'Number of variables': PropTypes.number,
      'Number of observations': PropTypes.number,
      'Missing cells': PropTypes.number,
      'Total size in memory': PropTypes.number,
    }),
    variables: PropTypes.object.isRequired,
    missing_values: PropTypes.object.isRequired,
    correlations: PropTypes.object.isRequired,
  }).isRequired,
  platform: PropTypes.string.isRequired,
  region: PropTypes.string.isRequired,
};

export default DataTabs;

import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CorrelationChart = ({ correlations }) => {
  // Check if there are numeric values to plot, otherwise handle the "no correlations" case
  const hasNumericData = Object.keys(correlations).length > 0 && !correlations.message;

  // If numeric data exists, transform it for the chart
  const data = hasNumericData
    ? Object.entries(correlations).map(([key, value]) => ({
        name: key,
        ...value,
      }))
    : [];

  return (
    <div>
      {hasNumericData ? (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {/* Add Bar components for each correlation column */}
            {Object.keys(data[0]).filter(key => key !== 'name').map((key, index) => (
              <Bar key={key} dataKey={key} fill={index % 2 === 0 ? "#8884d8" : "#82ca9d"} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <Typography variant="h6" color="textSecondary">
          Aucune colonne numérique disponible pour les corrélations.
        </Typography>
      )}
    </div>
  );
};

// PropTypes validation
CorrelationChart.propTypes = {
  correlations: PropTypes.oneOfType([
    PropTypes.objectOf(PropTypes.object), // For valid numeric correlations
    PropTypes.shape({
      message: PropTypes.string, // For the "no correlations" message
    }),
  ]).isRequired,
};

export default CorrelationChart;

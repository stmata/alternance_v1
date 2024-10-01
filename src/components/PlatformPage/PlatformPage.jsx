import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DataTabs from '../DataTabs/DataTabs';
import { ClipLoader } from 'react-spinners';
import './PlatformPage.css'
import { Alert, Button } from '@mui/material';  // Import Material UI components for modern styling

const PlatformPage = () => {
  const { platform = 'apec', region = 'ile-de-france' } = useParams();  // Extract platform and region from the URL params
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);  // Track loading state
  const [error, setError] = useState(null);  // Track error state
  const baseUrl = import.meta.env.VITE_APP_BASE_URL


  // UseEffect to fetch new data every time platform or region changes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);  // Set loading to true whenever the platform or region changes
      setError(null);  // Reset error state
      try {
        const region2 = region.replaceAll('-', '_');
        console.log(region2)
        console.log(baseUrl)
        console.log(platform)
        const response = await fetch(`${baseUrl}/analyze-data/${platform}/${region2}`);
        if (!response.ok) throw new Error('Failed to fetch data');
        const result = await response.json();
        setData(result);  // Set the new data
      } catch (error) {
        setError(error.message);  // Catch and set any errors
      } finally {
        setLoading(false);  // Ensure the loader is stopped once the data is fetched or an error occurs
      }
    };
    fetchData();
  }, [platform, region]);  // Trigger the effect whenever platform or region changes

  if (loading) {
    return (
      <div className="loader-container">
        <ClipLoader color='#171C3F' loading={loading} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
  <Alert severity="error" className="error-message" icon={false}>
    <div className="centered-icon">
      <Alert severity="error" />
    </div>
    <h2>Oops! Something went wrong.</h2>
    <Button
      variant="contained"
      color="primary"
      onClick={() => window.location.reload()}
      className="retry-button"
    >
      Retry
    </Button>
  </Alert>
</div>

    );
  }

  return (
    <div className="platform-page">
      <h1>Jobs for {platform} in {region}.</h1>
      {data ? <DataTabs data={data} platform={platform} region={region} /> : <p>No data found.</p>}
    </div>
  );
};

export default PlatformPage;

import { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../../AppContext';
import './SmartFilter.css';
import { InsertDriveFile } from '@mui/icons-material';

const SmartFilter = () => {
  const { setFileSummary, setTextSummary } = useContext(AppContext); // Destructure the context for summaries
  const [selectedFile, setSelectedFile] = useState(null);
  const [promptText, setPromptText] = useState('');
  const [isFileSummarized, setIsFileSummarized] = useState(false);
  const [isTextSummarized, setIsTextSummarized] = useState(false);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [isLoadingText, setIsLoadingText] = useState(false);
  const [fileName, setFileName] = useState(null);
  const [hasCvResults, setHasCvResults] = useState(false); // New state for CV results
  const [hasPromptResults, setHasPromptResults] = useState(false); // New state for prompt results
  const baseUrl = import.meta.env.VITE_APP_BASE_URL;

  // Load saved file, prompt, and check for stored results from sessionStorage on component mount
  useEffect(() => {
    const savedFile = sessionStorage.getItem('uploadedFileName');
    const savedPrompt = sessionStorage.getItem('savedPrompt');
    const cvStoredResults = sessionStorage.getItem('cvStoredResults');
    const promptStoredResults = sessionStorage.getItem('promptStoredResults');

    if (savedFile) {
      setFileName(savedFile);
    }

    if (savedPrompt) {
      setPromptText(savedPrompt);
    }

    if (cvStoredResults) {
      setHasCvResults(true);
    }

    if (promptStoredResults) {
      setHasPromptResults(true);
    }
  }, []);

  const normalizeString = (str) => {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/-/g, '_');
  };

  // Function to call prediction API after summarization is done (for both CV and Prompt)
  const handlePredict = async (summary, type) => {
    const platform = sessionStorage.getItem('platform');
    const region = sessionStorage.getItem('region');

    if (!platform || !region || !summary) {
      console.error('Missing data for prediction.');
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/predict_summary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          platform: normalizeString(platform),
          region: normalizeString(region),
          summarized_text: summary,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (type === 'cv') {
          sessionStorage.setItem('cvStoredResults', JSON.stringify(data.top_similar_jobs));
          setHasCvResults(true);
        } else if (type === 'prompt') {
          sessionStorage.setItem('promptStoredResults', JSON.stringify(data.top_similar_jobs));
          setHasPromptResults(true);
        }
        console.log('Prediction done successfully.');
      } else {
        throw new Error('Failed to get prediction.');
      }
    } catch (error) {
      console.error('Error fetching prediction:', error);
    }
  };

  // Handle file change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
      setIsFileSummarized(false); // Reset summarization state if file changes
      setHasCvResults(false); // Reset the CV results state

      // Save file name to sessionStorage
      sessionStorage.setItem('uploadedFileName', file.name);
    }
  };

  // Start file matching with prediction
  const handleStartMatching = async () => {
    if (selectedFile && !isFileSummarized) {
      setIsLoadingFile(true);
      const formData = new FormData();
      formData.append('file', selectedFile);
      try {
        const response = await fetch(`${baseUrl}/summarize_file`, {
          method: 'POST',
          body: formData,
        });
        if (response.ok) {
          const data = await response.json();
          sessionStorage.setItem('fileSummary', data.summary);
          setFileSummary(data.summary);
          setIsFileSummarized(true);

          // Call prediction API for CV after summarization
          await handlePredict(data.summary, 'cv');
        } else {
          throw new Error('Failed to summarize the file.');
        }
      } catch (error) {
        console.error('Error summarizing file:', error);
        alert('Failed to summarize the file.');
      } finally {
        setIsLoadingFile(false);
      }
    }
  };

  // Start prompt matching with prediction
  const handleStartPrompt = async () => {
    if (promptText.trim() && !isTextSummarized) {
      setIsLoadingText(true);
      try {
        const response = await fetch(`${baseUrl}/summarize_text`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: promptText,
          }),
        });
        if (response.ok) {
          const data = await response.json();
          sessionStorage.setItem('textSummary', data.summary);
          setTextSummary(data.summary);
          setIsTextSummarized(true);

          // Save prompt to sessionStorage
          sessionStorage.setItem('savedPrompt', promptText);

          // Call prediction API for prompt after summarization
          await handlePredict(data.summary, 'prompt');
        } else {
          throw new Error('Failed to summarize the text.');
        }
      } catch (error) {
        console.error('Error summarizing text:', error);
        alert('Failed to summarize the text.');
      } finally {
        setIsLoadingText(false);
      }
    }
  };

  // Handle prompt input change and save to sessionStorage
  const handlePromptChange = (e) => {
    const value = e.target.value;
    setPromptText(value);
    setIsTextSummarized(false); // Reset summarization state if prompt changes
    setHasPromptResults(false); // Reset the prompt results state

    // Save prompt to sessionStorage
    sessionStorage.setItem('savedPrompt', value);
  };

  return (
    <div className="smart-filter-container2">
      <div className="filter-section">
        <h2>Upload Your Resume for Alternance Matches:</h2>
        <p>By uploading your CV to our advanced matching platform, you unlock a powerful tool designed to thoroughly analyze your academic background, work experience, and unique skill set. This enables the platform to provide highly personalized job matches, helping you take a major step forward in your marketing career.</p>

        <div className="file-upload-form">
          <h2 className="file-upload-title">Upload and attach files</h2>
          <div className="file-upload-box">
            <input
              type="file"
              id="file"
              className="file-input"
              accept="application/pdf"
              onChange={handleFileChange}
            />
            <label htmlFor="file" className="file-label">
              <InsertDriveFile className="upload-icon" />
              {fileName ? fileName : 'Click to upload or drag and drop'}
            </label>
            {fileName && <p className="file-size">{fileName}</p>}
          </div>
        </div>

        {hasCvResults ? (
  <Link to="/rslts00?type=cv" className="link-button">
    <button className="button-active">View CV Results</button>
  </Link>
) : (
  <button
    className={(!selectedFile || isFileSummarized || isLoadingFile) ? 'disabled-button' : 'button-active'}
    disabled={!selectedFile || isFileSummarized || isLoadingFile}
    onClick={handleStartMatching}
  >
    {isLoadingFile ? 'Processing...' : isFileSummarized ? 'View CV Results' : 'Start Matching'}
  </button>
)}
      </div>

      <div className="divider"></div>

      <div className="filter-section">
        <h2>Enter Your Marketing Role Preferences:</h2>
        <p>Looking for your next marketing role? Simply enter your desired criteria into our intelligent search system. Our AI-powered tool will match you with the best opportunities tailored to your preferences. Start your search now and discover roles that fit your skills and goals. Effortlessly find your perfect marketing job today!</p>
        <textarea
          value={promptText}
          onChange={handlePromptChange}
          placeholder="Please provide a detailed description of the position you're seeking, including your desired job title, key skills, preferred responsibilities, and objectives for the role. The more specific and complete your input, the better we can match you with relevant alternance offers."
        />

{hasPromptResults ? (
  <Link to="/rslts00?type=prompt" className="link-button2">
    <button className="button-active">View Prompt Results</button>
  </Link>
) : (
  <button
    className={(!promptText.trim() || isLoadingText) ? 'disabled-button' : 'button-active'}
    disabled={!promptText.trim() || isLoadingText}
    onClick={handleStartPrompt}
  >
    {isLoadingText ? 'Processing...' : isTextSummarized ? 'View Prompt Results' : 'Start Matching'}
  </button>
)}
      </div>
    </div>
  );
};

export default SmartFilter;
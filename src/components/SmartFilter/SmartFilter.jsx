import { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../../AppContext';
import './SmartFilter.css';
import { InsertDriveFile } from '@mui/icons-material';
import LastRequest from '../LastRequest/LastRequest';

const SmartFilter = () => {
  const {
    setNewDataAdded,
    setFileSummary,
    setTextSummary,
    setIsChanged,
    isChanged,
    hasCvResults,
    setHasCvResults,
    hasPromptResults,
    setHasPromptResults,
    setIsChanged2,
    isChanged2,
    platform,
    region,
  } = useContext(AppContext);

  const [selectedFile, setSelectedFile] = useState(null);
  const [promptText, setPromptText] = useState('');
  const [isFileSummarized, setIsFileSummarized] = useState(false);
  const [isTextSummarized, setIsTextSummarized] = useState(false);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [isLoadingText, setIsLoadingText] = useState(false);
  const [fileName, setFileName] = useState(null);

  const baseUrl = import.meta.env.VITE_APP_BASE_URL;

  // Load stored data from sessionStorage
  useEffect(() => {
    const savedFile = sessionStorage.getItem('uploadedFileName');
    const savedPrompt = sessionStorage.getItem('savedPrompt');
    const cvStoredResults = sessionStorage.getItem('cvStoredResults');
    const promptStoredResults = sessionStorage.getItem('promptStoredResults');
    const fileSummarized = sessionStorage.getItem('isFileSummarized');
    const textSummarized = sessionStorage.getItem('isTextSummarized');

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

    if (fileSummarized === 'true') {
      setIsFileSummarized(true);
    }

    if (textSummarized === 'true') {
      setIsTextSummarized(true);
    }
  }, []);

  // Réinitialiser les résultats lorsque platform ou region changent
  useEffect(() => {
    if (platform && region) {
      if (isFileSummarized) {
        setIsLoadingFile(true);
        setHasCvResults(false);
        setIsChanged(true);
        sessionStorage.removeItem('cvStoredResults');
      }
      if (isTextSummarized) {   
        setIsLoadingText(true);
        setHasPromptResults(false);
        setIsChanged2(true);
        sessionStorage.removeItem('promptStoredResults');
      }
    }
  }, [platform, region]);

  // Normalize strings for requests
  const normalizeString = (str) => {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/-/g, '_');
  };

  // Save the last request after prediction
  // const saveLastRequest = async (
  //   summary,
  //   results,
  //   type,
  //   fileName = null,
  //   promptText = null,
  //   region,
  //   platform
  // ) => {
  //   const user_id = sessionStorage.getItem('user_id');
  //   console.log(user_id)
  //   if (!user_id || !summary || !results || !type || !platform || !region) {
  //     console.error('Missing data for saving last request');
  //     return;
  //   }

  //   try {
  //     const response = await fetch(`http://127.0.0.1:8000/add-last-request`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         file_name: type === 'cv' ? fileName : null,
  //         prompt_text: type === 'prompt' ? promptText : null,
  //         type: type,
  //         summary: summary,
  //         results: results,
  //         user_id: user_id,  // Ensure user_id is correctly passed as a string
  //         region: region,
  //         platform: platform,
  //       }),
      
  //     });

  //     if (!response.ok) {
  //       throw new Error('Failed to save last request');
  //     }
  //     console.log('Last request saved successfully.');
  //   } catch (error) {
  //     console.error('Error saving last request:', error);
  //   }
  // };

  // Handle prediction after summarization
  const handlePredict = async (summary, type) => {
    if (!platform || !region || !summary) {
      console.error('Missing data for prediction.');
      return;
    }

    try {
      if (type === 'cv') {
        setIsLoadingFile(true);
      } else if (type === 'prompt') {
        setIsLoadingText(true);
      }

      console.log(
        `Predicting for ${type}: Platform - ${platform}, Region - ${region}, Summary - ${summary}`
      );
      // Prepare request body
      const requestBody = {
        platform: normalizeString(platform),
        region: normalizeString(region),
        summarized_text: summary,
        type_summary: type, // Sera défini en fonction de la condition
        user_id: sessionStorage.getItem("user_id"),
        filename: type === 'cv' ? fileName : promptText,
    };
    
    
      // Send the request
      const response = await fetch(`${baseUrl}/analytics/predict_summary`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const data = await response.json();
        setNewDataAdded(true);
        if (type === 'cv') {
          sessionStorage.setItem('cvStoredResults', JSON.stringify(data.top_similar_jobs));
          setHasCvResults(true);
          setIsChanged(false);
    
          // Sauvegarde de la dernière requête pour CV
        } else if (type === 'prompt') {
          sessionStorage.setItem('promptStoredResults', JSON.stringify(data.top_similar_jobs));
          setHasPromptResults(true);
          setIsChanged2(false);
    
        }
      } else {
        throw new Error('Échec de la récupération de la prédiction.');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de la prédiction:', error);
    } finally {
      if (type === 'cv') {
        setIsLoadingFile(false);
      } else if (type === 'prompt') {
        setIsLoadingText(false);
      }
    }};

  // Handle CV file change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
      setIsFileSummarized(false);
      setHasCvResults(false);
      setIsChanged(true);

      // Clear old results to force new prediction
      sessionStorage.removeItem('cvStoredResults');
      sessionStorage.setItem('uploadedFileName', file.name);
    }
  };

  // Handle start matching for CV
  const handleStartMatching = async () => {
    if (selectedFile && !isFileSummarized) {
      setIsLoadingFile(true);
      const formData = new FormData();
      formData.append('file', selectedFile);
      try {
        console.log('Summarizing file...');
        const response = await fetch(`${baseUrl}/summarize/file`, {
          method: 'POST',
          body: formData,
        });
        if (response.ok) {
          const data = await response.json();
          sessionStorage.setItem('fileSummary', data.summary);
          setFileSummary(data.summary);
          setIsFileSummarized(true);
          setIsChanged(true);
          sessionStorage.setItem('isFileSummarized', 'true');
          console.log('File summarized successfully');
        } else {
          throw new Error('Failed to summarize the file.');
        }
      } catch (error) {
        console.error('Error summarizing file:', error);
        alert('Failed to summarize the file.');
      } finally {
        setIsLoadingFile(false);
      }
    } else if (isFileSummarized) {
      const savedFileSummary = sessionStorage.getItem('fileSummary');
      console.log('File already summarized, triggering prediction.');
      setIsChanged(true);
      await handlePredict(savedFileSummary, 'cv');
    }
  };

  // Handle start matching for prompt
  const handleStartPrompt = async () => {
    if (promptText.trim() && !isTextSummarized) {
      setIsLoadingText(true);
      try {
        console.log('Summarizing text...');
        const response = await fetch(`${baseUrl}/summarize/text`, {
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
          setIsChanged2(true);
          sessionStorage.setItem('isTextSummarized', 'true');
          sessionStorage.setItem('savedPrompt', promptText);
          console.log('Text summarized successfully');
        } else {
          throw new Error('Failed to summarize the text.');
        }
      } catch (error) {
        console.error('Error summarizing text:', error);
        alert('Failed to summarize the text.');
      } finally {
        setIsLoadingText(false);
      }
    } else if (isTextSummarized) {
      const savedTextSummary = sessionStorage.getItem('textSummary');
      console.log('Text already summarized, triggering prediction.');
      setIsChanged2(true);
      await handlePredict(savedTextSummary, 'prompt');
    }
  };

  // Handle prompt text change
  const handlePromptChange = (e) => {
    const value = e.target.value;
    setPromptText(value);
    setIsTextSummarized(false); // Reset summary
    setHasPromptResults(false); // Clear old results
    setIsChanged2(true); // Mark as changed

    // Clear stored results to force new prediction
    sessionStorage.removeItem('promptStoredResults');
    sessionStorage.setItem('savedPrompt', value);
  };

  // Trigger predictions on changes
  useEffect(() => {
    const savedFileSummary = sessionStorage.getItem('fileSummary');
    const savedTextSummary = sessionStorage.getItem('textSummary');

    if (
      isChanged &&
      savedFileSummary &&
      isFileSummarized &&
      platform &&
      region
    ) {
      console.log('Triggering file prediction');
      setIsLoadingFile(true);
      handlePredict(savedFileSummary, 'cv');
      setIsChanged(false);
    }

    if (
      isChanged2 &&
      savedTextSummary &&
      isTextSummarized &&
      platform &&
      region
    ) {
      console.log('Triggering prompt prediction');
      setIsLoadingText(true)
      handlePredict(savedTextSummary, 'prompt');
      setIsChanged2(false);
    }
  }, [
    isFileSummarized,
    isTextSummarized,
    isChanged,
    isChanged2,
    platform,
    region,
  ]);

  return (
    <div>
      <div className="smart-filter-container2">
      <div className="filter-section">
        <h2>Upload Your Resume for Alternance Matches:</h2>
        <p>
          By uploading your CV to our advanced matching platform, you unlock a powerful tool designed
          to thoroughly analyze your academic background, work experience, and unique skill set.
          This enables the platform to provide highly personalized job matches, helping you take a
          major step forward in your marketing career.
        </p>

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
            <button
        className={isLoadingFile ? 'disabled-button' : 'button-active'}
        disabled={isLoadingFile || !platform || !region}
     >
      {isLoadingFile ? 'Processing...' : 'View CV Results'}
      </button>
          </Link>
        ) : (
          <button
            className={
              (!selectedFile || isLoadingFile || !platform || !region)
                ? 'disabled-button'
                : 'button-active'
            }
            disabled={
              !selectedFile ||
              isLoadingFile ||
              !platform ||
              !region
            }
            onClick={handleStartMatching}
          >
            {isLoadingFile ? 'Processing...' : 'Start Matching'}
          </button>
        )}
      </div>
      <div className="divider"></div>
      <div className="filter-section">
        <h2>Enter Your Marketing Role Preferences:</h2>
        <p>
          Looking for your next marketing role? Simply enter your desired criteria into our
          intelligent search system. Our AI-powered tool will match you with the best opportunities
          tailored to your preferences. Start your search now and discover roles that fit your
          skills and goals. Effortlessly find your perfect marketing job today!
        </p>
        <textarea
          value={promptText}
          onChange={handlePromptChange}
          placeholder="Please provide a detailed description of the position you're seeking, including your desired job title, key skills, preferred responsibilities, and objectives for the role. The more specific and complete your input, the better we can match you with relevant alternance offers."
        />

        {hasPromptResults ? (
          <Link to="/rslts00?type=prompt" className="link-button2">
            <button
     className={isLoadingText ? 'disabled-button' : 'button-active'}
    disabled={isLoadingText || !platform || !region}
   >
      {isLoadingText ? 'Processing...' : 'View Prompt Results'}
    </button>
          </Link>
        ) : (
          <button
            className={
              (!promptText.trim() || isLoadingText || !platform || !region)
                ? 'disabled-button'
                : 'button-active'
            }
            disabled={
              !promptText.trim() ||
              isLoadingText ||
              !platform ||
              !region
            }
            onClick={handleStartPrompt}
          >
            {isLoadingText ? 'Processing...' : 'Start Matching'}
          </button>
        )}
      </div>
    </div>
    <LastRequest  />

    </div>
    
  );
};

export default SmartFilter;

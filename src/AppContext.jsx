import { createContext, useState, useEffect } from 'react';

// Create a context
export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [platform, setPlatform] = useState(sessionStorage.getItem('platform') || 'apec');
  const [region, setRegion] = useState(sessionStorage.getItem('region') || 'ile_de_france');
  const [searchTerm, setSearchTerm] = useState('');
  const [fileSummary, setFileSummary] = useState(sessionStorage.getItem('fileSummary') || '');
  const [textSummary, setTextSummary] = useState(sessionStorage.getItem('textSummary') || '');

  // Save to sessionStorage when values change
  useEffect(() => {
    sessionStorage.setItem('platform', platform);
  }, [platform]);

  useEffect(() => {
    sessionStorage.setItem('region', region);
  }, [region]);

  useEffect(() => {
    if (fileSummary) {
      sessionStorage.setItem('fileSummary', fileSummary);
    }
  }, [fileSummary]);

  useEffect(() => {
    if (textSummary) {
      sessionStorage.setItem('textSummary', textSummary);
    }
  }, [textSummary]);

  return (
    <AppContext.Provider value={{ platform, setPlatform, region, setRegion, searchTerm, setSearchTerm, fileSummary, setFileSummary, textSummary, setTextSummary }}>
      {children}
    </AppContext.Provider>
  );
};

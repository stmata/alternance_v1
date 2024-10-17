import React, { createContext, useState, useEffect } from 'react';

// Créer un contexte global
export const AppContext = createContext();
export const AppProvider = ({ children }) => {
  const [platform, setPlatform] = useState(sessionStorage.getItem('platform') || 'apec');
  const [region, setRegion] = useState(sessionStorage.getItem('region') || 'ile_de_france');
  const [searchTerm, setSearchTerm] = useState('');
  const [fileSummary, setFileSummary] = useState(sessionStorage.getItem('fileSummary') || '');
  const [textSummary, setTextSummary] = useState(sessionStorage.getItem('textSummary') || '');
  const [smartPlatform, setSmartPlatform] = useState(sessionStorage.getItem('smartPlatform') || '');
  const [smartRegion, setSmartRegion] = useState(sessionStorage.getItem('smartRegion') || '');
  const [hasCvResults, setHasCvResults] = useState(
    sessionStorage.getItem('hasCvResults') === 'true' || false
  );
  const [isAuthenticated, setIsAuthenticated] = useState(
    sessionStorage.getItem('isAuthenticated') === 'true' || false
  );
  const [firstVisitPlatform, setFirstVisitPlatform] = useState(
    sessionStorage.getItem('firstVisitPlatform') === 'false' ? false : true
  );
  const [firstVisitRegion, setFirstVisitRegion] = useState(
    sessionStorage.getItem('firstVisitRegion') === 'false' ? false : true
  );
  const [isChanged, setIsChanged] = useState(
    sessionStorage.getItem('isChanged') === 'true' ? true : false
  );
  const [isChanged2, setIsChanged2] = useState(
    sessionStorage.getItem('isChanged2') === 'true' ? true : false
  );
  const [hasPromptResults, setHasPromptResults] = useState(
    sessionStorage.getItem('hasPromptResults') === 'true' || false
  );
  
  useEffect(() => {
    sessionStorage.setItem('hasCvResults', hasCvResults ? 'true' : 'false');
  }, [hasCvResults]);
  useEffect(() => {
    sessionStorage.setItem('hasPromptResults', hasPromptResults ? 'true' : 'false');
  }, [hasPromptResults]);
  useEffect(() => {
    sessionStorage.setItem('isChanged', isChanged ? 'false' : 'true');
  }, [isChanged]);
  useEffect(() => {
    sessionStorage.setItem('isChanged2', isChanged2 ? 'false' : 'true');
  }, [isChanged2]);
  useEffect(() => {
    sessionStorage.setItem('hasCvResults', hasCvResults ? 'true' : 'false');
  }, [hasCvResults]);

  useEffect(() => {
    sessionStorage.setItem('firstVisitPlatform', firstVisitPlatform ? 'true' : 'false');
  }, [firstVisitPlatform]);

  useEffect(() => {
    sessionStorage.setItem('firstVisitRegion', firstVisitRegion ? 'true' : 'false');
  }, [firstVisitRegion]);

  // Synchroniser les valeurs avec sessionStorage
  useEffect(() => {
    sessionStorage.setItem('isAuthenticated', isAuthenticated);
  }, [isAuthenticated]);
  useEffect(() => {
    sessionStorage.setItem('smartPlatform', smartPlatform);
    sessionStorage.setItem('smartRegion', smartRegion);
  }, [smartPlatform, smartRegion]);

  // Gestion des changements manuels dans le sessionStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const newPlatform = sessionStorage.getItem('platform');
      const newRegion = sessionStorage.getItem('region');
      if (newPlatform !== platform) setPlatform(newPlatform);
      if (newRegion !== region) setRegion(newRegion);
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [platform, region]);

  // Mettre à jour le sessionStorage à chaque changement
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
    <AppContext.Provider value={{hasPromptResults, setHasPromptResults, isAuthenticated, setIsAuthenticated, platform, setPlatform, region, setRegion, searchTerm, setSearchTerm, fileSummary, setFileSummary, textSummary, setTextSummary, smartPlatform, setSmartPlatform, smartRegion, setSmartRegion, firstVisitPlatform, setFirstVisitPlatform, firstVisitRegion, setFirstVisitRegion, isChanged, setIsChanged, hasCvResults, setHasCvResults, isChanged2, setIsChanged2 }}>
      {children}
    </AppContext.Provider>
  );
};

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
  const [isAuthenticated, setIsAuthenticated] = useState(
    sessionStorage.getItem('isAuthenticated') === 'true' || false
  );

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
    <AppContext.Provider value={{isAuthenticated, setIsAuthenticated, platform, setPlatform, region, setRegion, searchTerm, setSearchTerm, fileSummary, setFileSummary, textSummary, setTextSummary, smartPlatform, setSmartPlatform, smartRegion, setSmartRegion }}>
      {children}
    </AppContext.Provider>
  );
};

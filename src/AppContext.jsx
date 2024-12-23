import { createContext, useState, useEffect } from 'react';

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
  const [savedPrompt, setsavedPrompt] = useState(sessionStorage.getItem('savedPrompt') || '');
  const [fileName, setfileName] = useState(sessionStorage.getItem('fileName') || '');
  const [userId, setUserId] = useState(sessionStorage.getItem('user_id') || '');
  const [email, setEmail] = useState(sessionStorage.getItem('userEmail') || '');
  const [etudeLevel, setEtudeLevel] = useState(sessionStorage.getItem('etudeLevel') || 'Bac+3');
  const [new_data_added, setNewDataAdded] = useState(
    sessionStorage.getItem('new_data_added') === 'true' || false
  );
  const [language, setLanguage] = useState(sessionStorage.getItem('language') || 'fr');  useEffect(() => {
    sessionStorage.setItem('language', language);
  }, [language]);

  useEffect(() => {
    sessionStorage.setItem('new_data_added', new_data_added ? 'true' : 'false'); // Sauvegarder new_data_added dans sessionStorage
  }, [new_data_added]);

  useEffect(() => {
    if (email) {
      sessionStorage.setItem('userEmail', email);
    }
  }, [email]);
  useEffect(() => {
    if (userId) {
      sessionStorage.setItem('user_id', userId); // Save user_id to sessionStorage
    }
  }, [userId]);

  useEffect(() => {
    if (etudeLevel) {
      sessionStorage.setItem('etudeLevel', etudeLevel);
    }
  }, [etudeLevel]);

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

  const [isFirstVisitSmartMatching, setIsFirstVisitSmartMatching] = useState(
    sessionStorage.getItem('isFirstVisitSmartMatching') === 'false' ? false : true
  );
    
  const [isChanged, setIsChanged] = useState(false);
  const [isChanged2, setIsChanged2] = useState(false);
  const [hasPromptResults, setHasPromptResults] = useState(
    sessionStorage.getItem('hasPromptResults') === 'true' || false
  );
  
  useEffect(() => {
    if (isFirstVisitSmartMatching) {
      sessionStorage.setItem('isFirstVisitSmartMatching', 'false');
    }
  }, [isFirstVisitSmartMatching]);

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

  useEffect(() => {
    if (fileName) {
      sessionStorage.setItem('uploadedFileName', fileName); // Save file name to sessionStorage
    }
  }, [fileName]);

  useEffect(() => {
    if (savedPrompt) {
      sessionStorage.setItem('savedPrompt', savedPrompt); // Save prompt to sessionStorage
    }
  }, [savedPrompt]);

  return (
    <AppContext.Provider value={{language, setLanguage,new_data_added, setNewDataAdded, email, setEmail, userId, setUserId, fileName, setfileName, savedPrompt, setsavedPrompt, hasPromptResults, setHasPromptResults, hasCvResults, setHasCvResults, isAuthenticated, setIsAuthenticated, platform, setPlatform, region, setRegion, searchTerm, setSearchTerm, fileSummary, setFileSummary, textSummary, setTextSummary, smartPlatform, setSmartPlatform, smartRegion, setSmartRegion, firstVisitPlatform, setFirstVisitPlatform, firstVisitRegion, setFirstVisitRegion, isChanged, setIsChanged, isChanged2, setIsChanged2, etudeLevel, setEtudeLevel, isFirstVisitSmartMatching, setIsFirstVisitSmartMatching }}>
      {children}
    </AppContext.Provider>
  );
};

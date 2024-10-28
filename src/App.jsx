import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from './AppContext';
import Navbar from './components/Navbar/Navbar';
import LoginForm from './components/LoginForm/LoginForm';
import ProtectedRoute from './auth/ProtedtedRoute';
import PlatformPage from './components/PlatformPage/PlatformPage';
import SmartFilter from './components/SmartFilter/SmartFilter';
import RstMatching from './components/RstMatching/RstMatching';
import ErrorPage from './components/ErrorPage/ErrorPage';
import { useEffect } from 'react';
import ListOfLikes from './components/ListOfLikes/ListOfLikes';
import LanguageSwitcher from './components/LanguageSwitcher/LanguageSwitcher';

import './i18n';

function App() {
  const location = useLocation(); // Get the current location

  const validPaths = [
    '/PlatformPage',
    '/SmartMatching',
    '/rslts00',
    '/ListOfLikes',
    '/historyRslts' // Add new valid path for HistoryRslts
  ];

  const isValidPath = validPaths.includes(location.pathname);

  useEffect(() => {
    // Vérifie le mode de couleur au chargement
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const themePreference = darkModeQuery.matches ? 'dark' : 'light';

    // Enregistre la préférence dans la session
    sessionStorage.setItem('theme', themePreference);

    // Applique le style basé sur la préférence
    if (themePreference === 'dark') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }

    // Écoute les changements de thème du système
    const handleThemeChange = (e) => {
      const newTheme = e.matches ? 'dark' : 'light';
      sessionStorage.setItem('theme', newTheme);
      if (newTheme === 'dark') {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
    };

    darkModeQuery.addEventListener('change', handleThemeChange);

    // Nettoyage de l'écouteur
    return () => {
      darkModeQuery.removeEventListener('change', handleThemeChange);
    };
  }, []);

  return (
    <AppProvider>
      <div className="app-container">
        {/* Afficher la navbar si la route est valide */}
        {location.pathname !== '/' && isValidPath && <Navbar />}
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route
            path="/PlatformPage"
            element={
              <ProtectedRoute>
                <PlatformPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/SmartMatching"
            element={
              <ProtectedRoute>
                <SmartFilter />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ListOfLikes"
            element={
              <ProtectedRoute>
                <ListOfLikes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rslts00"
            element={
              <ProtectedRoute>
                <RstMatching />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
        <LanguageSwitcher />
      </div>
    </AppProvider>
  );
}

function WrappedApp() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default WrappedApp;

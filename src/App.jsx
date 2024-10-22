import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from './AppContext';
import Navbar from './components/Navbar/Navbar';
import LoginForm from './components/LoginForm/LoginForm';
import ProtectedRoute from './auth/ProtedtedRoute';
import PlatformPage from './components/PlatformPage/PlatformPage';
import SmartFilter from './components/SmartFilter/SmartFilter';
import RstMatching from './components/RstMatching/RstMatching';
import HistoryRslts from './components/HistoryRslts/HistoryRslts'; // Import the new component
import ErrorPage from './components/ErrorPage/ErrorPage';
import React, { useEffect } from 'react';
import ListOfLikes from './components/ListOfLikes/ListOfLikes';

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
    // Force le mode clair en modifiant directement le style du body
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');

    if (darkModeQuery.matches) {
      document.body.style.backgroundColor = 'white';
      document.body.style.color = 'black';
    }

    // Fonction de gestion des changements du mode de la plateforme
    const handleThemeChange = (e) => {
      if (e.matches) {
        document.body.style.backgroundColor = 'white';
        document.body.style.color = 'black';
      }
    };

    // Ajoutez un écouteur pour détecter les changements dans le mode de la plateforme
    darkModeQuery.addEventListener('change', handleThemeChange);

    // Nettoyage de l'écouteur à la fin
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
          <Route
            path="/historyRslts"
            element={
              <ProtectedRoute>
                <HistoryRslts /> {/* Add the new component here */}
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
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

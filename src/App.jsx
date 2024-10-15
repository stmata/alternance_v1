import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import PlatformPage from './components/PlatformPage/PlatformPage';
import { AppProvider } from './AppContext';
import SmartFilter from './components/SmartFilter/SmartFilter';
import RstMatching from './components/RstMatching/RstMatching';
import LoginForm from './components/LoginForm/LoginForm';

function App() {
  const location = useLocation(); // Get the current location

  return (
    <AppProvider>
      {/* Conditionally render the Navbar only when the path is not '/' */}
      {location.pathname !== '/' && <Navbar />}
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/PlatformPage" element={<PlatformPage />} />
        <Route path="/SmartMatching" element={<SmartFilter />} />
        <Route path="/rslts00" element={<RstMatching />} />
      </Routes>
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

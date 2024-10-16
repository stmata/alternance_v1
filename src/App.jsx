import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from './AppContext';
import Navbar from './components/Navbar/Navbar';
import LoginForm from './components/LoginForm/LoginForm';
import ProtectedRoute from './auth/ProtedtedRoute';
import PlatformPage from './components/PlatformPage/PlatformPage';
import SmartFilter from './components/SmartFilter/SmartFilter';
import RstMatching from './components/RstMatching/RstMatching';
import ErrorPage from './components/ErrorPage/ErrorPage';

function App() {
  const location = useLocation(); // Get the current location

  const validPaths = [
    '/PlatformPage',
    '/SmartMatching',
    '/rslts00'
  ];

  const isValidPath = validPaths.includes(location.pathname);


  return (
    <AppProvider>
      {/* Conditionally render the Navbar only when the path is not '/' */}
    
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
        path="/rslts00"
        element={
          <ProtectedRoute>
            <RstMatching />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<ErrorPage />} />
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

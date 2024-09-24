import Navbar from './components/Navbar/Navbar';
import PlatformPage from './components/PlatformPage/PlatformPage';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
      <Route path="/" element={<PlatformPage />} />
      <Route path="/:platform/:region" element={<PlatformPage />} />
      </Routes>
    </Router>
  );
}

export default App;

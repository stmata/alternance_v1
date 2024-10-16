import React, { useState, useEffect, useRef, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faMapMarkerAlt, faSignOutAlt, faSearch, faLightbulb } from '@fortawesome/free-solid-svg-icons';
import './Navbar.css';
import logo from '../../assets/logo.png';
import { AppContext } from '../../AppContext'; // Import du contexte
import { useNavigate, useLocation } from 'react-router-dom'; // Import du hook useNavigate et useLocation
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [platformDropdownOpen, setPlatformDropdownOpen] = useState(false);
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { platform, setPlatform, region, setRegion, searchTerm, setSearchTerm, setIsAuthenticated} = useContext(AppContext);

  const navigate = useNavigate();
  const location = useLocation();  // Get the current route
  const platformRef = useRef(null);
  const locationRef = useRef(null);
  const menuRef = useRef(null);

  // Fonction pour gérer l'ouverture/fermeture du menu
  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev); // Toggle du menu
  };

  // Fonction pour gérer la déconnexion
  const handleLogout = () => {
    localStorage.clear();  // Si vous utilisez localStorage
    sessionStorage.clear(); // Si vous utilisez sessionStorage
    setIsAuthenticated(false);
    navigate('/');  // Rediriger vers la page de connexion
  };
  
  // Handle platform selection and close the dropdown
  const handlePlatformSelect = (platform) => {
    setPlatform(platform);  
    sessionStorage.setItem('platform', platform);  
    setPlatformDropdownOpen(false);  
  };

  // Handle region selection and close the dropdown
  const handleRegionSelect = (region) => {
    setRegion(region);  
    sessionStorage.setItem('region', region);  
    setLocationDropdownOpen(false);  
  };

  // Ouvrir/fermer le dropdown au clic sur l'icône
  const togglePlatformDropdown = () => {
    setPlatformDropdownOpen((prev) => !prev); 
    setLocationDropdownOpen(false);  // Fermer l'autre dropdown
  };

  const toggleLocationDropdown = () => {
    setLocationDropdownOpen((prev) => !prev); 
    setPlatformDropdownOpen(false);  // Fermer l'autre dropdown
  };

  // Fermer le dropdown lorsque la souris quitte le dropdown lui-même
  const handleMouseLeaveDropdown = () => {
    setPlatformDropdownOpen(false);  
    setLocationDropdownOpen(false);  
  };

  // Fermer les dropdowns si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (platformRef.current && !platformRef.current.contains(event.target)) {
        setPlatformDropdownOpen(false);
      }
      if (locationRef.current && !locationRef.current.contains(event.target)) {
        setLocationDropdownOpen(false);
      }
      // Fermer le menu burger sur mobile s'il est ouvert et si on clique en dehors
      if (isMenuOpen && menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <>
      <div className="burger-menu" onClick={toggleMenu}> 
        <div className={isMenuOpen ? 'burger-bar top transform' : 'burger-bar top'} />
        <div className={isMenuOpen ? 'burger-bar middle hide' : 'burger-bar middle'} />
        <div className={isMenuOpen ? 'burger-bar bottom transform' : 'burger-bar bottom'} />
      </div>

      <nav className={`navbar ${isMenuOpen ? 'active' : ''}`} ref={menuRef}>
        <div className="logo">
          <Link to="/">
            <img src={logo} alt="Logo" />
          </Link>
        </div>

        {/* Dropdown des plateformes */}
        <div
          ref={platformRef}
          className="dropdownPlatform"
          onClick={togglePlatformDropdown} 
        >
          <FontAwesomeIcon icon={faBriefcase} color='#171C3F'/>
          <span>{platform || 'Platform'}</span>
          {platformDropdownOpen && (
            <ul className="dropdown-menu" onMouseLeave={handleMouseLeaveDropdown}> 
              <li onClick={() => handlePlatformSelect('Indeed')}>Indeed</li>
              <li onClick={() => handlePlatformSelect('LinkedIn')}>LinkedIn</li>
              <li onClick={() => handlePlatformSelect('Apec')}>Apec</li>
            </ul>
          )}
        </div>

        {/* Dropdown des régions */}
        <div
          ref={locationRef}
          className="dropdownRegion"
          onClick={toggleLocationDropdown}  
        >
          <FontAwesomeIcon icon={faMapMarkerAlt} color='#171C3F' />
          <span>{region || 'Location'}</span>
          {locationDropdownOpen && (
            <ul className="dropdown-menu" onMouseLeave={handleMouseLeaveDropdown}>  
              <li onClick={() => handleRegionSelect('Île-de-France')}>Île-de-France</li>
              <li onClick={() => handleRegionSelect('Hauts-de-France')}>Hauts-de-France</li>
            </ul>
          )}
        </div>

        {location.pathname === '/PlatformPage' && ( 
          <div className="job-input">
            <FontAwesomeIcon icon={faSearch} className="input-icon" color='#171C3F' />
            <input
              type="text"
              placeholder="Enter Job Title"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        )}

        <div className="smart-matching">
          <button className="smart-btn" onClick={() => navigate('/SmartMatching')}>
            <FontAwesomeIcon icon={faLightbulb} className="lightbulb-icon" color='#fff' />
            <span className="smart-text">Smart Matching</span>
          </button>
        </div>

        <div className="logout-icon" onClick={handleLogout}>
          <FontAwesomeIcon icon={faSignOutAlt} className="logout-btn" color='#171C3F' />
        </div>

      </nav>
    </>
  );
};

export default Navbar;

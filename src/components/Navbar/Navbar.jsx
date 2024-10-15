import React, { useState, useEffect, useRef, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faMapMarkerAlt, faSignOutAlt, faSearch, faLightbulb } from '@fortawesome/free-solid-svg-icons';
import './Navbar.css';
import logo from '../../assets/logo.png';
import { AppContext } from '../../AppContext'; // Import du contexte
import { useNavigate } from 'react-router-dom'; // Import du hook useNavigate
import { Link } from 'react-router-dom';



const Navbar = () => {
  const [platformDropdownOpen, setPlatformDropdownOpen] = useState(false);
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { platform, setPlatform, region, setRegion, searchTerm, setSearchTerm } = useContext(AppContext);


  const navigate = useNavigate()
  const platformRef = useRef(null);
  const locationRef = useRef(null);
  const menuRef = useRef(null);

  const handlePlatformSelect = (platform) => {
    setPlatform(platform);  // Utilisation du contexte pour sauvegarder la plateforme
    setPlatformDropdownOpen(false);  // Ferme la liste déroulante après la sélection
  };

  const handleRegionSelect = (region) => {
    setRegion(region);  // Utilisation du contexte pour sauvegarder la région
    setLocationDropdownOpen(false);
  };

  const togglePlatformDropdown = () => {
    setPlatformDropdownOpen((prev) => !prev);
    setLocationDropdownOpen(false);
  };

  const toggleLocationDropdown = () => {
    setLocationDropdownOpen((prev) => !prev);
    setPlatformDropdownOpen(false);
  };
  const handleLogout = () => {
    // Vider les sessions (localStorage ou sessionStorage)
    localStorage.clear();  // Si vous utilisez localStorage
    sessionStorage.clear(); // Si vous utilisez sessionStorage
    
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev); // Toggle du menu
  };

  // Gestion des clics en dehors du menu et des dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target) && 
        !event.target.closest('.burger-menu')
      ) {
        setIsMenuOpen(false);
      }
      if (platformRef.current && !platformRef.current.contains(event.target)) {
        setPlatformDropdownOpen(false);
      }
      if (locationRef.current && !locationRef.current.contains(event.target)) {
        setLocationDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="burger-menu" onClick={toggleMenu}>
        <div className={isMenuOpen ? 'burger-bar top transform' : 'burger-bar top'} />
        <div className={isMenuOpen ? 'burger-bar middle hide' : 'burger-bar middle'} />
        <div className={isMenuOpen ? 'burger-bar bottom transform' : 'burger-bar bottom'} />
      </div>

      <nav className={`navbar ${isMenuOpen ? 'active' : ''}`} ref={menuRef}>
        <div className="logo">

          <Link to="/PlatformPage">
    <img src={logo} alt="Logo" />
  </Link>
        </div>

        <div ref={platformRef} className="dropdownPlatform" onClick={togglePlatformDropdown}>
          <FontAwesomeIcon icon={faBriefcase} color='#171C3F'/>
          <span>{platform || 'Platform'}</span>
          {platformDropdownOpen && (
            <ul className="dropdown-menu">
              <li onClick={() => handlePlatformSelect('Indeed')}>Indeed</li>
              <li onClick={() => handlePlatformSelect('LinkedIn')}>LinkedIn</li>
              <li onClick={() => handlePlatformSelect('Apec')}>Apec</li>
            </ul>
          )}
        </div>

        <div ref={locationRef} className="dropdownRegion" onClick={toggleLocationDropdown}>
          <FontAwesomeIcon icon={faMapMarkerAlt} color='#171C3F' />
          <span>{region || 'Location'}</span>
          {locationDropdownOpen && (
            <ul className="dropdown-menu">
              <li onClick={() => handleRegionSelect('Île-de-France')}>Île-de-France</li>
              <li onClick={() => handleRegionSelect('Hauts-de-France')}>Hauts-de-France</li>
            </ul>
          )}
        </div>

        <div className="job-input">
          <FontAwesomeIcon icon={faSearch} className="input-icon" color='#171C3F' />
          <input
            type="text"
            placeholder="Enter Job Title"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

        </div>

        <div className="smart-matching">
        <button className="smart-btn" onClick={() => navigate('/SmartMatching')}>
        <FontAwesomeIcon icon={faLightbulb} className="lightbulb-icon" color='#fff' />
            <span className="smart-text">Smart Matching</span>
          </button>
        </div>
        <div className="logout-icon" onClick={handleLogout}>
          <Link to="/">  
            <FontAwesomeIcon icon={faSignOutAlt} className="logout-btn" color='#171C3F' />
          </Link>
        </div>
      </nav>
    </>
  );
};

export default Navbar;

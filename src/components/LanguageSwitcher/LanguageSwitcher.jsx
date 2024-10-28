import React, { useState, useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import i18n from '../../i18n.js';
import './LanguageSwitcher.css';
import { FR, GB } from 'country-flag-icons/react/3x2';

const LanguageSwitcher = () => {
  // Initialiser la langue avec celle en session ou la langue par défaut d'i18n
  const [language, setLanguage] = useState(sessionStorage.getItem('language') || i18n.language);
  const [loaded, setLoaded] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleLanguage = (newLanguage) => {
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
    sessionStorage.setItem('language', newLanguage); // Sauvegarder la langue dans le sessionStorage
    setDropdownVisible(false); // Cacher le dropdown après sélection
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleMouseLeave = () => {
    setDropdownVisible(false); // Fermer le dropdown lorsque la souris quitte
  };

  return (
    <div 
      className={`language-switcher ${loaded ? 'magic-effect' : ''}`} 
      onClick={toggleDropdown} 
      onMouseLeave={handleMouseLeave}
    >
      <FontAwesomeIcon icon={faGlobe} className="language-icon" />
      {dropdownVisible && (
        <div className="dropdown" onMouseEnter={() => setDropdownVisible(true)} onMouseLeave={handleMouseLeave}>
          <div onClick={() => toggleLanguage('en')} className="dropdown-item">
            <GB title="English" className="flag-icon" /> EN
          </div>
          <div onClick={() => toggleLanguage('fr')} className="dropdown-item">
            <FR title="Français" className="flag-icon" /> FR
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;

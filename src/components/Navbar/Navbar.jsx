import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import logo from '../../assets/logo.png';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null); // Référence pour le menu

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  // Utilisation de useEffect pour détecter les clics en dehors du menu
  useEffect(() => {
    // Fonction pour fermer le menu si on clique à l'extérieur
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false); // Fermer le menu si on clique en dehors
      }
    };

    // Ajouter l'écouteur d'événement sur le document
    document.addEventListener('mousedown', handleClickOutside);

    // Nettoyer l'événement lors de la destruction du composant
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <nav className="navbar">
        <div className="logo">
          <img src={logo} alt="Logo" />
        </div>
        <button className="burger-menu" onClick={toggleMenu}>
          ☰
        </button>
        <div className={`overlay ${menuOpen ? 'active' : ''}`} onClick={closeMenu}></div>
        {/* Ajoute le ref ici pour le menu */}
        <ul className={`main-menu ${menuOpen ? 'open' : ''}`} ref={menuRef}>
          <li>
            <div className="title">Indeed</div>
            <div className="regions">
              <Link to="/indeed/ile-de-france">Île-de-France</Link>
              <span className="separator">|</span>
              <Link to="/indeed/hauts-de-france">Hauts-de-France</Link>
            </div>
          </li>
          <li>
            <div className="title">LinkedIn</div>
            <div className="regions">
              <Link to="/linkedin/ile-de-france">Île-de-France</Link>
              <span className="separator">|</span>
              <Link to="/linkedin/hauts-de-france">Hauts-de-France</Link>
            </div>
          </li>
          <li>
            <div className="title">Apec</div>
            <div className="regions">
              <Link to="/apec/ile-de-france">Île-de-France</Link>
              <span className="separator">|</span>
              <Link to="/apec/hauts-de-france">Hauts-de-France</Link>
            </div>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Navbar;

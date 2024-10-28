import { useState, useEffect, useRef, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBriefcase,
  faMapMarkerAlt,
  faSignOutAlt,
  faSearch,
  faLightbulb,
  faCog,
  faPalette,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import "./Navbar.css";
import logo from "../../assets/logo.png";
import logo_dark from "../../assets/logo_dark.png"
import { AppContext } from "../../AppContext";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n"; // Importer i18n pour pouvoir le manipuler

const Navbar = () => {
  const { t } = useTranslation();
  const email = sessionStorage.getItem("userEmail");
  const [platformDropdownOpen, setPlatformDropdownOpen] = useState(false);
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {
    setfileName,
    setsavedPrompt,
    setHasCvResults,
    setHasPromptResults,
    platform,
    setPlatform,
    region,
    setRegion,
    searchTerm,
    setSearchTerm,
    setIsAuthenticated,
    setSmartRegion,
    setSmartPlatform,
    setTextSummary,
    setFileSummary,
    firstVisitPlatform,
    setFirstVisitPlatform,
    firstVisitRegion,
    setFirstVisitRegion,
    setIsChanged,
    setIsChanged2,
    setTheme
  } = useContext(AppContext);

  const [isDarkMode, setIsDarkMode] = useState(sessionStorage.getItem("theme") === "dark");

  const toggleTheme = () => {
    const newTheme = !isDarkMode ? 'dark' : 'light';
    setIsDarkMode((prevMode) => !prevMode);
    setTheme(newTheme); // Mettez à jour le thème dans App.js
    sessionStorage.setItem("theme", newTheme);
    document.body.classList.toggle("dark-mode", newTheme === "dark"); // Met à jour la classe du body
  };
  useEffect(() => {
    const storedTheme = sessionStorage.getItem("theme") || "light";
    setIsDarkMode(storedTheme === "dark");
  }, []);

  
  useEffect(() => {
    // Récupère la langue depuis sessionStorage au chargement
    const storedLanguage = sessionStorage.getItem("language") || "fr";
    if (i18n.language !== storedLanguage) {
      i18n.changeLanguage(storedLanguage); // Met à jour i18n pour utiliser la langue de session
    }
  }, []);
  const navigate = useNavigate();
  const location = useLocation();
  const platformRef = useRef(null);
  const locationRef = useRef(null);
  const menuRef = useRef(null);
  const initialsRef = useRef(null); // Ref for initials circle
  const initialsDropdownRef = useRef(null); // Ref for dropdown menu

  
  const getInitials = (email) => {
    const nameParts = email.split("@")[0].split(".");
    return nameParts.map((part) => part[0].toUpperCase()).join("");
  };

  const handleLogout = () => {
    // Reset all context and session storage
    setPlatform("apec");
    setRegion("ile_de_france");
    setFileSummary("");
    setTextSummary("");
    setSmartPlatform("");
    setSmartRegion("");
    setSearchTerm("");
    setFirstVisitPlatform(true);
    setFirstVisitRegion(true);
    setIsAuthenticated(false);
    setIsChanged(false);
    setIsChanged2(false);
    setHasPromptResults(false);
    setHasCvResults(false);
    setsavedPrompt("");
    setfileName("");
    sessionStorage.clear();
    navigate("/");
  };
 
  const handlePlatformSelect = (platform) => {
    setPlatform(platform);
    sessionStorage.setItem("platform", platform);
    setPlatformDropdownOpen(false);
    setFirstVisitPlatform(false);
    setIsChanged(true);
    setIsChanged2(true);
  };

  const handleRegionSelect = (region) => {
    setRegion(region);
    sessionStorage.setItem("region", region);
    setLocationDropdownOpen(false);
    setFirstVisitRegion(false);
    setIsChanged(true);
    setIsChanged2(true);
  };

  const togglePlatformDropdown = () => {
    setPlatformDropdownOpen((prev) => !prev);
    setLocationDropdownOpen(false);
  };

  const toggleLocationDropdown = () => {
    setLocationDropdownOpen((prev) => !prev);
    setPlatformDropdownOpen(false);
  };

  const handleMouseLeaveDropdown = () => {
    setPlatformDropdownOpen(false);
    setLocationDropdownOpen(false);
  };
  
  const [initialsDropdownOpen, setInitialsDropdownOpen] = useState(false);

  const toggleInitialsDropdown = () => {
    setInitialsDropdownOpen((prev) => !prev);
  };

  const handleMouseLeaveInitialsDropdown = () => {
    setInitialsDropdownOpen(false);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !event.target.classList.contains("burger-menu")
      ) {
        setIsMenuOpen(false);
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  
  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };
  

  return (
    <>
    <div 
      className={`burger-menu ${isMenuOpen ? "active" : ""}`} 
      onClick={toggleMenu}
    >
      <div 
        className={`burger-bar top ${isMenuOpen ? "transform" : ""}`} 
        style={{ backgroundColor: isDarkMode ? "#ffffff" : "#171C3F" }} 
      />
      <div 
        className={`burger-bar middle ${isMenuOpen ? "hide" : ""}`} 
        style={{ backgroundColor: isDarkMode ? "#ffffff" : "#171C3F" }} 
      />
      <div 
        className={`burger-bar bottom ${isMenuOpen ? "transform" : ""}`} 
        style={{ backgroundColor: isDarkMode ? "#ffffff" : "#171C3F" }} 
      />
    </div>

    {/* Menu qui s'ouvre et se ferme */}
    <nav 
      className={`navbar ${isMenuOpen ? "active" : ""} ${isDarkMode ? "dark-mode" : ""}`} 
      ref={menuRef}
    >
        <div className="logo">
          <Link to="/">
          <img src={isDarkMode ? logo_dark : logo} alt="Logo" />

          </Link>
        </div>

        {location.pathname !== "/historyRslts" && (
          <>
            <div
              ref={platformRef}
              className={`dropdownPlatform ${
                platformDropdownOpen ? "active" : ""
              }`}
              onClick={togglePlatformDropdown}
            >
              <FontAwesomeIcon
                icon={faBriefcase}
                color={isDarkMode ? "#ffffff" : "#171C3F"}
              />
              <span>{firstVisitPlatform ? t("title_source") : platform}</span>
              {platformDropdownOpen && (
                <ul
                  className="dropdown-menu"
                  onMouseLeave={handleMouseLeaveDropdown}
                  style={{ textAlign: "center" }}
                >
                  <li
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      padding: "10px",
                      cursor: "pointer",
                    }}
                    onClick={() => handlePlatformSelect("Indeed")}
                  >
                    Indeed
                  </li>
                  <li
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      padding: "10px",
                      cursor: "pointer",
                    }}
                    onClick={() => handlePlatformSelect("LinkedIn")}
                  >
                    LinkedIn
                  </li>
                  <li
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      padding: "10px",
                      cursor: "pointer",
                    }}
                    onClick={() => handlePlatformSelect("Apec")}
                  >
                    Apec
                  </li>
                  <li
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      padding: "10px",
                      cursor: "pointer",
                    }}
                    onClick={() => handlePlatformSelect("jungle")}
                  >
                    Welcome to jungle
                  </li>
                </ul>
              )}
            </div>

            <div
              ref={locationRef}
              className={`dropdownRegion ${
                locationDropdownOpen ? "active" : ""
              }`}
              onClick={toggleLocationDropdown}
            >
              <FontAwesomeIcon icon={faMapMarkerAlt} color={isDarkMode ? "#ffffff" : "#171C3F"} />
              <span>{firstVisitRegion ? t("title_region") : region}</span>
              {locationDropdownOpen && (
                <ul
                  className="dropdown-menu"
                  onMouseLeave={handleMouseLeaveDropdown}
                >
                  <li
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      padding: "10px",
                      cursor: "pointer",
                    }}
                    onClick={() => handleRegionSelect("Île-de-France")}
                  >
                    Île-de-France
                  </li>
                  <li
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      padding: "10px",
                      cursor: "pointer",
                    }}
                    onClick={() => handleRegionSelect("Hauts-de-France")}
                  >
                    Hauts-de-France
                  </li>
                </ul>
              )}
            </div>

            {location.pathname === "/PlatformPage" && (
              <div className="job-input">
                <FontAwesomeIcon
                  icon={faSearch}
                  className="input-icon"
                  color={isDarkMode ? "#ffffff" : "#171C3F"}
                />
                <input
                  type="text"
                  placeholder={t("input_search")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            )}

            {(location.pathname === "/PlatformPage" ||
              location.pathname === "/ListOfLikes") && (
              <Link to="/ListOfLikes" className="dropdownRegion">
                <FontAwesomeIcon
                  icon={faHeart}
                  className="heart-icon"
                  color={isDarkMode ? "#ffffff" : "#171C3F"}
                />
                <span>{t("title_favoris")}</span>
              </Link>
            )}

            <div className="smart-matching">
              <button
                className="smart-btn"
                onClick={() => {
                  if (location.pathname === "/PlatformPage") {
                    navigate("/SmartMatching");
                  } else if (location.pathname === "/ListOfLikes") {
                    navigate("/PlatformPage");
                  } else {
                    navigate("/PlatformPage");
                  }
                }}
              >
                <FontAwesomeIcon
                  icon={
                    location.pathname === "/PlatformPage" ? faLightbulb : faCog
                  }
                  className="lightbulb-icon"
                  color={isDarkMode ? "#ffffff" : "#171C3F"}
                />
                <span className="matching-text">
                  {location.pathname === "/PlatformPage"
                    ? t("btn_SM")
                    : location.pathname === "/ListOfLikes"
                    ? t("btn_MM")
                    : t("btn_MM")}
                </span>
              </button>
            </div>
          </>
        )}

        {location.pathname === "/historyRslts" && (
          <>
            <div className="smart-matching">
              <button
                className="smart-btn"
                onClick={() => navigate("/SmartMatching")}
              >
                <FontAwesomeIcon
                  icon={faLightbulb}
                  className="lightbulb-icon"
                  color={isDarkMode ? "#ffffff" : "#171C3F"}
                />
                <span className="matching-text">{t("btn_SM")}</span>
              </button>
            </div>

            <div className="smart-matching">
              <button
                className="smart-btn"
                onClick={() => navigate("/PlatformPage")}
              >
                <FontAwesomeIcon
                  icon={faCog}
                  className="lightbulb-icon"
                  color={isDarkMode ? "#ffffff" : "#171C3F"}
                />
                <span className="matching-text">{t("btn_MM")}</span>
              </button>
            </div>
          </>
        )}

        {/* Initials Dropdown */}
        <div className="dropdownInitials">
          <div
            ref={initialsRef}
            className="initials-circle"
            onClick={toggleInitialsDropdown}
          >
            {getInitials(email)}
          </div>

          {initialsDropdownOpen && (
            <ul
              className="dropdown-menu"
              ref={initialsDropdownRef}
              onMouseLeave={handleMouseLeaveInitialsDropdown}
            >
              {/* <li
                className="dropdown-itemm"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
                onClick={() => {
                  toggleTheme();
                }}
                
              >
                {t("theme")} <FontAwesomeIcon icon={faPalette} />
              </li> */}
              <li
                className="dropdown-itemm"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
                onClick={handleLogout}
              >
                {t("logout")} <FontAwesomeIcon icon={faSignOutAlt} />
              </li>
            </ul>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;

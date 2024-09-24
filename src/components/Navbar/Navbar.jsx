import { Link } from 'react-router-dom';
import '../../assets/styles.css';
import logo from '../../assets/logo.png';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">
      <img src={logo} alt="Logo" /></div>
      <ul className="main-menu">
        <li>
          <div className="title">Indeed</div>
          <div className="regions">
            <Link to="/indeed/ile-de-france">Île-de-France</Link> | 
            <Link to="/indeed/hauts-de-france">Hauts-de-France</Link>
          </div>
        </li>
        <li>
          <div className="title">LinkedIn</div>
          <div className="regions">
            <Link to="/linkedin/ile-de-france">Île-de-France</Link> | 
            <Link to="/linkedin/hauts-de-france">Hauts-de-France</Link>
          </div>
        </li>
        <li>
          <div className="title">Apec</div>
          <div className="regions">
            <Link to="/apec/ile-de-france">Île-de-France</Link> | 
            <Link to="/apec/hauts-de-france">Hauts-de-France</Link>
          </div>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;

import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Menu from "./Menu";
import Search from "./Search";
import Avatar from "../Avatar";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const mobileMenuRef = useRef(null);
  const location = useLocation();
  const { auth, notify } = useSelector((state) => state);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileSearchOpen(false);
  }, [location.pathname]);

  return (
    <div className="header mb-3">
      <nav className="navbar">
        {/* Logo with Search Button */}
        <div className="header-left d-flex align-items-center">
          <Link to="/" className="logo d-flex align-items-center">
            <div className="logo-container d-flex align-items-center">
              <div className="logo-icon me-2">
                <img
                  src="/sociologowhite.png"
                  alt="SocioSphere Logo"
                  className="official-logo"
                />
              </div>
              <h1
                className="navbar-brand text-uppercase p-0 m-0 brand-text"
                onClick={() => window.scrollTo({ top: 0 })}
              >
                SocioSphere
              </h1>
            </div>
          </Link>

          {/* Mobile Search Toggle - Right next to logo */}
          <button
            className={`mobile-search-btn mobile-only ${mobileSearchOpen ? 'active' : ''}`}
            onClick={() => {
              setMobileSearchOpen(!mobileSearchOpen);
            }}
          >
            <i className={`fas ${mobileSearchOpen ? 'fa-times' : 'fa-search'}`}></i>
          </button>
        </div>

        {/* Desktop Search */}
        <div className="navbar-center desktop-only">
          <Search />
        </div>

        {/* Desktop Menu */}
        <div className="navbar-end desktop-only">
          <Menu />
        </div>

        {/* Mobile Search Dropdown */}
        {mobileSearchOpen && (
          <div className="mobile-search-dropdown mobile-only">
            <Search />
          </div>
        )}
      </nav>
    </div>
  );
};

export default Header;

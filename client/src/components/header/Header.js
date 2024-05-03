import React from "react";
import { Link } from "react-router-dom";
import Menu from "./Menu";
import Search from "./Search";

const Header = () => {
  return (
    <div className="header mb-3">
      <nav className="navbar">
        <Link to="/" className="logo">
          <h1
            className="navbar-brand text-uppercase  p-0 m-0"
            onClick={() => window.scrollTo({ top: 0 })}
          >
            SocioSphere
          </h1>
        </Link>

        <Search />

        <Menu />
      </nav>
    </div>
  );
};

export default Header;

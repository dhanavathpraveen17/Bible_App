import React, { useState } from 'react';

function Header({ onSearch, darkMode }) {
  const [searchInput, setSearchInput] = useState("");

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch && searchInput.trim()) {
      onSearch(searchInput);
    }
  };

  return (
    <>
        <nav className={`navbar custom-navbar ${darkMode ? 'dark-mode' : ''}`}>
  <div className="nav-container container-fluid d-flex justify-content-between align-items-center">

    <a className="navbar-brand text-white" href="#">
      <img src="/src/assets/mainlogo.png"
           alt="Bible App Logo"
           className="navbar-logo" />
    </a>

    <form className="nav-search d-flex" role="search" onSubmit={handleSearchSubmit}>
      <input 
        className="form-control me-2" 
        type="search" 
        placeholder="Search verse (e.g., John 3:16)"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />
      <button className="btn btn-outline-light" type="submit">Search</button>
    </form>

  </div>
</nav>
    </>
  )
}

export default Header;


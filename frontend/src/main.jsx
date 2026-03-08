import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './index.css'
import './components/HeadFoot/headfoot.css'
import App from './App.jsx'
import Header from './components/HeadFoot/Header.jsx'
import Footer from './components/HeadFoot/Footer.jsx'

function Main() {
  const [searchQuery, setSearchQuery] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const handleSearch = (query) => {
    setSearchQuery(query);
    // Trigger search in App by setting a custom event or using state
    window.dispatchEvent(new CustomEvent('bibleSearch', { detail: query }));
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  };

  return (
    <div className={darkMode ? 'dark-mode' : ''}>
      <Header onSearch={handleSearch} darkMode={darkMode} />
      <App initialSearch={searchQuery} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <Footer />
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Main />
  </StrictMode>,
)


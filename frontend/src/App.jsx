import React, { useState, useEffect } from 'react';
import './App.css'

// API URL - uses environment variable in production, localhost in development
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Bible books array
const BOOKS = [
  "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua",
  "Judges", "Ruth", "1 Samuel", "2 Samuel", "1 Kings", "2 Kings", 
  "1 Chronicles", "2 Chronicles", "Ezra", "Nehemiah", "Esther", "Job", 
  "Psalm", "Proverbs", "Ecclesiastes", "Song of Solomon", "Isaiah", 
  "Jeremiah", "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel", 
  "Amos", "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", "Zephaniah", 
  "Haggai", "Zechariah", "Malachi", "Matthew", "Mark", "Luke", "John", 
  "Acts", "Romans", "1 Corinthians", "2 Corinthians", "Galatians", 
  "Ephesians", "Philippians", "Colossians", "1 Thessalonians", 
  "2 Thessalonians", "1 Timothy", "2 Timothy", "Titus", "Philemon", 
  "Hebrews", "James", "1 Peter", "2 Peter", "1 John", "2 John", 
  "3 John", "Jude", "Revelation"
];

// Number of chapters in each book
const CHAPTERS_PER_BOOK = {
  "Genesis": 50, "Exodus": 40, "Leviticus": 27, "Numbers": 36, 
  "Deuteronomy": 34, "Joshua": 24, "Judges": 21, "Ruth": 4,
  "1 Samuel": 31, "2 Samuel": 24, "1 Kings": 22, "2 Kings": 25, 
  "1 Chronicles": 29, "2 Chronicles": 36, "Ezra": 10, "Nehemiah": 13, 
  "Esther": 10, "Job": 42, "Psalm": 150, "Proverbs": 31, 
  "Ecclesiastes": 12, "Song of Solomon": 8, "Isaiah": 66, 
  "Jeremiah": 52, "Lamentations": 5, "Ezekiel": 48, "Daniel": 12, 
  "Hosea": 14, "Joel": 3, "Amos": 9, "Obadiah": 1, "Jonah": 4, 
  "Micah": 7, "Nahum": 3, "Habakkuk": 3, "Zephaniah": 3, 
  "Haggai": 2, "Zechariah": 14, "Malachi": 4, "Matthew": 28, 
  "Mark": 16, "Luke": 24, "John": 21, "Acts": 28, "Romans": 16, 
  "1 Corinthians": 16, "2 Corinthians": 13, "Galatians": 6, 
  "Ephesians": 6, "Philippians": 4, "Colossians": 4, 
  "1 Thessalonians": 5, "2 Thessalonians": 3, "1 Timothy": 6, 
  "2 Timothy": 4, "Titus": 3, "Philemon": 1, "Hebrews": 13, 
  "James": 5, "1 Peter": 5, "2 Peter": 3, "1 John": 5, 
  "2 John": 1, "3 John": 1, "Jude": 1, "Revelation": 22
};

// Book name variations for partial matching
const BOOK_ALIASES = {
  "genesis": "Genesis", "gen": "Genesis", "ge": "Genesis",
  "exodus": "Exodus", "exod": "Exodus", "ex": "Exodus",
  "leviticus": "Leviticus", "lev": "Leviticus", "le": "Leviticus",
  "numbers": "Numbers", "num": "Numbers", "nu": "Numbers",
  "deuteronomy": "Deuteronomy", "deut": "Deuteronomy", "dt": "Deuteronomy",
  "joshua": "Joshua", "josh": "Joshua", "jos": "Joshua",
  "judges": "Judges", "judg": "Judges", "jdg": "Judges",
  "ruth": "Ruth", "ru": "Ruth",
  "1 samuel": "1 Samuel", "1 sam": "1 Samuel", "1sa": "1 Samuel",
  "2 samuel": "2 Samuel", "2 sam": "2 Samuel", "2sa": "2 Samuel",
  "1 kings": "1 Kings", "1 kgs": "1 Kings", "1ki": "1 Kings",
  "2 kings": "2 Kings", "2 kgs": "2 Kings", "2ki": "2 Kings",
  "1 chronicles": "1 Chronicles", "1 chron": "1 Chronicles", "1ch": "1 Chronicles",
  "2 chronicles": "2 Chronicles", "2 chron": "2 Chronicles", "2ch": "2 Chronicles",
  "ezra": "Ezra", "ezr": "Ezra",
  "nehemiah": "Nehemiah", "neh": "Nehemiah",
  "esther": "Esther", "esth": "Esther", "es": "Esther",
  "job": "Job", "jb": "Job",
  "psalm": "Psalm", "psalms": "Psalm", "ps": "Psalm", "psm": "Psalm",
  "proverbs": "Proverbs", "prov": "Proverbs", "pr": "Proverb", "prv": "Proverbs",
  "ecclesiastes": "Ecclesiastes", "eccl": "Ecclesiastes", "ec": "Ecclesiastes", "ecc": "Ecclesiastes",
  "song of solomon": "Song of Solomon", "song": "Song of Solomon", "sos": "Song of Solomon", "ss": "Song of Solomon",
  "isaiah": "Isaiah", "isa": "Isaiah", "is": "Isaiah",
  "jeremiah": "Jeremiah", "jer": "Jeremiah", "jr": "Jeremiah",
  "lamentations": "Lamentations", "lam": "Lamentations", "la": "Lamentations",
  "ezekiel": "Ezekiel", "eze": "Ezekiel", "ezek": "Ezekiel", "ez": "Ezekiel",
  "daniel": "Daniel", "dan": "Daniel", "dn": "Daniel",
  "hosea": "Hosea", "hos": "Hosea", "ho": "Hosea",
  "joel": "Joel", "jl": "Joel",
  "amos": "Amos", "am": "Amos",
  "obadiah": "Obadiah", "obad": "Obadiah", "ob": "Obadiah",
  "jonah": "Jonah", "jon": "Jonah", "jnh": "Jonah",
  "micah": "Micah", "mic": "Micah", "mc": "Micah",
  "nahum": "Nahum", "nah": "Nahum", "na": "Nahum",
  "habakkuk": "Habakkuk", "hab": "Habakkuk", "hk": "Habakkuk",
  "zephaniah": "Zephaniah", "zeph": "Zephaniah", "zep": "Zephaniah", "zp": "Zephaniah",
  "haggai": "Haggai", "hag": "Haggai", "hg": "Haggai",
  "zechariah": "Zechariah", "zech": "Zechariah", "zec": "Zechariah", "zk": "Zechariah",
  "malachi": "Malachi", "mal": "Malachi", "ml": "Malachi",
  "matthew": "Matthew", "matt": "Matthew", "mt": "Matthew",
  "mark": "Mark", "mrk": "Mark", "mk": "Mark",
  "luke": "Luke", "luk": "Luke", "lk": "Luke",
  "john": "John", "jn": "John",
  "acts": "Acts", "act": "Acts",
  "romans": "Romans", "rom": "Romans", "rm": "Romans",
  "1 corinthians": "1 Corinthians", "1 cor": "1 Corinthians", "1co": "1 Corinthians",
  "2 corinthians": "2 Corinthians", "2 cor": "2 Corinthians", "2co": "2 Corinthians",
  "galatians": "Galatians", "gal": "Galatians", "ga": "Galatians",
  "ephesians": "Ephesians", "eph": "Ephesians", "ephes": "Ephesians",
  "philippians": "Philippians", "phil": "Philippians", "php": "Philippians",
  "colossians": "Colossians", "col": "Colossians",
  "1 thessalonians": "1 Thessalonians", "1 thess": "1 Thessalonians", "1th": "1 Thessalonians",
  "2 thessalonians": "2 Thessalonians", "2 thess": "2 Thessalonians", "2th": "2 Thessalonians",
  "1 timothy": "1 Timothy", "1 tim": "1 Timothy", "1ti": "1 Timothy",
  "2 timothy": "2 Timothy", "2 tim": "2 Timothy", "2ti": "2 Timothy",
  "titus": "Titus", "tit": "Titus", "ti": "Titus",
  "philemon": "Philemon", "philem": "Philemon", "phm": "Philemon",
  "hebrews": "Hebrews", "heb": "Hebrews",
  "james": "James", "jas": "James", "jm": "James",
  "1 peter": "1 Peter", "1 pet": "1 Peter", "1pe": "1 Peter",
  "2 peter": "2 Peter", "2 pet": "2 Peter", "2pe": "2 Peter",
  "1 john": "1 John", "1 jn": "1 John", "1jn": "1 John",
  "2 john": "2 John", "2 jn": "2 John", "2jn": "2 John",
  "3 john": "3 John", "3 jn": "3 John", "3jn": "3 John",
  "jude": "Jude", "jd": "Jude",
  "revelation": "Revelation", "rev": "Revelation", "re": "Revelation"
};

function App({ darkMode: propDarkMode, toggleDarkMode: propToggleDarkMode }) {
  const [selectedBook, setSelectedBook] = useState("Genesis");
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [selectedVerse, setSelectedVerse] = useState(1);
  const [verses, setVerses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [versesList, setVersesList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [isHighlighted, setIsHighlighted] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(null);

  // Use props or fallback to local state if not provided
  const darkMode = propDarkMode !== undefined ? propDarkMode : false;
  const toggleDarkMode = propToggleDarkMode ? propToggleDarkMode : (() => {});

  // Fetch chapters when book changes
  useEffect(() => {
    const numChapters = CHAPTERS_PER_BOOK[selectedBook] || 1;
    const chapterArray = Array.from({ length: numChapters }, (_, i) => i + 1);
    setChapters(chapterArray);
    setSelectedChapter(1);
  }, [selectedBook]);

  // Fetch verses when chapter changes
  useEffect(() => {
    fetchChapter();
  }, [selectedBook, selectedChapter]);

  // Fetch verse count when chapter changes
  useEffect(() => {
    if (verses.length > 0) {
      const verseArray = Array.from({ length: verses.length }, (_, i) => i + 1);
      setVersesList(verseArray);
    }
  }, [verses]);

  // Auto-remove highlight after 3 seconds
  useEffect(() => {
    if (isHighlighted) {
      const timer = setTimeout(() => {
        setIsHighlighted(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isHighlighted]);

  // Parse search query to extract book, chapter, verse
  const parseSearchQuery = (query) => {
    let book = null;
    let chapter = 1;
    let verse = null;
    
    const lowerQuery = query.toLowerCase().trim();
    
    // Sort aliases by length (longest first) to match "1 john" before "john"
    const sortedAliases = Object.entries(BOOK_ALIASES).sort((a, b) => b[0].length - a[0].length);
    
    // Try to find book name - check for various patterns
    // First, check for book name followed by numbers (various separators)
    for (const [alias, fullName] of sortedAliases) {
      // Check for patterns like "genesis2:2", "genesis 2:2", "genesis 2 2", "genesis2 2"
      // Also handle "1john 3:2" (no space between number and book name for 1/2/3 John)
      const patterns = [
        new RegExp(`^${alias}(\\d+)[:\\s](\\d+)$`, 'i'),     // genesis2:2 or genesis2 2 or 1john3:2
        new RegExp(`^${alias}\\s+(\\d+)[:\\s](\\d+)$`, 'i'),  // genesis 2:2
        new RegExp(`^${alias}\\s+(\\d+)\\s+(\\d+)$`, 'i'),     // genesis 3 2 (space between chapter and verse)
        new RegExp(`^${alias}\\s+(\\d+)[:\\s]?$`, 'i'),       // genesis 3 or genesis 3: (chapter only)
        new RegExp(`^${alias}$`, 'i')                          // just genesis
      ];
      
      for (const pattern of patterns) {
        const match = lowerQuery.match(pattern);
        if (match) {
          book = fullName;
          if (match[1]) {
            chapter = parseInt(match[1]) || 1;
          }
          if (match[2] && match[2] !== '') {
            verse = parseInt(match[2]);
          }
          return { book, chapter, verse };
        }
      }
    }
    
    // Also try direct book name matching (longest first)
    const sortedBooks = [...BOOKS].sort((a, b) => b.length - a.length);
    for (const b of sortedBooks) {
      const lowerBook = b.toLowerCase();
      const patterns = [
        new RegExp(`^${lowerBook}(\\d+)[:\\s](\\d+)$`, 'i'),
        new RegExp(`^${lowerBook}\\s+(\\d+)[:\\s](\\d+)$`, 'i'),
        new RegExp(`^${lowerBook}\\s+(\\d+)\\s+(\\d+)$`, 'i'),
        new RegExp(`^${lowerBook}\\s+(\\d+)[:\\s]?$`, 'i'),
        new RegExp(`^${lowerBook}$`, 'i')
      ];
      
      for (const pattern of patterns) {
        const match = lowerQuery.match(pattern);
        if (match) {
          book = b;
          if (match[1]) {
            chapter = parseInt(match[1]) || 1;
          }
          if (match[2] && match[2] !== '') {
            verse = parseInt(match[2]);
          }
          return { book, chapter, verse };
        }
      }
    }
    
    // Try to handle numbered books like "1 john 3 2" or "1john 3 2"
    // Match patterns like "1john", "2john", "3john" as book prefixes
    const numberedBookPatterns = [
      /^(\d+)(john|james|peter|thessalonians|timothy|corinthians|samuel|kings|chronicles)\s+(\d+)\s+(\d+)$/i,
      /^(\d+)(john|james|peter|thessalonians|timothy|corinthians|samuel|kings|chronicles)\s+(\d+):(\d+)$/i,
      /^(\d+)(john|james|peter|thessalonians|timothy|corinthians|samuel|kings|chronicles)(\d+)[:\s](\d+)$/i,
    ];
    
    for (const pattern of numberedBookPatterns) {
      const match = lowerQuery.match(pattern);
      if (match) {
        const num = match[1];
        const bookName = match[2].toLowerCase();
        const bookKey = `${num} ${bookName}`;
        
        // Find the full book name from aliases
        let fullBookName = BOOK_ALIASES[bookKey];
        
        if (fullBookName) {
          book = fullBookName;
          chapter = parseInt(match[3]) || 1;
          verse = parseInt(match[4]) || null;
          return { book, chapter, verse };
        }
      }
    }
    
    return { book, chapter, verse };
  };

  // Listen for search events from Header
  useEffect(() => {
    const handleSearchEvent = async (event) => {
      const query = event.detail;
      if (!query || !query.trim()) return;

      setSearchQuery(query);
      setLoading(true);
      setError(null);
      setSearchResults(null);

      // Parse the query
      const { book, chapter, verse } = parseSearchQuery(query);

      if (book) {
        // Navigate to the parsed location
        setSelectedBook(book);
        setSelectedChapter(chapter || 1);
        
        // Wait for chapter to load, then navigate to verse
        setTimeout(() => {
          if (verse) {
            setSelectedVerse(verse);
            setIsHighlighted(true);
            // Scroll to verse after a short delay
            setTimeout(() => {
              const verseElement = document.getElementById(`verse-${verse}`);
              if (verseElement) {
                verseElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }, 500);
          }
        }, 100);
        
        setSearchResults({ 
          found: true, 
          reference: `${book} ${chapter}${verse ? ':' + verse : ''}` 
        });
      } else {
        // Try API search as fallback
        try {
const response = await fetch(`${API_URL}/bible/${encodeURIComponent(query)}`);
          if (response.ok) {
            const data = await response.json();
            if (data.verses && data.verses.length > 0) {
              // Try to parse the result
              const ref = data.reference || query;
              const match = ref.match(/^(\D+)\s*(\d+)(?::(\d+))?/i);
              if (match) {
                const foundBook = BOOKS.find(b => ref.toLowerCase().includes(b.toLowerCase()));
                if (foundBook) {
                  setSelectedBook(foundBook);
                  setSelectedChapter(parseInt(match[2]) || 1);
                  if (match[3]) {
                    setSelectedVerse(parseInt(match[3]));
                  }
                }
              }
              setSearchResults(data);
            } else {
              setSearchResults({ found: false, error: "No results found" });
            }
          } else {
            setSearchResults({ found: false, error: "No results found" });
          }
        } catch (err) {
          setSearchResults({ found: false, error: "No results found" });
        }
      }
      setLoading(false);
    };

    window.addEventListener('bibleSearch', handleSearchEvent);
    return () => window.removeEventListener('bibleSearch', handleSearchEvent);
  }, []);

  const fetchChapter = async () => {
    setLoading(true);
    setError(null);
    try {
const response = await fetch(`${API_URL}/bible/${selectedBook}/${selectedChapter}`);
      const data = await response.json();
      if (data.verses) {
        setVerses(data.verses);
      } else {
        setVerses([]);
      }
    } catch (err) {
      setError("Failed to load chapter");
      setVerses([]);
    }
    setLoading(false);
  };

  const handleBookChange = (book) => {
    setSelectedBook(book);
    setSelectedChapter(1);
    setSelectedVerse(1);
    setSearchResults(null);
  };

  const handleChapterChange = (chapter) => {
    setSelectedChapter(chapter);
    setSelectedVerse(1);
    setSearchResults(null);
  };

  const handleVerseChange = (verse) => {
    setSelectedVerse(verse);
    setIsHighlighted(true);
    // Scroll to the selected verse
    const verseElement = document.getElementById(`verse-${verse}`);
    if (verseElement) {
      verseElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const goToNextChapter = () => {
    if (selectedChapter < CHAPTERS_PER_BOOK[selectedBook]) {
      setSelectedChapter(selectedChapter + 1);
    } else {
      // Find next book
      const currentBookIndex = BOOKS.indexOf(selectedBook);
      if (currentBookIndex < BOOKS.length - 1) {
        setSelectedBook(BOOKS[currentBookIndex + 1]);
        setSelectedChapter(1);
      }
    }
    setSelectedVerse(1);
    setIsHighlighted(true);
    setSearchResults(null);
    setButtonClicked('next');
    
    // Scroll to first verse
    setTimeout(() => {
      const firstVerse = document.getElementById('verse-1');
      if (firstVerse) {
        firstVerse.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      // Also scroll window to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const goToPreviousChapter = () => {
    if (selectedChapter > 1) {
      setSelectedChapter(selectedChapter - 1);
    } else {
      // Find previous book
      const currentBookIndex = BOOKS.indexOf(selectedBook);
      if (currentBookIndex > 0) {
        const prevBook = BOOKS[currentBookIndex - 1];
        setSelectedBook(prevBook);
        setSelectedChapter(CHAPTERS_PER_BOOK[prevBook]);
      }
    }
    setSelectedVerse(1);
    setIsHighlighted(true);
    setSearchResults(null);
    setButtonClicked('prev');
  };

  // Reset buttonClicked state after 3 seconds
  useEffect(() => {
    if (buttonClicked) {
      const timer = setTimeout(() => {
        setButtonClicked(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [buttonClicked]);

  return (
    <div className={`container-fluid p-4 ${darkMode ? 'dark-mode' : ''}`}>
      {/* Dark Mode Toggle */}
      <div className="dark-mode-toggle">
        <button 
          className={`toggle-btn ${darkMode ? 'active' : ''}`}
          onClick={toggleDarkMode}
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>

      {/* Search Results Display - Hidden, functionality works in background */}
      {/* {searchResults && searchResults.found && searchResults.reference && (
        <div className="search-result-alert mb-4">
          <div className="d-flex justify-content-between align-items-center">
            <span>Showing: <strong>{searchResults.reference}</strong></span>
            <button 
              className="btn-close" 
              onClick={() => setSearchResults(null)}
              aria-label="Close"
            ></button>
          </div>
        </div>
      )}

      {/* Error Message for search not found */}
      {searchResults && searchResults.found === false && (
        <div className="alert alert-warning mb-4">
          {searchResults.error || "No results found"}
        </div>
      )}

      {/* Three Dropdowns Row */}
      <div className="row mb-4">
        <div className="col-md-3">
          <label className="form-label">Book</label>
          <select 
            className="form-select"
            value={selectedBook}
            onChange={(e) => handleBookChange(e.target.value)}
          >
            {BOOKS.map(book => (
              <option key={book} value={book}>{book}</option>
            ))}
          </select>
        </div>

        <div className="col-md-2">
          <label className="form-label">Chapter</label>
          <select 
            className="form-select"
            value={selectedChapter}
            onChange={(e) => handleChapterChange(parseInt(e.target.value))}
          >
            {chapters.map(chapter => (
              <option key={chapter} value={chapter}>{chapter}</option>
            ))}
          </select>
        </div>

        <div className="col-md-2">
          <label className="form-label">Verse</label>
          <select 
            className="form-select"
            value={selectedVerse}
            onChange={(e) => handleVerseChange(parseInt(e.target.value))}
          >
            {versesList.map(verse => (
              <option key={verse} value={verse}>{verse}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="alert alert-danger">{error}</div>
      )}

      {/* Loading */}
      {loading && (
        <div className="text-center my-4">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {/* Verses Display */}
      {!loading && !error && (
        <div className="verses-container" style={{maxWidth: '900px', margin: '0 auto'}}>
          <h4 className="chapter-title">{selectedBook} {selectedChapter}</h4>
          {verses.map((verse, index) => (
            <p 
              key={index} 
              id={`verse-${verse.verse}`}
              className={`verse-item ${isHighlighted && selectedVerse === verse.verse ? 'highlighted' : ''}`}
            >
              <sup>{verse.verse}</sup>
              <span className="verse-text">{verse.text}</span>
            </p>
          ))}
        </div>
      )}

      {/* Navigation Buttons at Bottom */}
      <div className="navigation-buttons mt-4">
        <div className="row">
          <div className="col-12">
            <div className="btn-group nav-buttons-group">
              <button 
                className={`btn nav-btn ${buttonClicked === 'prev' ? 'clicked' : ''}`}
                onClick={goToPreviousChapter}
              >
                ← Previous
              </button>
              <button 
                className="btn btn-primary"
                disabled
              >
                {selectedBook} {selectedChapter}
              </button>
              <button 
                className={`btn nav-btn ${buttonClicked === 'next' ? 'clicked' : ''}`}
                onClick={goToNextChapter}
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;


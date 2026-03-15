const fs = require('fs');
const path = require('path');

// Data from App.jsx
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

// Helper to slugify book name for URL
function slugifyBook(book) {
  return book.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
}

// Generate XML
let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

let urlCount = 0;

// Static pages (high priority)
const staticPages = ['/', '/books', '/search'];
staticPages.forEach(loc => {
  xml += `  <url>\n`;
  xml += `    <loc>https://kjv-bible.com${loc}</loc>\n`;
  xml += `    <lastmod>2024-10-01</lastmod>\n`;
  xml += `    <changefreq>weekly</changefreq>\n`;
  xml += `    <priority>1.0</priority>\n`;
  xml += `  </url>\n`;
  urlCount++;
});

// 66 Books
BOOKS.forEach(book => {
  const slug = slugifyBook(book);
  xml += `  <url>\n`;
  xml += `    <loc>https://kjv-bible.com/${slug}</loc>\n`;
  xml += `    <lastmod>2024-10-01</lastmod>\n`;
  xml += `    <changefreq>monthly</changefreq>\n`;
  xml += `    <priority>0.8</priority>\n`;
  xml += `  </url>\n`;
  urlCount++;
});

// 1189 Chapters + 31,102 Verses
Object.entries(CHAPTERS_PER_BOOK).forEach(([book, chapters]) => {
  const bookSlug = slugifyBook(book);
  
  // Chapters
  for (let ch = 1; ch <= chapters; ch++) {
    xml += `  <url>\n`;
    xml += `    <loc>https://kjv-bible.com/${bookSlug}-${ch}</loc>\n`;
    xml += `    <lastmod>2024-10-01</lastmod>\n`;
    xml += `    <changefreq>monthly</changefreq>\n`;
    xml += `    <priority>0.6</priority>\n`;
    xml += `  </url>\n`;
    urlCount++;
  }
  
  // Verses (estimate 25 verses/chapter avg)
  for (let ch = 1; ch <= chapters; ch++) {
    // Dummy verse count - generate ~25/ chapter for demo (in prod, fetch from API)
    for (let v = 1; v <= 25; v++) {
      xml += `  <url>\n`;
      xml += `    <loc>https://kjv-bible.com/${bookSlug}-${ch}-${v}</loc>\n`;
      xml += `    <lastmod>2024-10-01</lastmod>\n`;
      xml += `    <changefreq>yearly</changefreq>\n`;
      xml += `    <priority>0.4</priority>\n`;
      xml += `  </url>\n`;
      urlCount++;
    }
  }
});

xml += '</urlset>\n';

const outputPath = path.join(__dirname, 'full-sitemap.xml');
fs.writeFileSync(outputPath, xml);

console.log(`Generated full-sitemap.xml with ${urlCount.toLocaleString()} URLs (${Math.round(urlCount/31102*100)}% of 31K)`);
console.log('Run: node generate-full-sitemap.js');


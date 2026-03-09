require('dotenv').config();

const express = require('express')
const axios = require('axios')
const cors = require("cors")
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const cookieParser = require('cookie-parser')

const app = express()
const port = process.env.PORT || 3000

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", process.env.BIBLE_API_URL || "https://bible-api.com"],
    },
  },
  crossOriginEmbedderPolicy: false,
}))

// Rate limiting to prevent brute force and DDoS
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
})
app.use('/bible/', limiter)

// CORS configuration
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    // In production, replace with your actual domain
    const allowedOrigins = [
      'http://localhost:5173', 
      'http://localhost:3000',
      'https://bible-app-xnhd.onrender.com'
    ]
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
}))

// Parse cookies
app.use(cookieParser())

// Parse JSON with size limit to prevent DoS attacks
app.use(express.json({ limit: '10kb' }))

// Request validation helper
const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    return input.replace(/[<>'"]/g, '')
  }
  return input
}

// Chapter route
app.get('/bible/:book/:chapter', async (req, res) => {
  const { book, chapter } = req.params

  // Validate inputs
  if (!book || !chapter || typeof book !== 'string' || typeof chapter !== 'string') {
    return res.status(400).json({ error: 'Invalid input' })
  }

  try {
    const sanitizedBook = sanitizeInput(book)
    const sanitizedChapter = sanitizeInput(chapter)
    const reference = `${sanitizedBook} ${sanitizedChapter}`

    const apiUrl = process.env.BIBLE_API_URL || 'https://bible-api.com'
    const translation = process.env.BIBLE_API_TRANSLATION || 'kjv'
    const timeout = parseInt(process.env.BIBLE_API_TIMEOUT) || 5000

    const response = await axios.get(
      `${apiUrl}/${encodeURIComponent(reference)}?translation=${translation}`,
      { timeout }
    )

    // Set security cookies
    res.cookie('lastVisit', new Date().toISOString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    })

    res.json(response.data)
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      res.status(504).json({ error: 'Request timeout' })
    } else {
      res.status(500).json({ error: 'Error fetching chapter' })
    }
  }
})

// Verse route
app.get('/bible/:book/:chapter/:verse', async (req, res) => {
  const { book, chapter, verse } = req.params

  // Validate inputs
  if (!book || !chapter || !verse || 
      typeof book !== 'string' || 
      typeof chapter !== 'string' || 
      typeof verse !== 'string') {
    return res.status(400).json({ error: 'Invalid input' })
  }

  try {
    const sanitizedBook = sanitizeInput(book)
    const sanitizedChapter = sanitizeInput(chapter)
    const sanitizedVerse = sanitizeInput(verse)
    const reference = `${sanitizedBook} ${sanitizedChapter}:${sanitizedVerse}`

    const apiUrl = process.env.BIBLE_API_URL || 'https://bible-api.com'
    const translation = process.env.BIBLE_API_TRANSLATION || 'kjv'
    const timeout = parseInt(process.env.BIBLE_API_TIMEOUT) || 5000

    const response = await axios.get(
      `${apiUrl}/${encodeURIComponent(reference)}?translation=${translation}`,
      { timeout }
    )

    // Set security cookies
    res.cookie('lastVisit', new Date().toISOString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000
    })

    res.json(response.data)
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      res.status(504).json({ error: 'Request timeout' })
    } else {
      res.status(500).json({ error: 'Error fetching verse' })
    }
  }
})

// Health check endpoint (for monitoring)
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() })
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})

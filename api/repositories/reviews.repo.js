const fs = require('fs')
const path = require('path')

// Fake "database": a JSON file. All data access goes through this module,
// so swapping to MySQL later only means rewriting these functions.
const DATA_DIR = path.join(__dirname, '..', 'data')
const DATA_FILE = path.join(DATA_DIR, 'reviews.json')

function read() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'))
  } catch {
    return [] // file missing or empty/corrupt -> start fresh
  }
}

function write(reviews) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
  fs.writeFileSync(DATA_FILE, JSON.stringify(reviews, null, 2))
}

function nextId(reviews) {
  return reviews.reduce((max, r) => Math.max(max, r.id), 0) + 1
}

function getAll() {
  return read()
}

function getById(id) {
  return read().find((r) => r.id === Number(id)) || null
}

function create({ author, description, rating }) {
  const reviews = read()
  const review = {
    id: nextId(reviews),
    author,
    description,
    rating,
    date: new Date().toISOString(),
    authorized: false, // must be approved via PUT /avis/:id/autoriser
  }
  reviews.push(review)
  write(reviews)
  return review
}

function authorize(id) {
  const reviews = read()
  const review = reviews.find((r) => r.id === Number(id))
  if (!review) return null
  review.authorized = true
  write(reviews)
  return review
}

function remove(id) {
  const reviews = read()
  const index = reviews.findIndex((r) => r.id === Number(id))
  if (index === -1) return false
  reviews.splice(index, 1)
  write(reviews)
  return true
}

module.exports = { getAll, getById, create, authorize, remove }

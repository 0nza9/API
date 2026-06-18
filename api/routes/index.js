const express = require('express')
const router = express.Router()

// --- Controllers ---
const getHome = require('../controllers/get.controllers')
const getReviews = require('../controllers/get.controllers.reviews')
const getReviewById = require('../controllers/get.controllers.reviews.id')
const addReview = require('../controllers/post.controllers')
const authorizeReview = require('../controllers/put.controllers')
const deleteReview = require('../controllers/delete.controllers')
const register = require('../controllers/post.controllers.register')
const login = require('../controllers/post.controllers.login')
const forgotPassword = require('../controllers/post.controllers.forgot-password')
const resetPassword = require('../controllers/post.controllers.reset-password')

// --- Middleware ---
// Many middleware files are still empty (they export {} instead of a function).
// `use()` skips any that aren't functions yet, so the app boots now and will
// pick them up automatically once you implement them.
const getMw = require('../middleware/get.middleware')
const getReviewsMw = require('../middleware/get.middleware.reviews')
const getReviewByIdMw = require('../middleware/get.middleware.reviews.id')
const addReviewMw = require('../middleware/post.middleware')
const authorizeReviewMw = require('../middleware/put.middleware')
const deleteReviewMw = require('../middleware/delete.middleware')
const registerMw = require('../middleware/post.middleware.register')
const loginMw = require('../middleware/post.middleware.login')
const forgotPasswordMw = require('../middleware/post.middleware.forgot-password')
const resetPasswordMw = require('../middleware/post.middleware.reset-password')

// Keep only the entries that are real middleware functions.
const use = (...handlers) => handlers.filter((h) => typeof h === 'function')

// --- Reviews (avis) ---
router.get('/', ...use(getMw, getHome))
router.get('/avis', ...use(getReviewsMw, getReviews))
router.get('/avis/:id', ...use(getReviewByIdMw, getReviewById))
router.post('/avis', ...use(addReviewMw, addReview))
router.put('/avis/:id/autoriser', ...use(authorizeReviewMw, authorizeReview))
router.delete('/avis/:id', ...use(deleteReviewMw, deleteReview))

// --- Auth ---
router.post('/register', ...use(registerMw, register))
router.post('/login', ...use(loginMw, login))
router.post('/forgot-password', ...use(forgotPasswordMw, forgotPassword))
router.post('/reset-password', ...use(resetPasswordMw, resetPassword))

module.exports = router

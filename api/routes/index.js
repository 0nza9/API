const express = require('express')
const router = express.Router()

// --- Controllers ---
const getHome = require('../controllers/get.controllers')
const getReviews = require('../controllers/get.controllers.reviews')
const getReviewsModeration = require('../controllers/get.controllers.reviews.moderation')
const getReviewById = require('../controllers/get.controllers.reviews.id')
const addReview = require('../controllers/post.controllers')
const editReview = require('../controllers/patch.controllers')
const authorizeReview = require('../controllers/put.controllers')
const deleteReview = require('../controllers/delete.controllers')
const getMe = require('../controllers/get.controllers.me')
const register = require('../controllers/post.controllers.register')
const login = require('../controllers/post.controllers.login')
const logout = require('../controllers/post.controllers.logout')
const forgotPassword = require('../controllers/post.controllers.forgot-password')
const resetPassword = require('../controllers/post.controllers.reset-password')

// --- Middleware (validation) ---
// Certains fichiers de middleware sont encore vides (ils exportent {} au lieu
// d'une fonction). `use()` ignore tout ce qui n'est pas une fonction.
const getMw = require('../middleware/get.middleware')
const getReviewsMw = require('../middleware/get.middleware.reviews')
const getReviewByIdMw = require('../middleware/get.middleware.reviews.id')
const addReviewMw = require('../middleware/post.middleware')
const registerMw = require('../middleware/post.middleware.register')
const loginMw = require('../middleware/post.middleware.login')
const forgotPasswordMw = require('../middleware/post.middleware.forgot-password')
const resetPasswordMw = require('../middleware/post.middleware.reset-password')

// --- Guards ---
const requireAuth = require('../middleware/auth')   // 401 si non connecté
const requireAdmin = require('../middleware/admin')  // 403 si connecté mais non admin

// Keep only the entries that are real middleware functions.
const use = (...handlers) => handlers.filter((h) => typeof h === 'function')

// --- Reviews (avis) ---
router.get('/', ...use(getMw, getHome))
// Lecture publique : seuls les avis autorisés.
router.get('/avis', ...use(getReviewsMw, getReviews))
// File de modération (tous les avis) — admin uniquement. AVANT /avis/:id.
router.get('/avis/moderation', ...use(requireAuth, requireAdmin, getReviewsModeration))
router.get('/avis/:id', ...use(getReviewByIdMw, getReviewById))
// Publication publique (aucun compte requis).
router.post('/avis', ...use(addReviewMw, addReview))
// Modération / édition / suppression — admin uniquement.
router.patch('/avis/:id', ...use(requireAuth, requireAdmin, editReview))
router.put('/avis/:id/autoriser', ...use(requireAuth, requireAdmin, authorizeReview))
router.delete('/avis/:id', ...use(requireAuth, requireAdmin, deleteReview))

// --- Auth ---
router.get('/me', ...use(requireAuth, getMe))
router.post('/register', ...use(registerMw, register))
router.post('/login', ...use(loginMw, login))
router.post('/logout', ...use(requireAuth, logout))
router.post('/forgot-password', ...use(forgotPasswordMw, forgotPassword))
router.post('/reset-password', ...use(resetPasswordMw, resetPassword))

module.exports = router

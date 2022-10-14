import { Router } from 'express'
import {AuthController} from '../controllers/auth.js'
import { checkAuth } from '../utils/checkAuth.js'

const authController = new AuthController()

const router = new Router()

// Register +
// http://localhost:3002/api/auth/register
router.post('/register', authController.register)

// Login +
// http://localhost:3002/api/auth/login
router.post('/login', authController.login)

// Log out +
// http://localhost:3002/api/auth/logout
router.post('/logout', checkAuth, authController.logout)

// Recover password +
// http://localhost:3002/api/auth/recover
router.post('/recover', authController.forgotPassword)

// Recover password +
// http://localhost:3002/api/auth/recover/:token
router.post('/recover/:token', authController.reset)

// Get Me +
// http://localhost:3002/api/auth/me
router.get('/me', checkAuth, authController.getMe)

export default router

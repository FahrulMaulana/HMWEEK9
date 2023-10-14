/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Operations related to user authentication
 * 
 * components:
 *   schemas:
 *     Authenthication:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           description: The username of the user.
 *           example: john_doe
 *         password:
 *           type: string
 *           description: The password of the user.
 *           example: secret_password
 *
 * /register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserCredentials'
 *     responses:
 *       200:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message.
 *                   example: Registration successful
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication.
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *
 * /login:
 *   post:
 *     summary: Login with username and password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserCredentials'
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message.
 *                   example: Login successful
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication.
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: Invalid username or password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: An error message.
 *                   example: Invalid username or password
 */

// ... (Kode untuk endpoint register dan login)

const express = require('express');
const authenRouter = express.Router();
const jwt = require('jsonwebtoken');

global.users = [];

authenRouter.post('/register', (req, res) => {
  const { username, password } = req.body;

  const existingUser = users.find(user => user.username === username);
  if (existingUser) {
    return res.status(400).json({ message: 'Username sudah digunakan' });
  }

  const newUser = { username, password };
  users.push(newUser);

  const token = jwt.sign({ username }, 'secret_key', { expiresIn: '1h' });

  res.json({ message: 'Registrasi berhasil', token });
});

authenRouter.post('/login', (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    const token = jwt.sign({ username }, 'secret_key', { expiresIn: '1h' });
    res.json({ message: 'Login berhasil', token });
  } else {
    res.status(401).json({ message: 'Login gagal. Periksa kembali username dan password Anda.' });
  }
});

module.exports = authenRouter;

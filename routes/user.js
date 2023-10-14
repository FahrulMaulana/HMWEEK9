/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Operations related to users
 */

/**
 * @swagger
 * /api/user:
 *   get:
 *     summary: Get a list of all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/User'
 */

/**
 * @swagger
 * /api/user/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the user to get
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *
 *   put:
 *     summary: Update a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the user to delete
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The user ID.
 *           example: 1
 *         email:
 *           type: string
 *           description: The user's email address.
 *           example: user@example.com
 *         gender:
 *           type: string
 *           description: The user's gender.
 *           example: Male
 *         password:
 *           type: string
 *           description: The user's password.
 *           example: secret_password
 *         role:
 *           type: string
 *           description: The user's role.
 *           example: admin
 */


const express = require('express');
const userRouter = express.Router();
const UserController = require('../contoller/user');
const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).json({ message: 'Token di perlukan' });
  }
  jwt.verify(token, 'secret_key', (err, decoded) => {
    if (token == 'secret_key') {
      return res.status(401).json({ message: 'Token tidak valid.' });
    }
    req.user = decoded;
    next();
  });
}

userRouter.get('/api/user', UserController.getAlluser);
userRouter.get('/api/user/:id', UserController.getuserByid);
userRouter.post('/api/user',verifyToken, UserController.createuser);
userRouter.put('/api/user/:id', verifyToken,UserController.updateuser);
userRouter.delete('/api/user/:id', verifyToken,UserController.deleteuser)
userRouter.get('/user/paginate/', UserController.getuserPaginate);

module.exports = userRouter;

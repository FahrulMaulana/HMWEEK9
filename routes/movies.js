/**
 * @swagger
 * tags:
 *   name: Movies
 *   description: Operations related to movies
 */

/**
 * @swagger
 * /api/movie:
 *   get:
 *     summary: Get a list of all movies
 *     tags: [Movies]
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Movie'
 *
 *   post:
 *     summary: Create a new movie
 *     tags: [Movies]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Movie'
 *     responses:
 *       201:
 *         description: Movie created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 */

/**
 * @swagger
 * /api/movie/{id}:
 *   get:
 *     summary: Get a movie by ID
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the movie to get
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *
 *   put:
 *     summary: Update a movie by ID
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the movie to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Movie'
 *     responses:
 *       200:
 *         description: Movie updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *
 *   delete:
 *     summary: Delete a movie by ID
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the movie to delete
 *     responses:
 *       200:
 *         description: Movie deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Movie:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The movie ID.
 *           example: 1
 *         title:
 *           type: string
 *           description: The movie title.
 *           example: Inception
 *         genres:
 *           type: array
 *           items:
 *             type: string
 *           description: The movie genres.
 *           example: ["Action", "Sci-Fi"]
 *         year:
 *           type: integer
 *           description: The movie release year.
 *           example: 2010
 */

// ...


// movie.js
const express = require('express');
const movieRouter = express.Router();
const movieController = require('../contoller/movie');
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

movieRouter.get('/api/movie',movieController.getAllmovie);
movieRouter.get('/movie/paginate',movieController.getmoviePaginate);
movieRouter.get('/api/movie/:id', movieController.getmovieByid);
movieRouter.post('/api/movie', verifyToken , movieController.createMovie);
movieRouter.put('/api/movie/:id', verifyToken, movieController.updateMovie);
movieRouter.delete('/api/movie/:id', verifyToken, movieController.deleteMovie);

module.exports = movieRouter;

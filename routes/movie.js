const router = require('express').Router()
const Movie = require('../models/movie.model')

/**
 * @route POST /movie/
 * @description Add movie to the database.
 * @access Private, User should be Authorized.
 */
router.post('/', async (req, res) => {
    const { title, description, cast } = req.body
    try {
        if (!title || !description) return res.status(400).json({ msg: "Not all fields have been entered." })

        const existingMovie = await Movie.findOne({ title: title })
        if (existingMovie)
            return res
                .status(400)
                .json({ msg: "The movie with this title is already in our database" })

        const movie = await Movie.create({
            title,
            description,
            cast
        })
        res.status(200).json({ msg: 'Movie added sucesfully' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: 'Internal server error' })
    }
})

/**
 * @route GET /movie/search
 * @description Search movie in the database.
 * @access Private, User should be Authorized.
 */
router.get('/search', async (req, res) => {
    const { title } = req.query
    try {
        const results = await Movie.find({ title })
        res.status(200).json({ data: results })
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: 'Internal server error' })
    }
})

/**
 * @route GET /movie/
 * @description Get all movies in database.
 * @access Private, User should be Authorized.
 */
router.get('/', async (req, res) => {
    try {
        const movies = await Movie.find({})
        if (movies.length === 0) {
            return res.status(200).json({ msg: "There are no movies in our database, check later!" })
        }
        res.status(200).json({ data: movies })
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: 'Internal server error' })
    }
})

module.exports = router
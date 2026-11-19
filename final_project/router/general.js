const express = require('express');
const axios = require('axios');

const users = require('./auth_users.js').users;

const public_users = express.Router();

const booksApiUrl = 'http://127.0.0.1:5000/_internal/books';

async function fetchBooks() {
    const response = await axios.get(booksApiUrl);
    return response.data;
}

// Register a new user
public_users.post('/register', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: 'Username and password are required'
        });
    }

    if (users.find(user => user.username === username)) {
        return res.status(409).json({
            message: 'User already exists'
        });
    }

    users.push({ username, password });

    return res.status(200).json({
        message: 'User successfully registered'
    });
});

// Get all books
public_users.get('/', async (req, res) => {
    try {
        const books = await fetchBooks();
        return res.status(200).json(books);
    } catch (error) {
        return res.status(500).json({
            message: 'Unable to retrieve books'
        });
    }
});

// Get book by ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
    try {
        const books = await fetchBooks();
        const book = books[req.params.isbn];

        if (book) {
            return res.status(200).json(book);
        }

        return res.status(404).json({
            message: 'Book not found'
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Unable to retrieve books'
        });
    }
});

// Get books by author
public_users.get('/author/:author', async (req, res) => {
    try {
        const books = await fetchBooks();
        const author = req.params.author.toLowerCase();

        const result = Object.values(books).filter(
            book => book.author.toLowerCase() === author
        );

        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({
            message: 'Unable to retrieve books'
        });
    }
});

// Get books by title
public_users.get('/title/:title', async (req, res) => {
    try {
        const books = await fetchBooks();
        const title = req.params.title.toLowerCase();

        const result = Object.values(books).filter(
            book => book.title.toLowerCase() === title
        );

        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({
            message: 'Unable to retrieve books'
        });
    }
});

// Get book reviews
public_users.get('/review/:isbn', async (req, res) => {
    try {
        const books = await fetchBooks();
        const book = books[req.params.isbn];

        if (book) {
            return res.status(200).json(book.reviews || {});
        }

        return res.status(404).json({
            message: 'Book not found'
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Unable to retrieve books'
        });
    }
});

module.exports.general = public_users;

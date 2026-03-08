const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (!isValid(username)) {
    return res.status(200).json({ message: "User already exists!" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User successfully registered. Now you can login" });
});

// internal helper
public_users.get('/books-internal', function (req, res) {
  return res.status(200).json(books);
});

// Task 10
public_users.get('/', async function (req, res) {
  try {
    const response = await axios.get('http://127.0.0.1:4000/books-internal');
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books" });
  }
});

// internal helper
public_users.get('/isbn-internal/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  return res.status(200).json(books[isbn]);
});

// Task 11
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  axios.get(`http://127.0.0.1:4000/isbn-internal/${isbn}`)
    .then((response) => {
      return res.status(200).json(response.data);
    })
    .catch((error) => {
      return res.status(500).json({ message: "Error retrieving book by ISBN" });
    });
});

// internal helper
public_users.get('/author-internal/:author', function (req, res) {
  const author = req.params.author;
  let filteredBooks = [];

  for (let key in books) {
    if (books[key].author === author) {
      filteredBooks.push(books[key]);
    }
  }

  return res.status(200).json(filteredBooks);
});

// Task 12
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;

  try {
    const response = await axios.get(`http://127.0.0.1:4000/author-internal/${author}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books by author" });
  }
});

// internal helper
public_users.get('/title-internal/:title', function (req, res) {
  const title = req.params.title;
  let filteredBooks = [];

  for (let key in books) {
    if (books[key].title === title) {
      filteredBooks.push(books[key]);
    }
  }

  return res.status(200).json(filteredBooks);
});

// Task 13
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;

  axios.get(`http://127.0.0.1:4000/title-internal/${title}`)
    .then((response) => {
      return res.status(200).json(response.data);
    })
    .catch((error) => {
      return res.status(500).json({ message: "Error retrieving books by title" });
    });
});

public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  return res.status(200).json(books[isbn].reviews);
});

module.exports.general = public_users;
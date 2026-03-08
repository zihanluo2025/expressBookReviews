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
    return res.status(404).json({ message: "User already exists!" });
  }

  users.push({ username: username, password: password });
  return res.status(200).json({ message: "User successfully registered. Now you can login" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  return res.status(200).json(books[isbn]);
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  let filteredBooks = [];

  for (let key in books) {
    if (books[key].author === author) {
      filteredBooks.push(books[key]);
    }
  }

  return res.status(200).json(filteredBooks);
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  let filteredBooks = [];

  for (let key in books) {
    if (books[key].title === title) {
      filteredBooks.push(books[key]);
    }
  }

  return res.status(200).json(filteredBooks);
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  return res.status(200).json(books[isbn].reviews);
});

/*
  Task 10
  Get all books using async callback function
*/
public_users.get('/asyncbooks', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/');
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books" });
  }
});

/*
  Task 11
  Search by ISBN using Promises
*/
public_users.get('/asyncisbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  axios.get(`http://localhost:5000/isbn/${isbn}`)
    .then((response) => {
      return res.status(200).json(response.data);
    })
    .catch((error) => {
      return res.status(500).json({ message: "Error retrieving book by ISBN" });
    });
});

/*
  Task 12
  Search by Author
*/
public_users.get('/asyncauthor/:author', function (req, res) {
  const author = req.params.author;

  axios.get(`http://localhost:5000/author/${author}`)
    .then((response) => {
      return res.status(200).json(response.data);
    })
    .catch((error) => {
      return res.status(500).json({ message: "Error retrieving books by author" });
    });
});

/*
  Task 13
  Search by Title
*/
public_users.get('/asynctitle/:title', async function (req, res) {
  const title = req.params.title;

  try {
    const response = await axios.get(`http://localhost:5000/title/${title}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books by title" });
  }
});

module.exports.general = public_users;
const express = require('express');
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

// Task 10 - Get the book list available in the shop using async/await
public_users.get('/', async function (req, res) {
  try {
    const bookPromise = new Promise((resolve, reject) => {
      resolve(books);
    });

    const data = await bookPromise;
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ message: "Error fetching books" });
  }
});

// Task 11 - Get book details based on ISBN using Promise
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  const bookPromise = new Promise((resolve, reject) => {
    resolve(books[isbn]);
  });

  bookPromise
    .then((data) => {
      return res.status(200).json(data);
    })
    .catch((err) => {
      return res.status(500).json({ message: "Error fetching book by ISBN" });
    });
});

// Task 12 - Get book details based on author using Promise
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;

  const authorPromise = new Promise((resolve, reject) => {
    let filteredBooks = [];

    for (let key in books) {
      if (books[key].author === author) {
        filteredBooks.push(books[key]);
      }
    }

    resolve(filteredBooks);
  });

  authorPromise
    .then((data) => {
      return res.status(200).json(data);
    })
    .catch((err) => {
      return res.status(500).json({ message: "Error fetching books by author" });
    });
});

// Task 13 - Get all books based on title using async/await
public_users.get('/title/:title', async function (req, res) {
  try {
    const title = req.params.title;

    const titlePromise = new Promise((resolve, reject) => {
      let filteredBooks = [];

      for (let key in books) {
        if (books[key].title === title) {
          filteredBooks.push(books[key]);
        }
      }

      resolve(filteredBooks);
    });

    const data = await titlePromise;
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ message: "Error fetching books by title" });
  }
});

// Task 5 - Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  return res.status(200).json(books[isbn].reviews);
});

module.exports.general = public_users;
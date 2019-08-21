/* eslint-disable strict */
const express = require("express");
const playStoreData = require("./playstore");

const app = express();

app.get("/apps", (req, res) => {
  let { sort, genres } = req.query;

  const validSort = ["Rating", "App"];
  const validGenre = [
    "action",
    "puzzle",
    "strategy",
    "casual",
    "arcade",
    "card"
  ];

  if (sort) {
    if (!validSort.includes(sort)) {
      return res
        .status(400)
        .json({ error: "Sort should be one of: " + validSort.join(", ") });
    }
  }

  if (genres) {
    if (!validGenre.includes(genres.toLowerCase())) {
      return res
        .status(400)
        .json({ error: "Genres should be one of: " + validGenre.join(", ") });
    }
  }

  let filteredData = [...playStoreData];

  if (genres) {
    filteredData = filteredData.filter(data =>
      data.Genres.toLowerCase().includes(genres.toLowerCase())
    );
  }

  if (sort === 'App') {
    filteredData = filteredData.sort((a, b) => {
      return a[sort].toUpperCase() > b[sort].toUpperCase() ? 1 : a[sort].toUpperCase() < b[sort].toUpperCase() ? -1 : 0;
    });
  }

  if (sort === 'Rating') {
    filteredData = filteredData.sort((a, b) => {
      return b[sort] - a[sort];
    });
  }

  res.json(filteredData);
});

module.exports = app;

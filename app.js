require("dotenv").config();
const express = require("express");
const app = express();
var cors = require("cors");

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

module.exports = app;

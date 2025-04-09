require("dotenv").config();
const express = require("express");
const app = express();
var cors = require("cors");

app.use(cors());
const router = require("./routes");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(router);

app.get("/", (req, res) => {
    res.send("Try");
});

module.exports = app;

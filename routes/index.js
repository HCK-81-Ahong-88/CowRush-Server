const router = require("express").Router();
const { Controller } = require("../controllers/controller");

router.post("/generateText", Controller.generateText);

module.exports = router;

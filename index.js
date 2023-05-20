const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");
require('dotenv').config()

app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));

// Homepage
app.get("/", async (req, res) => {
    res.status(200).json({ msg: "Hello world!" })
});


const PORT = process.env.PORT || 5000;
app.listen(PORT);
console.log("Server is running! " + PORT);
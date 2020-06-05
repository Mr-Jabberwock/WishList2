const path = require('path');

const express = require("express");
const app = express();

app.use(express.static(__dirname + "/dist/wishlist"));

app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname + '/dist/wishlist/index.html'));
    console.log("server server server server")
});

app.listen(process.env.PORT || 8000);
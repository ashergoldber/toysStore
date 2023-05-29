const express = require("express");
const http = require("http");
const path = require("path");

const {routesInit} = require("./routes/configRoutes");
require("./db/mongoConnect")

const app = express();
app.use(express.json());
// public folder
app.use(express.static(path.join(__dirname,"public")));

routesInit(app);

const server = http.createServer(app);
const port = process.env.PORT || 3003;
server.listen(port);
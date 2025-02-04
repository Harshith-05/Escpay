const express = require("express");
const app = express();
app.get("/", (req, res) => res.send("Escrow Backend Running"));
app.listen(4242, () => console.log("Backend running on port 4242"));

const path = require("path");
const express = require("express");
const reload = require("reload");

const app = express();
const port = process.env.NODE_PORT || 9011;

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

reload(app);
app.listen(port, () => {
  console.log(`App listening on port: ${port}`);
});

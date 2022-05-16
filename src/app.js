const path = require("path");
const express = require("express");
const reload = require("reload");
const fs = require("fs");

const CliError =  require("./cliError");
const NoSuchDirError = require("./noSuchDirError");


function main() {
  const port = process.env.NODE_PORT || 5011;
  let app = createApp();

  app.listen(port, () => {
    console.log(`App listening on: http://localhost:${port}`);
  });
}


function createApp() {
  const app = express();
  const publicDir = path.join(__dirname, "public");

  // Change dir where views located
  // https://stackoverflow.com/a/37050126
  app.set("views", publicDir);
  app.set("view engine", "ejs");
  app.use("/public", express.static(publicDir));

  app.get("/api/:dirName", (req, res) => {
    const dirName = req.params.dirName;
    res.render("index", {apiUrl: `${dirName}/main.yaml`});
  });

  useApiDir(app, fetchApiDir());
  reload(app);

  return app;
}


function fetchApiDir() {
  const apiDir = process.argv[2];
  if (!apiDir) {
    throw new CliError(`
      You should specify directory with your api files as first argument, e.g.:
      \tnode app.js -e html,css,js /srv/www/api`);
  }
  if (!fs.existsSync(apiDir)) {
    throw new NoSuchDirError(`
      Given api directory "${apiDir}" is not a directory`); 
  }
  return apiDir;
}


function useApiDir(app, apiDir) {
  app.use("/raw-api", express.static(apiDir));
}


main();

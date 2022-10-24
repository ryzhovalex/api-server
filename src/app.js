const path = require("path");
const express = require("express");
const reload = require("reload");
const fs = require("fs");

const CliError =  require("./cliError");
const NoSuchDirError = require("./noSuchDirError");
const UnresolvedEntrypointException = require("./UnresolvedEntrypointException");

const API_ENTRYPOINT_FILENAME_OPTIONS = [
  "main.yaml",
  "main.yml"
] 

function main() {
  const port = process.env.NODE_PORT || 5011;
  let app = createApp();

  app.listen(port, () => {
    console.log(`App listening on: http://localhost:${port}`);
  });
}

/**
 * Return appropriate server url for API for given dirname out of defined
 * options.
 * 
 * @param generalDirname name of general absolute directory with apis
 * @param subDirname name of the directory within api folder to search in
 * @return Url to access api entrypoint
 */
function getApiUrlForDirName(generalDirname, subDirname) {
  let fullPath;

  for (let option of API_ENTRYPOINT_FILENAME_OPTIONS) {
    fullPath = path.join(generalDirname, subDirname, option);

    // Check if file exists and only then if it's file
    // https://stackoverflow.com/a/15630832
    if (
      fs.existsSync(fullPath)
      && fs.lstatSync(fullPath).isFile()
    ) {
      // Localized output to be fetched via static route of express is returned
      return path.join(subDirname, option);
    }
  }

  throw new UnresolvedEntrypointException(
    `Cannot find entrypoint within dir ${subDirname}`
  );
}

function createApp() {
  const app = express();
  const apiDir = fetchApiDir();
  const publicDir = path.join(__dirname, "public");

  // Change dir where views located
  // https://stackoverflow.com/a/37050126
  app.set("views", publicDir);
  app.set("view engine", "ejs");
  app.use("/public", express.static(publicDir));

  app.get("/api/:dirName", (req, res) => {
    const dirName = req.params.dirName;

    res.render(
      "index", {apiUrl: getApiUrlForDirName(apiDir, dirName)}
    );
  });

  app.use("/raw-api", express.static(apiDir));
  app.use("/upload", uploadRequestHandler)

  reload(app);

  return app;
}

function fetchApiDir() {
  const apiDir = process.argv[2] || "/app/var/api";
  if (!apiDir) {
    throw new CliError(`
      You should specify directory with your api files as first argument, e.g.:
      \tnode app.js /srv/www/api`);
  }
  // if (!fs.existsSync(apiDir)) {
  //   throw new NoSuchDirError(`
  //     Given api directory "${apiDir}" is not a directory`); 
  // }
  return apiDir;
}

function uploadRequestHandler(req, res) {
  res.status(200).json({"message": "Hello!"});
}

main();

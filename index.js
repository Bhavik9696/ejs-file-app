const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  fs.readdir("./files", (err, files) => {
    res.render("index", { files: files });
  });
});

app.get("/file/:filename", (req, res) => {
  fs.readFile(`./files/${req.params.filename}`, "utf-8", (err, filedata) => {
    if (err) {
      return res.send("File not found");
    }
    res.render("show", {
      filename: req.params.filename,
      content: filedata,
    });
  });
});

app.post("/create", (req, res) => {
  const title = req.body.title.trim().split(" ").join("_");
  const details = req.body.details;

  fs.writeFile(`./files/${title}.txt`, details, (err) => {
    if (err) throw err;
    res.redirect("/");
  });
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});

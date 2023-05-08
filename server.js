// Requiring/ importing in all the packages that are needed
const express = require("express");
const path = require("path");
const fs = require("fs/promises");
const { uuid } = require("uuidv4");

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

// get method, to retrieve all the notes
app.get("/api/notes", (req, res) => {
  console.log(`${req.method} request received for notes`);
  fs.readFile("./db/db.json").then((notes) => res.json(JSON.parse(notes)));
});

// post method to update/ add to the notes file (db.json)
app.post("/api/notes", (req, res) => {
  console.log(`${req.method} request recieved to add a new note`);

  console.log(req.body);

  const { title, text } = req.body;

  if (title && text) {
    const newNote = {
      id: uuid(),
      title: title,
      text: text,
    };

    console.log("New Note: ", newNote);

    // Retrieving the Saved Data/Dataset
    fs.readFile("./db/db.json", "utf8")
      .then((notes) => {
        console.log("Data: ", notes);
        const parsedNotes = JSON.parse(notes);
        // We add/manipulate the original data
        parsedNotes.push(newNote);

        // We have to write the NEW data
        fs.writeFile("./db/db.json", JSON.stringify(parsedNotes))
          .then(() => {
            console.log("Note added successfully!");
            res.status(201).json({ message: "New Note Added" });
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json(err);
          });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  } else {
    res.status(400).json({ message: "Error to add this note" });
  }
});

// delete method to remove a note from the notes file
app.delete("/api/notes/:id", (req, res) => {
  console.log("Req Params: ", req.params);
  console.log("ID: ", req.params.id);

  // we need to read in our data
  console.log(`${req.method} request received for notes`);
  fs.readFile("./db/db.json", "utf8")
    .then((notes) => {
      console.log("Data: ", notes);
      const originalNotes = JSON.parse(notes);

      // use the filter method to copy the array and create a new array
      const filteredNotes = originalNotes.filter((notes) => {
        console.log("note id" + notes.id);
        console.log("req.id" + req.params.id);
        if (notes.id !== req.params.id) {
          return true;
        }
      });
      console.log(filteredNotes);

      // write to the file the new array, this will overwrite file with the new array
      fs.writeFile("./db/db.json", JSON.stringify(filteredNotes))
        .then(() => {
          console.log("Note deleted successfully");
          res.status(201).json({ message: "Note Deleted" });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json(err);
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);

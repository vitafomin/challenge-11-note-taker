const express = require("express");
const path = require("path");
const fs = require("fs/promises");
const { writeFile } = require("fs");
// const noteData = require

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


app.get("/api/notes", (req, res) => {
  console.log(`${req.method} request received for notes`);
  fs.readFile("./db/db.json").then((notes) => res.json(JSON.parse(notes)))


});

app.post("/api/notes", (req, res) => {
  console.log(`${req.method} request recieved to add a new note`);

  console.log(req.body);

  const { noteTitle, noteText } = req.body;

  if (noteTitle && noteText) {
    const newNote = {
      noteTitle,
      noteText
    };

    readAndAppend(newNote, "./db/db.json");
    res.json("Added new note")
  }
  // else {
  //   res.error("Error in adding a new note");
  // }
});

  //   fs.readFile("./db/db.json", "utf8", (err,notes) => {
  //     if (err) {
  //       console.error(err);
  //     }
  //     else{
  //       const parsedNotes = JSON.parse(notes);
        
  //       parsedNotes.push(newNote);

  //       fs.writeFile("./db/db.json", JSON.stringify(parsedNotes), (writeErr) => writeErr ? console.error(writeErr) : console.log("Successfully updated notes"))
  //     }
  //   })

  //   const response = {
  //     body: newNote
  //   };

  //   res.status(200).json(response)
  // }
  // else {
  //   res.status(500).json("Error to add this note")
  // };



app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
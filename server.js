const express = require("express");
const path = require("path");
const fs = require("fs/promises");
const { writeFile } = require("fs");
const { uuid } = require("uuidv4");
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
  fs.readFile("./db/db.json").then((notes) => res.json(JSON.parse(notes)));
});

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
    // });

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

    // res.json(response);
  } else {
    //res.send("Error to add this note");
    res.status(400).json({ message: "Something unexpected happened" });
  }
});

app.delete("/api/notes/:id", (req, res) => {
  console.log("Req Params: ", req.params);
  console.log("ID: ", req.params.id);

  // we need to read in our data
  console.log(`${req.method} request received for notes`);
  fs.readFile("./db/db.json", "utf8").then((notes) => {
    console.log("Data: ", notes);
    const originalNotes = JSON.parse(notes);

    const filteredNotes = originalNotes.filter((notes) => {
      console.log("note id" + notes.id)
      console.log("req.id" + req.params.id)
      if (notes.id !== req.params.id) {
        return true;
      }
    })
    console.log(filteredNotes)

    fs.writeFile("./db/db.json", JSON.stringify(filteredNotes))
    .then(() => {
      console.log("Note deleted successfully")
      res.status(201).json({ message: "Note Deleted"})
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err)
    });
    
  })
  .catch((err) => {
    console.log(err);
    res.status(500).json(err)
  });
  

 

  // const filteredNotes = originalNotes.filter((notes) => {
  //   if (notes === req.params.id) {
  //     return true;
  //   }
  // });

  // console.log(filteredNotes);

  // we need to filter OUT the item with ID
  // for loop to loop through the array,
  // and id that does NOT match gets added to another array
  // if/else
  // forEach() - map() / filter()

  // then we have to WRITE the NEW dataset to FILE
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
// if (noteTitle && noteText) {
//   const newNote = {
//     noteTitle,
//     noteText
//   };

//   readAndAppend(newNote, "./db/db.json");
//   res.json("Added new note")
// }
// else {
//   res.error("Error in adding a new note");
// }

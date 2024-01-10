const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'Develop', 'public')));


const dbFilePath = path.join(__dirname, 'Develop', 'db.json');

//get all notes
app.get('/api/notes', (req, res) => {
    fs.readFile(dbFilePath, 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
    
        const notes = JSON.parse(data);
        res.json(notes);
      });
    });

//save new note

app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    fs.readFile(dbFilePath, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      const notes = JSON.parse(data);
      newNote.id = Date.now().toString();
      notes.push(newNote);
      fs.writeFile(dbFilePath, JSON.stringify(notes), (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.json(newNote);
      });
});
});

app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;
    fs.readFile(dbFilePath, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      const notes = JSON.parse(data);
      const updatedNotes = notes.filter((note) => note.id !== noteId);
      fs.writeFile(dbFilePath, JSON.stringify(updatedNotes), (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.sendStatus(204);
      });
    });
  });

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'Develop', 'public', 'notes.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'Develop', 'public', 'index.html'));
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);

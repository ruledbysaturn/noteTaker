const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

const dbFilePath = path.join(__dirname, 'db.json');

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


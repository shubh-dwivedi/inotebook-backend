const express = require('express');
const router = express.Router()
const fetchuser  = require("../middleware/fetchuser");
const Note = require("../models/Note");
const { body, validationResult } = require("express-validator");

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });

// ROUTE 1: Fetch all notes of a user using: GET "/api/notes/fetchallnotes" . Login required
router.get('/fetchallnotes', fetchuser, async (req,res)=> {
    try {
        const notes = await Note.find({user: req.user.id});
        res.json(notes);    
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
    
})

// ROUTE 2: Add a new Note using: POST "/api/notes/addnote" . Login required
router.post('/addnote', fetchuser, [
    body("title", "Please add a title of min 3 characters").isLength({ min: 3 }),
    body("description", "Please enter min 5 characters in description").isLength({ min: 5 })
], async (req,res)=> {
    //If there are errors, return bad request and errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
        const {title, description, tag} = req.body;
        const note = new Note({
            title, description, tag, user: req.user.id
        })
        const savedNote = await note.save()
        res.json(savedNote);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

// ROUTE 3: Update an existing Note using: PUT "/api/notes/updatenote" . Login required
router.put('/updatenote/:id', fetchuser, async (req,res)=> {
    const {title, description, tag} = req.body;
    try {
        const newNote = {}
        if(title) {newNote.title = title;}
        if(description) {newNote.description = description;}
        if(tag) {newNote.tag = tag;}

        //Find the note to be updated and update it
        let note = await Note.findById(req.params.id);
        if(!note) {
            return res.status(404).send("Not found");
        }
        //check if user owns the note they are trying to update
        if(note.user.toString() !== req.user.id) {
            return res.status(401).send("Not allowed")
        }
        note = await Note.findByIdAndUpdate(req.params.id, {$set: newNote}, {new: true});
        res.json({note});

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

// ROUTE 4: Delete an existing Note using: DELETE "/api/notes/deletenote". Login required
router.delete('/deletenote/:id', fetchuser, async (req,res)=> {
    try {
        //Find the note to be deleted and delete it
        let note = await Note.findById(req.params.id);
        if(!note) {
            return res.status(404).send("Not found");
        }
        //check if user owns the note they are trying to delete
        if(note.user.toString() !== req.user.id) {
            return res.status(401).send("Not allowed")
        }
        note = await Note.findByIdAndDelete(req.params.id);
        res.json({"Success":"Note has been deleted",note: note});

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

module.exports = router
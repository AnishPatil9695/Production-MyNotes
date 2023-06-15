import express from 'express'
import * as NotesController from "../controllers/notesController"
import { requireAuth } from '../middleware/auth';

const router = express.Router();

//Route for GET all notes
router.get('/',requireAuth, NotesController.getNotes)
//Route to get specific note
router.get('/:noteId', NotesController.getSpecificNote)
//Route for Create note
router.post('/', NotesController.createNewNote)
//Route for Update note
router.patch('/:noteId', NotesController.updateNote)
//Route for Delete note
router.delete('/:noteId',NotesController.deleteNote)


export default router
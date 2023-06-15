import { RequestHandler } from "express"
import NoteModel from "../models/note"
import { INoteBody, INoteParams } from "../note.type"
import createHttpError from "http-errors"
import mongoose from "mongoose"
import { assetIsDefined } from "../utill/assetIsDefined"

//GET All Notes
export const getNotes:RequestHandler=async(req, res,next) => {
    const authenticatedUserId=req.session.userId;
    try {
        assetIsDefined(authenticatedUserId)
        const notes=await NoteModel.find({userId:authenticatedUserId}).exec()
       
        res.status(200).json(notes)
    } catch (error) {
       next(error)
    }
}


//GET Specific Note
export const getSpecificNote:RequestHandler=async(req, res, next) =>{
    const noteId=req.params.noteId;
    const authenticatedUserId=req.session.userId;
    try {
        assetIsDefined(authenticatedUserId)
        if(!mongoose.isValidObjectId(noteId)){
            throw createHttpError(400, "Invalid note id");
        }
        const note=await NoteModel.findById(noteId).exec();
        if(!note){
            throw createHttpError(404,"Note not found")     //Error handling if note id not found
        }

        if(!note.userId.equals(authenticatedUserId)){
            throw createHttpError(401,"You cannot access this note!");
        }
        res.status(200).json(note)
    } catch (error) {
        next(error)
    }
}


//CREATE New Note
export const createNewNote:RequestHandler<unknown,unknown,INoteBody,unknown>=async(req, res, next)=> {
    const title=req.body.title;
    const text=req.body.text;
    const authenticatedUserId=req.session.userId;
    try {
        assetIsDefined(authenticatedUserId)
        if (!title){
            
           throw createHttpError(400,"Note must have a title")    //Creating http error handler
        }
       const newNote=await NoteModel.create({userId:authenticatedUserId, title:title, text:text})
       res.status(201).json(newNote) 
    } catch (error) {
        next(error)
    }
}

//UPDATE Note

export const updateNote:RequestHandler<INoteParams,unknown,INoteBody,unknown>=async (req, res,next) => {
    const noteId = req.params.noteId;
    const title=req.body.title;
    const text=req.body.text;
    const authenticatedUserId=req.session.userId;

  try {
    assetIsDefined(authenticatedUserId)
    if(!mongoose.isValidObjectId){throw createHttpError(400,"Invalid note id");}
    if (!title){throw createHttpError(400,"Invalid note title");}
    

    const note=await NoteModel.findById(noteId).exec();


    if(!note){throw createHttpError(404,"Note not found");}
    if(!note.userId.equals(authenticatedUserId)){
        throw createHttpError(401,"You cannot access this note!");
    }

    note.title = title;
    note.text = text;

    const updatedNote = await note.save();
    res.status(200).json(updatedNote);
  } catch (error) {
    next(error);
  }
};


export const deleteNote:RequestHandler=async (req, res,next) => {
    const noteId = req.params.noteId;
    const authenticatedUserId=req.session.userId;

    try {
    assetIsDefined(authenticatedUserId)

        if(!mongoose.isValidObjectId(noteId)){throw createHttpError(400,"Invalid note id");}

        const note = await NoteModel.findById(noteId).exec();

        if(!note){throw createHttpError(404,"Note not found");}
        if(!note.userId.equals(authenticatedUserId)){
            throw createHttpError(401,"You cannot access this note!");
        }

        await note.deleteOne();
        res.sendStatus(204)
    } catch (error) {
        next(error);
    }
}



import { Router, Request, Response } from 'express';
import Note from './Note';

const router = Router();


const neutralRecursion = (count: number = 0) => {
  // Base case to stop recursion
  if (count > 0) return;
  // Recursive call with increment to ensure it stops
  neutralRecursion(count + 1);
};

// Asynchronous function handling GET requests
router.get('/', async (req: Request, res: Response) => {
  neutralRecursion(); // Call neutral recursive function
  try {
    // Asynchronously find all notes. `await` is used, so `Note.find()` must return a Promise.
    const notes = await Note.find(); //Using Note class to find all notes, returns an array (list) of notes
    res.json(notes); //Sending the array of notes as a JSON response
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

// Asynchronous function handling POST requests
router.post('/', async (req: Request, res: Response) => {
  neutralRecursion(); // Call neutral recursive function
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }
  try {
    const note = new Note({
      title,
      content
    });
    // Asynchronously save the new note. `await` is used, so `note.save()` must return a Promise.
    await note.save();
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create note' });
  }
});

// Asynchronous function handling PUT requests for updating a note
router.put('/:id', async (req: Request, res: Response) => {
  neutralRecursion(); // Call neutral recursive function
  const { title, content } = req.body;
  try {
    // Asynchronously find a note by ID and update it. `await` is used, so `Note.findByIdAndUpdate()` must return a Promise.
    const note = await Note.findByIdAndUpdate(req.params.id, { title, content }, { new: true });
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update note' });
  }
});

// Asynchronous function handling DELETE requests
router.delete('/:id', async (req: Request, res: Response) => {
  neutralRecursion(); // Call neutral recursive function
  try {
    // Asynchronously find a note by ID and delete it. `await` is used, so `Note.findByIdAndDelete()` must return a Promise.
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

export default router;
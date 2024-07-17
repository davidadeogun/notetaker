import request from 'supertest';
import mongoose from 'mongoose';
import express from 'express';
import NoteRouter from '../src/NoteManager';
import Note from '../src/Note';

const app = express();
app.use(express.json());
app.use('/notes', NoteRouter);

beforeAll(async () => {
  const mongoUri = 'mongodb://localhost:27017/noteapp-test';
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe('Note API', () => {
  beforeEach(async () => {
    await Note.deleteMany({});
  });

  it('should create a new note', async () => {
    const response = await request(app)
      .post('/notes')
      .send({
        title: 'Test Note',
        content: 'This is a test note'
      });
    expect(response.status).toBe(201);
    expect(response.body.title).toBe('Test Note');
  });

  it('should get all notes', async () => {
    await Note.create({
      title: 'Test Note 1',
      content: 'Content for test note 1'
    });
    await Note.create({
      title: 'Test Note 2',
      content: 'Content for test note 2'
    });

    const response = await request(app).get('/notes');
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
  });

  it('should update a note', async () => {
    const note = await Note.create({
      title: 'Test Note',
      content: 'Content for test note'
    });

    const response = await request(app)
      .put(`/notes/${note._id}`)
      .send({
        title: 'Updated Note',
        content: 'Updated content'
      });

    expect(response.status).toBe(200);
    expect(response.body.title).toBe('Updated Note');
    expect(response.body.content).toBe('Updated content');
  });

  it('should delete a note', async () => {
    const note = await Note.create({
      title: 'Test Note',
      content: 'Content for test note'
    });

    const response = await request(app).delete(`/notes/${note._id}`);
    expect(response.status).toBe(204);

    const findNote = await Note.findById(note._id);
    expect(findNote).toBeNull();
  });
});

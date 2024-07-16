document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('note-form');
    const notesList = document.getElementById('notes-list');
  
    const apiUrl = '/notes';
  
    // Load all notes
    const loadNotes = async () => {
      const response = await fetch(apiUrl);
      const notes = await response.json();
      notesList.innerHTML = '';
      notes.forEach(note => {
        const li = document.createElement('li');
        li.innerHTML = `
          <strong>${note.title}</strong><br>
          ${note.content}<br>
          <button onclick="editNote('${note._id}', '${note.title}', '${note.content}')">Edit</button>
          <button onclick="deleteNote('${note._id}')">Delete</button>
        `;
        notesList.appendChild(li);
      });
    };
  
    // Add or update note
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const id = document.getElementById('note-id').value;
      const title = document.getElementById('note-title').value;
      const content = document.getElementById('note-content').value;
  
      if (id) {
        // Update note
        await fetch(`${apiUrl}/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ title, content })
        });
      } else {
        // Add new note
        await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ title, content })
        });
      }
  
      form.reset();
      loadNotes();
    });
  
    // Delete note
    window.deleteNote = async (id) => {
      await fetch(`${apiUrl}/${id}`, {
        method: 'DELETE'
      });
      loadNotes();
    };
  
    // Edit note
    window.editNote = (id, title, content) => {
      document.getElementById('note-id').value = id;
      document.getElementById('note-title').value = title;
      document.getElementById('note-content').value = content;
    };
  
    // Initial load
    loadNotes();
  });
  
import React, { useEffect, useState } from "react";
import axios from "axios";
import './App.css' 

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editId, setEditId] = useState(null); // Track which note is being edited

  // Fetch all notes on first load
  useEffect(() => {
    axios.get("http://localhost:5000/notes")
      .then(res => setNotes(res.data))
      .catch(err => console.error("Failed to fetch notes:", err));
  }, []);

  // Handle Add or Update
  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) return alert("Please fill in both fields!");

    if (editId) {
      // UPDATE
      axios.put(`http://localhost:5000/notes/${editId}`, { title, content })
        .then(res => {
          const updated = notes.map(n => (n._id === editId ? res.data : n));
          setNotes(updated);
          resetForm();
        })
        .catch(err => console.error("Update failed:", err));
    } else {
      // ADD
      axios.post("http://localhost:5000/notes", { title, content })
        .then(res => {
          setNotes([...notes, res.data]);
          resetForm();
        })
        .catch(err => console.error("Add failed:", err));
    }
  };

  // Delete note
  const deleteNote = (id) => {
    axios.delete(`http://localhost:5000/notes/${id}`)
      .then(() => {
        setNotes(notes.filter(note => note._id !== id));
        if (editId === id) resetForm();
      })
      .catch(err => console.error("Delete failed:", err));
  };

  // Start editing a note
  const editNote = (note) => {
    setEditId(note._id);
    setTitle(note.title);
    setContent(note.content);
  };

  // Reset form fields
  const resetForm = () => {
    setEditId(null);
    setTitle("");
    setContent("");
  };

  return (
    <div className="app-container">
      <h1 className="heading">📝 <strong>QuickNotes</strong></h1>

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="input"
      />

      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={6}
        className="textarea"
      />

      <div className="button-group">
        <button className="btn primary" onClick={handleSubmit}>
          {editId ? "Update Note" : "Add Note"}
        </button>
        {editId && (
          <button className="btn" onClick={resetForm}>
            Cancel
          </button>
        )}
      </div>

      <hr className="divider" />

      {notes.map(note => (
        <div key={note._id} className={`note-card ${editId === note._id ? "editing" : ""}`}>
          <h3>{note.title}</h3>
          <p>{note.content}</p>
          <div className="button-group">
            <button className="btn danger" onClick={() => deleteNote(note._id)}>Delete</button>
            <button className="btn" onClick={() => editNote(note)}>Edit</button>
          </div>
        </div>
      ))}
    </div>

  );
}

export default App;

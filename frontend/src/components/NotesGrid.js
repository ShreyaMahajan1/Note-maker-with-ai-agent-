import React from 'react';
import './NotesGrid.css';

const NotesGrid = ({ notes }) => {
  // Ensure notes is an array
  const safeNotes = Array.isArray(notes) ? notes : [];
  
  return (
    <div className="notes-grid">
      {safeNotes.map((note, index) => (
        <div key={index} className="note-card">
          <h3>{note.title}</h3>
          <p>{note.content}</p>
        </div>
      ))}
    </div>
  );
};

export default NotesGrid;
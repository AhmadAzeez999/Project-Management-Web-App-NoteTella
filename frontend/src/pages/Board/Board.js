import React, { useState } from 'react';
import './Board.css';
import Brush from './Tools/Brush';

const Board = () =>
{
    const [notes, setNotes] = useState([]);
    const [draggedNote, setDraggedNote] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isTextareaFocused, setIsTextareaFocused] = useState(false);
    const [mode, setMode] = useState('edit');
    const [drawing, setDrawing] = useState(null);

    // Start drag
    const handleDragStart = (e, note) =>
    {
        if (isTextareaFocused)
            return;

        setDraggedNote(
        {
            note,
            offsetX: e.clientX - note.x,
            offsetY: e.clientY - note.y,
        });
        setIsDragging(true);
    };

    // Drag movement
    const handleDrag = (e) =>
    {
        if (!isDragging || !draggedNote)
            return;

        const updatedNotes = notes.map((note) =>
        {
            if (note.id === draggedNote.note.id)
            {
                return {
                    ...note,
                    x: e.clientX - draggedNote.offsetX,
                    y: e.clientY - draggedNote.offsetY,
                };
            }
            return note;
        });

        setNotes(updatedNotes);
    };

    // End drag
    const handleDragEnd = () =>
    {
        setIsDragging(false);
        setDraggedNote(null);
    };

    // A function to handle input in the textarea
    const handleTextareaFocus = () => 
    {
        setIsTextareaFocused(true); // Flag to prevent drag
    };

    const handleTextareaBlur = () => 
    {
        setIsTextareaFocused(false); // Reset flag when focus leaves
    };

    // Add new note
    const addNote = () =>
    {
        const colors = ['bg-yellow', 'bg-green', 'bg-blue', 'bg-pink'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        const newNote = 
        {
            id: Date.now(),
            text: "New sticky note",
            x: Math.random() * 400,
            y: Math.random() * 300,
            color: randomColor,
        };

        setNotes([...notes, newNote]);
    };

    // Deleting a note
    const deleteNote = (id) =>
    {
        setNotes(notes.filter((note) => note.id !== id));
    };

    // Saving notes to a file
    const saveData = () =>
    {
        const data = 
        {
            notes: notes,
            drawing: drawing, // Including drawing data
        };
        const dataURL = JSON.stringify(data);
        const blob = new Blob([dataURL], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'work.json';
        link.click();
    };

    
    // Loading notes from a file
    const load = (event) =>
    {
        const file = event.target.files[0];
        if (file) 
        {
            const reader = new FileReader();
            reader.onload = (e) => 
            {
                try 
                {
                    const loadedData = JSON.parse(e.target.result);
                    setNotes(loadedData.notes);
                    setDrawing(loadedData.drawing);
                } 
                catch (err) 
                {
                    alert('Invalid file format. Please upload a valid .json file.');
                }
            };
            reader.readAsText(file);
        }
    };

      // To update note text dynamically
    const handleInput = (e, noteId) => 
    {
        const textarea = e.target;
        textarea.style.height = 'auto'; // Reset height to auto
        textarea.style.height = `${textarea.scrollHeight}px`; // Adjust height to content

        const updatedNotes = notes.map((note) => 
        {
            if (note.id === noteId) 
            {
                return { ...note, text: e.target.value };
            }
            return note;
        });
        setNotes(updatedNotes);
    };

      // Function to toggle between "edit" and "brush" mode
    const toggleMode = () => 
    {
        setMode((prevMode) => (prevMode === 'edit' ? 'brush' : 'edit'));
    };

    return (
        <div className="board">
            <div className="controls">
                <button onClick={addNote} className="add-note-btn">
                    Add Note
                </button>
                <button onClick={saveData} className="add-note-btn">
                    Save
                </button>
                <input
                    type="file"
                    accept=".json"
                    onChange={load}
                    className="load-note-input"
                />
                <button onClick={toggleMode} className="add-note-btn">
                    Switch to {mode === 'edit' ? 'Brush' : 'Edit'} Mode
                </button>
            </div>

            <div
                className="whiteboard"
                onMouseMove={handleDrag}
                onMouseUp={handleDragEnd}
                onMouseLeave={handleDragEnd}
            >
                <Brush mode={mode} drawing={drawing} setDrawing={setDrawing} />
                {notes.map((note) => (
                    <div
                        key={note.id}
                        className={`sticky-note ${note.color}`}
                        style=
                        {{
                            left: `${note.x}px`,
                            top: `${note.y}px`,
                            transform: draggedNote?.note.id === note.id ? 'scale(1.05)' : 'scale(1)',
                            transition: 'transform 0.2s',
                        }}
                        onMouseDown={(e) => handleDragStart(e, note)}
                    >
                        <div className="note-header">
                            <button
                                onClick={() => deleteNote(note.id)}
                                className="delete-note-btn"
                            >
                                ×
                            </button>
                        </div>
                        <div className="note-body">
                            <textarea
                                className="note-text"
                                value={note.text}
                                onChange={(e) => handleInput(e, note.id)}
                                onFocus={handleTextareaFocus}
                                onBlur={handleTextareaBlur}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Board;

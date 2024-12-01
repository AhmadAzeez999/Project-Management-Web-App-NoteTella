import React, { useState } from 'react';
import './Board.css';
import Brush from './Tools/Brush';
import { useGlobalState } from '../../contexts/GlobalStateProvider';

const Board = () => 
{
    const [draggedNote, setDraggedNote] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isTextareaFocused, setIsTextareaFocused] = useState(false);
    const [mode, setMode] = useState('edit');

    const { globalData, setGlobalData } = useGlobalState();
    const { notes, drawing } = globalData;

    const handleDragStart = (e, note) => 
    {
        if (isTextareaFocused) return;
        setDraggedNote({ note, offsetX: e.clientX - note.x, offsetY: e.clientY - note.y });
        setIsDragging(true);
    };

    const handleDrag = (e) => 
    {
        if (!isDragging || !draggedNote) return;

        const updatedNotes = notes.map((note) => 
        {
            if (note.id === draggedNote.note.id) 
            {
                return { ...note, x: e.clientX - draggedNote.offsetX, y: e.clientY - draggedNote.offsetY };
            }
            return note;
        });

        setGlobalData((prev) => ({ ...prev, notes: updatedNotes }));
    };

    const handleDragEnd = () => 
    {
        setIsDragging(false);
        setDraggedNote(null);
    };

    const addNote = () => 
    {
        const colors = ['bg-yellow', 'bg-green', 'bg-blue', 'bg-pink'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        const newNote = { id: Date.now(), text: "New sticky note", x: 100, y: 100, color: randomColor };

        setGlobalData((prev) => ({ ...prev, notes: [...notes, newNote] }));
    };

    const deleteNote = (id) => 
    {
        setGlobalData((prev) => ({ ...prev, notes: notes.filter((note) => note.id !== id) }));
    };

    const handleInput = (e, noteId) => 
    {
        const textarea = e.target;
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;

        const updatedNotes = notes.map((note) => 
        {
            if (note.id === noteId) return { ...note, text: e.target.value };
            return note;
        });

        setGlobalData((prev) => ({ ...prev, notes: updatedNotes }));
    };

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
                <Brush mode={mode} drawing={drawing} setDrawing={(updatedDrawing) => setGlobalData((prev) => ({ ...prev, drawing: updatedDrawing }))} />
                {notes.map((note) => (
                    <div
                        key={note.id}
                        className={`sticky-note ${note.color}`}
                        style={{ left: `${note.x}px`, top: `${note.y}px` }}
                        onMouseDown={(e) => handleDragStart(e, note)}
                    >
                        <div className="note-header">
                            <button onClick={() => deleteNote(note.id)} className="delete-note-btn">
                                ×
                            </button>
                        </div>
                        <div className="note-body">
                            <textarea
                                className="note-text"
                                value={note.text}
                                onChange={(e) => handleInput(e, note.id)}
                                onFocus={() => setIsTextareaFocused(true)}
                                onBlur={() => setIsTextareaFocused(false)}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Board;

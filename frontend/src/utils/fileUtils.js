export const saveNotes = (notes) => 
{
    const data = JSON.stringify(notes);
    const blob = new Blob([data], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'notes.json';
    link.click();
};
  
export const loadNotes = (file, setNotes) => 
{
    const reader = new FileReader();
    reader.onload = (e) => 
    {
        const loadedNotes = JSON.parse(e.target.result);
        setNotes(loadedNotes);
    };
    reader.readAsText(file);
};
  
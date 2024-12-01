import React, { useRef } from 'react';
import { useGlobalState } from '../../contexts/GlobalStateProvider';
import "./Header.css";

const Header = () => 
{
    const fileInputRef = useRef(null);
    const { globalData, setGlobalData } = useGlobalState();

    const saveData = () => 
    {
        const dataURL = JSON.stringify(globalData);
        const blob = new Blob([dataURL], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'data.json';
        link.click();
    };

    const loadData = (event) => 
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
                    setGlobalData(loadedData);
                } 
                catch (err) 
                {
                    alert('Invalid file format. Please upload a valid .json file.');
                }
            };
            reader.readAsText(file);
        }
    };

    return (
        <header className="header">
            <h1>NoteTella</h1>
            <div className='savenload'>
                <button onClick={saveData} className="header-btn">
                    Save
                </button>
                <button
                    onClick={() => fileInputRef.current.click()}
                    className="header-btn"
                >
                    Load
                </button>
                <input
                    type="file"
                    accept=".json"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={loadData}
                />
            </div>
        </header>
    );
};

export default Header;

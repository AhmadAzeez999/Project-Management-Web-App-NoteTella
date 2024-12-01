import React, { createContext, useState, useContext } from "react";

const GlobalStateContext = createContext();

export const GlobalStateProvider = ({ children }) => 
{
    const [globalData, setGlobalData] = useState({ notes: [], drawing: null, tasks: [] });

    const saveGlobalData = () => 
    {
        const data = JSON.stringify(globalData);
        const blob = new Blob([data], { type: "application/json" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "notetella.nt";
        link.click();
        alert("Data saved successfully!");
    };

    const loadGlobalData = (file) => 
    {
        const reader = new FileReader();
        reader.onload = (e) => 
        {
            try 
            {
                const loadedData = JSON.parse(e.target.result);
                setGlobalData(loadedData);
                alert("Data loaded successfully!");
            } 
            catch (err) 
            {
                alert("Invalid file format. Please upload a valid .nt file.");
            }
        };
        reader.readAsText(file);
    };

    return (
        <GlobalStateContext.Provider value={{ globalData, setGlobalData, saveGlobalData, loadGlobalData }}>
            {children}
        </GlobalStateContext.Provider>
    );
};

export const useGlobalState = () => useContext(GlobalStateContext);

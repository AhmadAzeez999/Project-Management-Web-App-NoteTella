import React from 'react';
import './Sidebar.css';

const Sidebar = () =>
{
    return (
        <div className="sidebar">
            <h1>NoteTella</h1>
            <a href="/">Dashboard</a>
            <a href="/board">Board</a>
            <a href="/time-line">Timeline</a>
        </div>
    );
};

export default Sidebar;
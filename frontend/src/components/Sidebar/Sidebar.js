import React from 'react';
import './Sidebar.css';
import { Link } from 'react-router-dom';

const Sidebar = () =>
{
    return (
        <div className="sidebar">
            <Link to="/">Dashboard</Link>
            <Link to="/board">Board</Link>
            <Link to="/timeline">Timeline</Link>
        </div>
    );
};

export default Sidebar;